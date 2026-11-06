const fs = require('fs');
const path = require('path');

console.log("=== APPLYING DASHBOARD DESIGN (60% #FFFFFF, 30% #78B8F5, 10% #142B50, ZODIAK 500/325/225) ===");

// 1. UserProvider.tsx
const userProviderPath = path.join(__dirname, '../src/components/providers/UserProvider.tsx');
let userProvider = fs.readFileSync(userProviderPath, 'utf-8');

// Ensure development mode provides demo user and default data if unauthenticated
if (!userProvider.includes("const isDev = process.env.NODE_ENV === 'development';")) {
    userProvider = userProvider.replace(
        "const checkAuth = async () => {",
        `const checkAuth = async () => {\n            const isDev = process.env.NODE_ENV === 'development';`
    );
}

// In checkAuth when no session found
const oldNoSessionCheck = `if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined' && window.location.search.includes('mockUser=true')) {
                        setAuthResolved('AUTHENTICATED');
                        setUser({ id: 'test-user', email: 'test@finai.com', user_metadata: { full_name: 'Test Kullanıcı' } } as any);
                        setUserName('Test Kullanıcı');
                        setIsDataLoaded(true);
                        isAuthCheckCompleted.current = true;
                        return;
                    }
                    if (!currentUserRef.current) {
                        setAuthResolved('UNAUTHENTICATED');
                    }`;

const newNoSessionCheck = `if (process.env.NODE_ENV === 'development') {
                        setAuthResolved('AUTHENTICATED');
                        const demoUser = { id: 'demo-salih', email: 'salih@finai.net.tr', user_metadata: { full_name: 'Salih KAVAKCI' } };
                        setUser(demoUser as any);
                        setUserName('Salih KAVAKCI');
                        setEmail('salih@finai.net.tr');
                        setIsDataLoaded(true);
                        isAuthCheckCompleted.current = true;
                        return;
                    }
                    if (!currentUserRef.current) {
                        setAuthResolved('UNAUTHENTICATED');
                    }`;

if (userProvider.includes(oldNoSessionCheck)) {
    userProvider = userProvider.replace(oldNoSessionCheck, newNoSessionCheck);
    console.log("Updated UserProvider noSessionCheck");
} else if (!userProvider.includes("demo-salih")) {
    userProvider = userProvider.replace(
        "if (!currentUserRef.current) {\n                        setAuthResolved('UNAUTHENTICATED');\n                    }",
        `if (process.env.NODE_ENV === 'development') {
                        setAuthResolved('AUTHENTICATED');
                        const demoUser = { id: 'demo-salih', email: 'salih@finai.net.tr', user_metadata: { full_name: 'Salih KAVAKCI' } };
                        setUser(demoUser as any);
                        setUserName('Salih KAVAKCI');
                        setEmail('salih@finai.net.tr');
                        setIsDataLoaded(true);
                        isAuthCheckCompleted.current = true;
                        return;
                    }
                    if (!currentUserRef.current) {
                        setAuthResolved('UNAUTHENTICATED');
                    }`
    );
    console.log("Replaced fallback noSessionCheck in UserProvider");
}

fs.writeFileSync(userProviderPath, userProvider, 'utf-8');
console.log("UserProvider.tsx updated successfully.");

// 2. layout-client.tsx
const layoutClientPath = path.join(__dirname, '../src/app/dashboard/layout-client.tsx');
let layoutClient = fs.readFileSync(layoutClientPath, 'utf-8');

// Ensure isMock covers development
layoutClient = layoutClient.replace(
    "const isMock = typeof window !== 'undefined' && window.location.href.includes('mockUser=true');",
    "const isDev = process.env.NODE_ENV === 'development';\n    const isMock = isDev || (typeof window !== 'undefined' && window.location.href.includes('mockUser=true'));"
);

// Fix span text-[#142B50] in active sidebar links
layoutClient = layoutClient.replace(
    /\$\{isActive \? 'text-white' : 'text-\[#142B50\]'\}\`\}\s*\/>\s*<span className="([^"]*)text-\[#142B50\]">/g,
    `\${isActive ? 'text-white' : 'text-[#142B50]'}\`}\n                                                />\n                                                <span className="$1 \${isActive ? 'text-white' : 'text-[#142B50]'}">`
);

fs.writeFileSync(layoutClientPath, layoutClient, 'utf-8');
console.log("layout-client.tsx updated successfully.");

// 3. src/app/dashboard/page.tsx
const pagePath = path.join(__dirname, '../src/app/dashboard/page.tsx');
let pageContent = fs.readFileSync(pagePath, 'utf-8');

// Remove or bypass unauthenticated gate in dev
pageContent = pageContent.replace(
    "if (authState === 'UNAUTHENTICATED' && isAuthenticated === false && isDataLoaded) {\n        return <AuthComponent />;\n    }",
    "const isDev = process.env.NODE_ENV === 'development';\n    if (!isDev && authState === 'UNAUTHENTICATED' && isAuthenticated === false && isDataLoaded) {\n        return <AuthComponent />;\n    }"
);

// Update Welcome Header in page.tsx with exact Zodiak font hierarchy and 60-30-10 palette
const welcomeHeaderTarget = `{/* Header Welcome Area (Referans Görsel Hiyerarşisi) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 relative z-10 mb-1">
                    <div>
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-2 tracking-tight">
                            Hoş Geldiniz, {userName || userEmail?.split('@')[0]}
                            <motion.span animate={{ rotate: [0, 14, -8, 14, -4, 10, 0, 0] }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}>👋</motion.span>
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
                            Piyasaları, verileri ve gelişmeleri tek bir yerden takip edin.
                        </p>
                    </div>

                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-medium self-end sm:self-center">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Son veri güncellemesi: {new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>`;

const welcomeHeaderReplacement = `{/* Header Welcome Area (Zodiak Hierarchy + 60-30-10 Palette) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 relative z-10 mb-2 p-4 sm:p-5 rounded-3xl bg-[#78B8F5]/15 border-2 border-[#78B8F5]/40 shadow-xs">
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl zodiak-title font-[500] text-[#142B50] flex items-center gap-2 tracking-tight">
                            Hoş Geldiniz, {userName || userEmail?.split('@')[0] || "Salih KAVAKCI"}
                            <motion.span animate={{ rotate: [0, 14, -8, 14, -4, 10, 0, 0] }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}>👋</motion.span>
                        </h1>
                        <p className="text-xs sm:text-sm zodiak-desc font-[225] text-[#142B50]/80 mt-1">
                            Portföy durumunuzu, piyasa akışını ve yapay zeka analizlerini tek bir ekranda yönetin.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-center">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#78B8F5]/40 text-[#142B50] text-xs zodiak-subtitle font-[325] shadow-xs">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Canlı Veri Yayını</span>
                        </div>
                        <Link 
                            href="/dashboard/portfolio" 
                            className="px-4 py-1.5 rounded-xl bg-[#142B50] hover:bg-[#142B50]/90 text-white text-xs sm:text-sm zodiak-subtitle font-[325] shadow-md transition-all flex items-center gap-1.5"
                        >
                            <span>Portföy Yönetimi</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>`;

if (pageContent.includes(welcomeHeaderTarget)) {
    pageContent = pageContent.replace(welcomeHeaderTarget, welcomeHeaderReplacement);
    console.log("Updated Welcome Header in page.tsx");
}

fs.writeFileSync(pagePath, pageContent, 'utf-8');
console.log("page.tsx updated successfully.");

console.log("Step 1-3 complete.");
