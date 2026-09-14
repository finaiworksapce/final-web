'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { PortfolioService, Asset } from '@/lib/portfolio-service';
import { Wallet, Activity, BarChart2 } from 'lucide-react';

export type AuthState = 'INITIALIZING' | 'AUTHENTICATED' | 'UNAUTHENTICATED';

interface UserContextType {
    user: User | null;
    avatarUrl: string | null;
    setAvatarUrl: (url: string | null) => void;
    userName: string | null;
    setUserName: (name: string | null) => void;
    email: string | null;
    setEmail: (email: string | null) => void;
    userMetadata: any;
    isAuthenticated: boolean | null;
    authState: AuthState;
    updateProfile: (updates: { [key: string]: any }) => Promise<void>;
    // Data states
    myAssets: Asset[];
    prices: Record<string, number>;
    stats: any[];
    portfolioHistory: any[];
    isDataLoaded: boolean;
    refreshDashboardData: () => Promise<void>;
    globalNews: any[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [userMetadata, setUserMetadata] = useState<any>(null);
    const [authState, setAuthState] = useState<AuthState>('INITIALIZING');
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [myAssets, setMyAssets] = useState<Asset[]>([]);
    const [prices, setPrices] = useState<Record<string, number>>({});
    const [stats, setStats] = useState<any[]>([]);
    const [portfolioHistory, setPortfolioHistory] = useState<any[]>([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [globalNews, setGlobalNews] = useState<any[]>([]);

    const currentUserRef = React.useRef<User | null>(null);
    currentUserRef.current = user;

    const setAuthResolved = (state: 'AUTHENTICATED' | 'UNAUTHENTICATED') => {
        setAuthState(state);
        setIsAuthenticated(state === 'AUTHENTICATED');
    };

    const prefetchNews = async () => {
        try {
            const res = await fetch('/api/news');
            const data = await res.json();
            if (data.success) {
                const items = data.news || data.data || [];
                setGlobalNews(items);
            }
        } catch (error) {
            console.error("Background news prefetch error:", error);
        }
    };

    useEffect(() => {
        if (isAuthenticated && globalNews.length === 0) {
            prefetchNews();
            // Refresh news every 30 mins in background (longer interval to protect quota)
            const interval = setInterval(prefetchNews, 30 * 60 * 1000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated, globalNews.length]);

    // Her 60 saniyede bir canlı fiyatları ve portföy istatistiklerini arka planda güncelle
    useEffect(() => {
        if (!isAuthenticated) return;
        // İlk açılışta anında fiyatları ön yükle (SessionStorage cache desteğiyle)
        const cachedPrices = sessionStorage.getItem('finai_global_prices');
        if (cachedPrices) {
            try {
                setPrices(JSON.parse(cachedPrices));
            } catch {}
        }

        refreshDashboardData();

        const interval = setInterval(() => {
            refreshDashboardData();
        }, 60000);
        return () => clearInterval(interval);
    }, [isAuthenticated]);

    // Use a ref to track if auth check has completed to avoid closure staleness in timeout
    const isAuthCheckCompleted = React.useRef(false);

    useEffect(() => {
        // Load persisted state if any from localStorage (basic persistence)
        const storedAvatar = localStorage.getItem('user_avatar_url');
        if (storedAvatar) setAvatarUrl(storedAvatar);
    }, []);

    const refreshDashboardData = async () => {
        try {
            // Pass user?.id directly to avoid redundant network auth roundtrips
            const assets = await PortfolioService.getAssets(currentUserRef.current?.id);
            setMyAssets(assets);

            if (assets.length > 0) {
                const uniqueSymbols = Array.from(new Set(assets.map(a => a.symbol))).join(',');
                const res = await fetch(`/api/finance?symbols=${uniqueSymbols}`);
                const json = await res.json();

                const priceMap: Record<string, number> = {};
                if (json.results) {
                    json.results.forEach((r: any) => {
                        if (r.symbol && r.regularMarketPrice) {
                            const symbolUpper = r.symbol.toUpperCase();
                            priceMap[symbolUpper] = r.regularMarketPrice;
                            if (symbolUpper.endsWith('.IS')) {
                                priceMap[symbolUpper.replace('.IS', '')] = r.regularMarketPrice;
                            }
                        }
                    });
                    setPrices(priceMap);
                    sessionStorage.setItem('finai_global_prices', JSON.stringify(priceMap));
                }

                // Calculate stats (Portföyüm sayfası ile %100 birebir aynı fiyat eşleşmesi)
                let totalVal = 0;
                let totalCost = 0;
                assets.forEach(a => {
                    const symUpper = a.symbol.toUpperCase();
                    const symClean = symUpper.replace(/\.IS$/, '');
                    const currentPrice = priceMap[symUpper] ?? priceMap[symClean] ?? priceMap[`${symClean}.IS`] ?? a.avgCost;

                    totalVal += currentPrice * a.quantity;
                    totalCost += a.avgCost * a.quantity;
                });

                const profit = totalVal - totalCost;
                const profitPercent = totalCost > 0 ? (profit / totalCost) * 100 : 0;

                setStats([
                    {
                        title: "Toplam Portföy",
                        value: `₺${totalVal.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                        change: `${profitPercent >= 0 ? '+' : ''}%${profitPercent.toFixed(2)}`,
                        isPositive: profitPercent >= 0,
                        icon: Wallet,
                        gradient: "from-blue-500/20 to-purple-500/20",
                        border: "border-blue-500/20"
                    },
                    {
                        title: "Toplam Kar/Zarar",
                        value: `₺${profit.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                        change: "Net",
                        isPositive: profit >= 0,
                        icon: Activity,
                        gradient: profit >= 0 ? "from-green-500/20 to-emerald-500/20" : "from-red-500/20 to-orange-500/20",
                        border: profit >= 0 ? "border-green-500/20" : "border-red-500/20"
                    },
                    {
                        title: "Varlık Sayısı",
                        value: Array.from(new Set(assets.map(a => a.symbol))).length.toString(),
                        change: "Aktif",
                        isPositive: true,
                        icon: BarChart2,
                        gradient: "from-orange-500/20 to-red-500/20",
                        border: "border-orange-500/20"
                    }
                ]);

                // Sadece geçerli ve çekilmiş fiyatlar varsa istemci snapshot'ı kaydet (Gündüz koruması)
                if (Object.keys(priceMap).length > 0 && totalVal > 0) {
                    await PortfolioService.saveSnapshot(
                        totalVal,
                        profit,
                        totalCost,
                        Array.from(new Set(assets.map(a => a.symbol))).length
                    );
                }

                const history = await PortfolioService.getHistory('1W');
                setPortfolioHistory(history);
            } else {
                setStats([
                    { title: "Toplam Portföy", value: "₺0,00", change: "%0", isPositive: true, icon: Wallet, gradient: "from-blue-500/20 to-purple-500/20", border: "border-blue-500/20" },
                    { title: "Toplam Kar/Zarar", value: "₺0,00", change: "Net", isPositive: true, icon: Activity, gradient: "from-green-500/20 to-emerald-500/20", border: "border-green-500/20" },
                    { title: "Varlık Sayısı", value: "0", change: "Yok", isPositive: true, icon: BarChart2, gradient: "from-orange-500/20 to-red-500/20", border: "border-orange-500/20" }
                ]);
            }
            setIsDataLoaded(true);
        } catch (error) {
            // ÖNEMLİ: Geçici ağ/oturum hatasında mevcut myAssets veya stats'i ASLA sıfırlama!
            // Stale-while-revalidate mantığıyla son geçerli veriyi koru.
            console.warn("[UserProvider] Portföy verisi yenileme geçici uyarısı:", error);
            setIsDataLoaded(true); // Ekran kilidini aç
        }
    };

    useEffect(() => {
        let isMounted = true;

        const applyUserSession = (sessionUser: User) => {
            if (!isMounted) return;
            setAuthResolved('AUTHENTICATED');
            setUser(sessionUser);
            const metadata = sessionUser.user_metadata;
            setUserMetadata(metadata);

            setEmail(sessionUser.email || null);

            let name = "Kullanıcı";
            if (metadata?.full_name) {
                name = metadata.full_name;
            } else if (metadata?.first_name && metadata?.last_name) {
                name = `${metadata.first_name} ${metadata.last_name}`;
            } else {
                name = sessionUser.email?.split('@')[0] || "Kullanıcı";
            }
            setUserName(name);

            if (metadata?.avatar_url) {
                setAvatarUrl(metadata.avatar_url);
                localStorage.setItem('user_avatar_url', metadata.avatar_url);
            }
        };

        const clearUserSession = () => {
            if (!isMounted) return;
            setAuthResolved('UNAUTHENTICATED');
            setUser(null);
            setUserName(null);
            setEmail(null);
            setUserMetadata(null);
            setAvatarUrl(null);
            setMyAssets([]);
            setStats([]);
            setPortfolioHistory([]);
            localStorage.removeItem('user_avatar_url');
        };

        // Initial Auth Check
        const checkAuth = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                    console.warn("[UserProvider] Supabase session kontrol uyarısı:", error.message);
                    if (!currentUserRef.current) {
                        setAuthResolved('UNAUTHENTICATED');
                    }
                    isAuthCheckCompleted.current = true;
                    return;
                }

                if (session?.user) {
                    if (process.env.NODE_ENV === 'development') {
                        console.log("[Auth] Aktif oturum doğrulandı:", session.user.id);
                    }
                    applyUserSession(session.user);
                    refreshDashboardData();
                } else {
                    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined' && window.location.search.includes('mockUser=true')) {
                        setAuthResolved('AUTHENTICATED');
                        setUser({ id: 'test-user', email: 'test@finai.com', user_metadata: { full_name: 'Test Kullanıcı' } } as any);
                        setUserName('Test Kullanıcı');
                        setIsDataLoaded(true);
                        isAuthCheckCompleted.current = true;
                        return;
                    }
                    if (!currentUserRef.current) {
                        setAuthResolved('UNAUTHENTICATED');
                    }
                }
                isAuthCheckCompleted.current = true;
            } catch (err) {
                console.warn("[UserProvider] Auth check internal warning:", err);
                if (!currentUserRef.current) {
                    setAuthResolved('UNAUTHENTICATED');
                }
                isAuthCheckCompleted.current = true;
            }
        };
        checkAuth();

        // Supabase Auth Listener (Event bazlı kontrollü filtreleme)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (!isMounted) return;

            if (process.env.NODE_ENV === 'development') {
                console.log(`[Auth Event] ${event}`, session?.user?.id ? `(User: ${session.user.id})` : '(No Session)');
            }

            switch (event) {
                case 'SIGNED_IN':
                case 'TOKEN_REFRESHED':
                case 'USER_UPDATED':
                    if (session?.user) {
                        applyUserSession(session.user);
                        refreshDashboardData();
                    }
                    isAuthCheckCompleted.current = true;
                    break;

                case 'INITIAL_SESSION':
                    if (session?.user) {
                        applyUserSession(session.user);
                        refreshDashboardData();
                    } else if (!currentUserRef.current) {
                        setAuthResolved('UNAUTHENTICATED');
                    }
                    isAuthCheckCompleted.current = true;
                    break;

                case 'SIGNED_OUT':
                    if (process.env.NODE_ENV === 'development') {
                        console.log('[Auth] Gerçek SIGNED_OUT algılandı, oturum temizleniyor.');
                    }
                    clearUserSession();
                    isAuthCheckCompleted.current = true;
                    break;

                default:
                    // Bilinmeyen veya geçici ara durumlarda (örn. network dalgalanması):
                    // Eğer session varsa güncelle; yoksa aktif authenticated kullanıcıyı ASLA logout etme!
                    if (session?.user) {
                        applyUserSession(session.user);
                    }
                    break;
            }
        });

        // Safety timeout: Yalnızca UI kilitlenmesini çözer, KULLANICIYI ASLA LOGOUT ETMEZ!
        const safetyTimeout = setTimeout(() => {
            if (!isAuthCheckCompleted.current) {
                console.warn("[UserProvider] Auth check gecikmesi (zaman aşımı). Ekran kilidi açılıyor, oturum zorla sonlandırılmıyor.");
                isAuthCheckCompleted.current = true;
                setIsDataLoaded(true);
                // Sadece daha önce hiçbir session kaydedilmemişse fallback unauthenticated yap
                if (!currentUserRef.current) {
                    setAuthResolved('UNAUTHENTICATED');
                }
            }
        }, 8000);

        return () => {
            isMounted = false;
            subscription.unsubscribe();
            clearTimeout(safetyTimeout);
        };
    }, []);

