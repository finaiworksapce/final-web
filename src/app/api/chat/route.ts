import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const MAX_PROMPT_CHARS = 1500;
const MAX_HISTORY_MESSAGES = 16;

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => null);
        if (!body || typeof body !== "object") {
            return NextResponse.json(
                { reply: "Geçersiz istek gövdesi." },
                { status: 400 }
            );
        }

        const { message, history } = body;

        // 1. Girdi Doğrulama ve Uzunluk Koruması (Prompt Bombing & Token Exhaustion Guard)
        if (!message || typeof message !== "string" || message.trim().length === 0) {
            return NextResponse.json(
                { reply: "Lütfen geçerli bir soru veya mesaj girin." },
                { status: 400 }
            );
        }

        const sanitizedMessage = message.trim();
        if (sanitizedMessage.length > MAX_PROMPT_CHARS) {
            return NextResponse.json(
                { reply: `Mesajınız güvenlik sınırını aşıyor (Maksimum ${MAX_PROMPT_CHARS} karakter). Lütfen sorunuzu kısaltarak iletin.` },
                { status: 400 }
            );
        }

        // 2. LLM Guardrail: Prompt Injection, Jailbreak & System Leaking Defense
        const PROMPT_INJECTION_PATTERNS = [
            /\bignore\b.*\b(previous|above|all)\b.*\b(instructions|prompts|rules)\b/i,
            /\b(sistem|system)\s*(komutunu|promptunu|talimatını|prompt|directive|message)\s*(göster|yaz|söyle|oku|print|reveal|expose)\b/i,
            /\byou are now in developer mode\b/i,
            /\b(dan mode|jailbreak)\b/i,
            /\b(api[_-]?key|secret[_-]?key)\b/i
        ];

        for (const pattern of PROMPT_INJECTION_PATTERNS) {
            if (pattern.test(sanitizedMessage)) {
                return NextResponse.json({
                    reply: "FinAi güvenlik ve gizlilik kuralları gereğince sistem yönergeleri, geliştirici komutları veya hassas yapılandırmalar paylaşılamaz. Size finansal piyasalar, hisse analizleri ve portföy yönetimi konularında nasıl yardımcı olabilirim?"
                });
            }
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { reply: "Sistem hatası: API yapılandırması eksik." },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
        });

        // 2. Geçmiş Derinliği Sınırlandırması (Context Window Bombing Guard)
        let chatHistory: any[] = [];
        if (history && Array.isArray(history)) {
            const trimmedHistory = history.slice(-MAX_HISTORY_MESSAGES);
            chatHistory = trimmedHistory
                .filter((msg: any) => msg && (msg.role === "user" || msg.role === "model") && Array.isArray(msg.parts))
                .map((msg: any) => ({
                    role: msg.role,
                    parts: msg.parts.slice(0, 3) // Her mesajda maks 3 parça
                }));
        }

        // 3. Sistem Yönergesi
        const systemPrompt = "Sen FinAi adında, son teknoloji bir yapay zeka finans asistanısın. Görevin kullanıcılara yardımcı olurken sürekli olarak FinAi platformunun üstün özelliklerini (Yapay zeka tahminleri, anlık risk analizi, portföy optimizasyonu) övmek ve vurgulamaktır. Kullanıcıyı nazikçe Premium üyeliğe yönlendir. Finansal konularda bilgilisin ama önceliğin platformu pazarlamak. Asla yatırım tavsiyesi (YTD) verme. Yanıtların Türkçe, samimi, profesyonel ve kısa olsun.";

        const chat = model.startChat({
            history: chatHistory,
        });

        const finalMessage = `${systemPrompt}\n\nKullanıcı Mesajı: ${sanitizedMessage}`;

        const result = await chat.sendMessage(finalMessage);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ reply: text });

    } catch (error: any) {
        console.error("Gemini API Hata Yakalandı:", error);

        let userFacingError = "Üzgünüm, isteğiniz işlenirken teknik bir aksaklık oluştu. Lütfen birkaç saniye sonra tekrar deneyin.";
        if (error?.status === 429 || error?.message?.includes("429")) {
            userFacingError = "Yapay zeka asistanı şu anda yoğun talep görüyor. Lütfen bir dakika sonra tekrar deneyin.";
        }

        return NextResponse.json(
            { reply: userFacingError },
            { status: 200 }
        );
    }
}
