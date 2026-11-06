const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

(async () => {
    console.log("Generating Typography Rules PDF...");

    const htmlContent = `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <title>FinAi Tipografi ve Yazı Fontları Kuralları Raporu</title>
    <style>
        @page {
            size: A4;
            margin: 18mm 18mm 18mm 18mm;
        }
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            color: #0E1E38;
            background-color: #ffffff;
            line-height: 1.5;
            font-size: 13px;
        }
        .header {
            border-bottom: 3px solid #1F7A63;
            padding-bottom: 16px;
            margin-bottom: 24px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }
        .header-left h1 {
            font-size: 24px;
            color: #0E1E38;
            font-weight: 800;
            letter-spacing: -0.5px;
            margin-bottom: 4px;
        }
        .header-left p {
            font-size: 13px;
            color: #4A5D78;
            font-weight: 500;
        }
        .header-badge {
            background-color: #0E1E38;
            color: #ffffff;
            padding: 6px 14px;
            border-radius: 8px;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }
        .section {
            margin-bottom: 24px;
            page-break-inside: avoid;
        }
        .section-title {
            font-size: 15px;
            color: #0E1E38;
            font-weight: 700;
            border-left: 4px solid #1F7A63;
            padding-left: 10px;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .card {
            background-color: #F8FAFC;
            border: 1px solid #E2E8F0;
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 14px;
        }
        .rule-box {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-bottom: 16px;
        }
        .rule-item {
            background: #ffffff;
            border: 1px solid #CBD5E1;
            border-radius: 10px;
            padding: 14px;
            text-align: center;
        }
        .rule-item .weight {
            font-size: 20px;
            font-weight: 800;
            color: #1F7A63;
            margin-bottom: 2px;
        }
        .rule-item .role {
            font-size: 12px;
            font-weight: 700;
            color: #0E1E38;
            margin-bottom: 4px;
        }
        .rule-item .desc {
            font-size: 11px;
            color: #64748B;
        }
        .special-rule {
            background: #0E1E38;
            color: #ffffff;
            border-radius: 10px;
            padding: 14px 18px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;
        }
        .special-rule-title {
            font-size: 13px;
            font-weight: 700;
            color: #2EC4B6;
            margin-bottom: 2px;
        }
        .special-rule-desc {
            font-size: 11px;
            color: #CBD5E1;
        }
        .special-rule-badge {
            background: #1F7A63;
            color: #ffffff;
            padding: 5px 12px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 700;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11.5px;
            margin-top: 8px;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #E2E8F0;
        }
        th {
            background-color: #0E1E38;
            color: #ffffff;
            text-align: left;
            padding: 9px 12px;
            font-weight: 600;
            font-size: 11px;
            letter-spacing: 0.3px;
        }
        td {
            padding: 8px 12px;
            border-bottom: 1px solid #E2E8F0;
            color: #334155;
        }
        tr:nth-child(even) {
            background-color: #F8FAFC;
        }
        tr:last-child td {
            border-bottom: none;
        }
        .badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 700;
        }
        .badge-zodiak {
            background-color: #E2E8F0;
            color: #0E1E38;
        }
        .badge-expose {
            background-color: #E6F4EA;
            color: #1F7A63;
            border: 1px solid #1F7A63;
        }
        .palette-row {
            display: flex;
            gap: 12px;
            margin-top: 10px;
        }
        .palette-card {
            flex: 1;
            padding: 12px;
            border-radius: 8px;
            border: 1px solid #CBD5E1;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .palette-color {
            width: 28px;
            height: 28px;
            border-radius: 6px;
            border: 1px solid rgba(0,0,0,0.1);
        }
        .palette-info .hex {
            font-weight: 700;
            font-size: 12px;
            color: #0E1E38;
        }
        .palette-info .pct {
            font-size: 11px;
            color: #64748B;
        }
        .footer {
            margin-top: 24px;
            border-top: 1px solid #E2E8F0;
            padding-top: 10px;
            display: flex;
            justify-content: space-between;
            font-size: 10px;
            color: #94A3B8;
        }
    </style>
</head>
<body>

    <div class="header">
        <div class="header-left">
            <h1>FinAi Tipografi ve Yazı Fontları Kuralları</h1>
            <p>Platform Geneli Yazı Tipi Aileleri, Weight Hiyerarşisi ve Sayı Kuralları Resmi Raporu</p>
        </div>
        <div class="header-badge">
            Resmi Standart v2.0
        </div>
    </div>

    <!-- 1. KULLANILAN YAZI TİPLERİ -->
    <div class="section">
        <div class="section-title">1. Kullanılan Yazı Tipi Aileleri</div>
        <table>
            <thead>
                <tr>
                    <th style="width: 22%;">Yazı Tipi Ailesi</th>
                    <th style="width: 18%;">Tipografik Sınıf</th>
                    <th style="width: 25%;">Desteklenen Formatlar</th>
                    <th style="width: 35%;">Uygulama Alanı & Kural</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Zodiak Variable</strong></td>
                    <td>Modern Kurumsal Serif</td>
                    <td><code>.woff2</code>, <code>.woff</code>, <code>.ttf</code></td>
                    <td>Tüm metinler, başlıklar, alt başlıklar, butonlar, menü ve açıklamalar.</td>
                </tr>
                <tr>
                    <td><strong>Expose Medium</strong></td>
                    <td>Geometrik Sans-Serif</td>
                    <td><code>.woff2</code>, <code>.woff</code>, <code>.ttf</code></td>
                    <td><strong>Sadece Sayılar:</strong> Bakiyeler, yüzdeler, piyasa fiyatları, saat ve tarihler.</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- 2. HİYERARŞİK WEIGHT KURALLARI -->
    <div class="section">
        <div class="section-title">2. Belirlenen Font Kuralları ve Ağırlık (Weight) Hiyerarşisi</div>
        
        <div class="rule-box">
            <div class="rule-item">
                <div class="weight">500</div>
                <div class="role">En Büyük Başlıklar</div>
                <div class="desc">Zodiak Variable (.zodiak-title)<br>Sayfa ana karşılama başlığı</div>
            </div>
            <div class="rule-item">
                <div class="weight">325</div>
                <div class="role">Alt Başlıklar & Butonlar</div>
                <div class="desc">Zodiak Variable (.zodiak-subtitle)<br>Kart başlıkları, sekmeler, CTA'lar</div>
            </div>
            <div class="rule-item">
                <div class="weight">225</div>
                <div class="role">Açıklamalar & Gövde</div>
                <div class="desc">Zodiak Variable (.zodiak-desc)<br>Paragraflar, rehber metinleri</div>
            </div>
        </div>

        <div class="special-rule">
            <div>
                <div class="special-rule-title">ÖZEL SAYI KURALI: "Sadece Sayılarda Olacak Bu"</div>
                <div class="special-rule-desc">Metinlerden bağımsız olarak tüm finansal ve sayısal değerler Expose Medium (font-numbers) ile işlenir.</div>
            </div>
            <div class="special-rule-badge">Expose Medium (Weight 500)</div>
        </div>
    </div>

    <!-- 3. BİLEŞEN BAZLI DAĞILIM TABLOSU -->
    <div class="section">
        <div class="section-title">3. Bileşen Bazlı Tipografi Dağılım Tablosu</div>
        <table>
            <thead>
                <tr>
                    <th>Bileşen</th>
                    <th>Eleman</th>
                    <th>Font Ailesi</th>
                    <th>Weight</th>
                    <th>Örnek Değer</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Hero Alanı</strong></td>
                    <td>Ana Karşılama Başlığı</td>
                    <td><span class="badge badge-zodiak">Zodiak</span></td>
                    <td><strong>500</strong></td>
                    <td>Hoş Geldiniz, Salih KAVAKCI 👋</td>
                </tr>
                <tr>
                    <td><strong>Hero Alanı</strong></td>
                    <td>Açıklama Alt Metni</td>
                    <td><span class="badge badge-zodiak">Zodiak</span></td>
                    <td><strong>225</strong></td>
                    <td>Piyasaları, portföy hareketlerini tek ekranda yönetin.</td>
                </tr>
                <tr>
                    <td><strong>Hero Alanı</strong></td>
                    <td>Eylem Butonu (CTA)</td>
                    <td><span class="badge badge-zodiak">Zodiak</span></td>
                    <td><strong>325</strong></td>
                    <td>Portföy Detayı →</td>
                </tr>
                <tr>
                    <td><strong>Toplam Varlık Kartı</strong></td>
                    <td>Kart Başlığı & Rozet</td>
                    <td><span class="badge badge-zodiak">Zodiak</span></td>
                    <td><strong>325</strong></td>
                    <td>Toplam Varlık Değeri, Canlı Portföy</td>
                </tr>
                <tr>
                    <td><strong>Toplam Varlık Kartı</strong></td>
                    <td>Büyük Portföy Bakiyesi</td>
                    <td><span class="badge badge-expose">Expose (Sayı)</span></td>
                    <td><strong>500</strong></td>
                    <td>₺192.405,00</td>
                </tr>
                <tr>
                    <td><strong>Toplam Varlık Kartı</strong></td>
                    <td>Net Getiri Oranı</td>
                    <td><span class="badge badge-expose">Expose (Sayı)</span></td>
                    <td><strong>500</strong></td>
                    <td>+ %13.33</td>
                </tr>
                <tr>
                    <td><strong>Toplam Varlık Kartı</strong></td>
                    <td>Alt İstatistik Değerleri</td>
                    <td><span class="badge badge-expose">Expose (Sayı)</span></td>
                    <td><strong>500</strong></td>
                    <td>₺169.775,00 / +₺22.630,00 / 4 Varlık</td>
                </tr>
                <tr>
                    <td><strong>Varlık Dağılımı</strong></td>
                    <td>Donut Merkez Toplamı</td>
                    <td><span class="badge badge-expose">Expose (Sayı)</span></td>
                    <td><strong>500</strong></td>
                    <td>₺192.405</td>
                </tr>
                <tr>
                    <td><strong>Varlık Dağılımı</strong></td>
                    <td>Varlık İsimleri / Yüzdeler</td>
                    <td><span class="badge badge-zodiak">Zodiak</span> / <span class="badge badge-expose">Expose</span></td>
                    <td><strong>325 / 500</strong></td>
                    <td>Hisse (%96,1) - Fon (%3,9)</td>
                </tr>
                <tr>
                    <td><strong>FinAi Raporu</strong></td>
                    <td>Başlık / Analiz Paragrafı</td>
                    <td><span class="badge badge-zodiak">Zodiak</span></td>
                    <td><strong>325 / 225</strong></td>
                    <td>FinAi Portföy Raporu / Analiz Metni</td>
                </tr>
                <tr>
                    <td><strong>Günlük Ajanda</strong></td>
                    <td>Sekmeler / Olay Başlığı</td>
                    <td><span class="badge badge-zodiak">Zodiak</span></td>
                    <td><strong>325</strong></td>
                    <td>Tümü, Halka Arz / Tarım Dışı İstihdam</td>
                </tr>
                <tr>
                    <td><strong>Günlük Ajanda</strong></td>
                    <td>Saat / Tarih / İndikatör Sayıları</td>
                    <td><span class="badge badge-expose">Expose (Sayı)</span></td>
                    <td><strong>500</strong></td>
                    <td>15:30, 06.11.2026, 177K, %4,2</td>
                </tr>
                <tr>
                    <td><strong>Piyasa Ticker Şeridi</strong></td>
                    <td>Fiyat & Değişim Rakamları</td>
                    <td><span class="badge badge-expose">Expose (Sayı)</span></td>
                    <td><strong>500</strong></td>
                    <td>₺11.482,60 (%1.32), ₺50,15, ₺6.553,24</td>
                </tr>
                <tr>
                    <td><strong>Son Haberler</strong></td>
                    <td>Haber Başlığı / Yayın Saati</td>
                    <td><span class="badge badge-zodiak">Zodiak</span> / <span class="badge badge-expose">Expose</span></td>
                    <td><strong>325 / 500</strong></td>
                    <td>Haber Başlıkları / 22:43</td>
                </tr>
                <tr>
                    <td><strong>Sol Menü (Sidebar)</strong></td>
                    <td>Workspace / Menü İsimleri</td>
                    <td><span class="badge badge-zodiak">Zodiak</span></td>
                    <td><strong>500 / 325</strong></td>
                    <td>FinAi Workspace / Ana Sayfa, Portföyüm</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- 4. AKTİF RENK PALETİ VE ORANLAR -->
    <div class="section">
        <div class="section-title">4. Aktif Renk Paleti ve 60 - 30 - 10 Oranları Uyumu</div>
        <div class="palette-row">
            <div class="palette-card">
                <div class="palette-color" style="background-color: #FFFFFF;"></div>
                <div class="palette-info">
                    <div class="hex">#FFFFFF (%60)</div>
                    <div class="pct">Ferah Temel Zemin & Çerçevesiz Kartlar</div>
                </div>
            </div>
            <div class="palette-card">
                <div class="palette-color" style="background-color: #0E1E38;"></div>
                <div class="palette-info">
                    <div class="hex">#0E1E38 (%30)</div>
                    <div class="pct">Sol Sidebar & Toplam Varlık Ana Kartı</div>
                </div>
            </div>
            <div class="palette-card">
                <div class="palette-color" style="background-color: #1F7A63;"></div>
                <div class="palette-info">
                    <div class="hex">#1F7A63 (%10)</div>
                    <div class="pct">CTA Butonları, Canlı Rozetler, Aktif Haplar</div>
                </div>
            </div>
        </div>
    </div>

    <div class="footer">
        <span>FinAi Financial Intelligence Platform — Yazı Tipi Kuralları ve Standartları</span>
        <span>Rapor Tarihi: 06.11.2026 | Yerel Sunucu Doğrulaması (localhost:3016)</span>
    </div>

</body>
</html>`;

    const htmlPath = 'C:/Users/kavak/.gemini/antigravity/brain/a165d5ad-cd7b-4f10-b734-85a4982d3ea5/typography_report.html';
    const pdfPath = 'C:/Users/kavak/.gemini/antigravity/brain/a165d5ad-cd7b-4f10-b734-85a4982d3ea5/FinAi_Tipografi_ve_Yazi_Fontlari_Raporu.pdf';
    const projectPdfPath = 'd:/Salih KAVAKCI/FinAi/FinAi_Tipografi_ve_Yazi_Fontlari_Raporu.pdf';

    fs.writeFileSync(htmlPath, htmlContent, 'utf-8');

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto('file:///' + htmlPath.replace(/\\\\/g, '/'), { waitUntil: 'networkidle0' });
    
    await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true,
        margin: { top: '15mm', right: '15mm', bottom: '15mm', left: '15mm' }
    });

    // Also copy to project directory
    fs.copyFileSync(pdfPath, projectPdfPath);

    console.log("PDF successfully generated at:");
    console.log(pdfPath);
    console.log(projectPdfPath);

    await browser.close();
})();