    // Wrap setAvatarUrl to handle persistence
    const updateAvatar = (url: string | null) => {
        setAvatarUrl(url);
        if (url) {
            localStorage.setItem('user_avatar_url', url);
        } else {
            localStorage.removeItem('user_avatar_url');
        }
    };

    const updateProfile = async (updates: { [key: string]: any }) => {
        try {
            const { error } = await supabase.auth.updateUser({
                data: updates
            });

            if (error) throw error;

            // Optimistic update for specific fields we track
            if (updates.full_name) setUserName(updates.full_name);
            // Optimistic metadata update
            setUserMetadata((prev: any) => ({ ...prev, ...updates }));

        } catch (error) {
            console.error("Error updating profile:", error);
            throw error;
        }
    };

    return (
        <UserContext.Provider value={{
            user,
            avatarUrl,
            setAvatarUrl: updateAvatar,
            userName,
            setUserName,
            email,
            setEmail,
            userMetadata,
            isAuthenticated,
            authState,
            updateProfile,
            myAssets,
            prices,
            stats,
            portfolioHistory,
            isDataLoaded,
            refreshDashboardData,
            globalNews
        }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);

    // If we're on the server, return a mock context to avoid SSR errors
    if (typeof window === 'undefined') {
        return {
            user: null,
            avatarUrl: null,
            setAvatarUrl: () => { },
            userName: null,
            setUserName: () => { },
            email: null,
            setEmail: () => { },
            userMetadata: null,
            isAuthenticated: null,
            authState: 'INITIALIZING',
            updateProfile: async () => { },
            myAssets: [],
            prices: {},
            stats: [],
            portfolioHistory: [],
            isDataLoaded: false,
            refreshDashboardData: async () => { },
            globalNews: []
        } as UserContextType;
    }

    if (context === undefined) {
        // Returning a default state for server-side rendering or outside provider
        return {
            user: null,
            avatarUrl: null,
            setAvatarUrl: () => { },
            userName: null,
            setUserName: () => { },
            email: null,
            setEmail: () => { },
            userMetadata: null,
            isAuthenticated: null,
            authState: 'INITIALIZING',
            updateProfile: async () => { },
            myAssets: [],
            prices: {},
            stats: [],
            portfolioHistory: [],
            isDataLoaded: false,
            refreshDashboardData: async () => { },
            globalNews: []
        } as UserContextType;
    }
    return context;
}
