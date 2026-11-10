export interface CatalogCalendarEvent {
    id: string;
    dateFormatted: string; // e.g. "03.11.2026"
    dateDayName: string; // e.g. "Salı"
    time: string; // e.g. "10:00"
    country: 'TR' | 'ABD' | 'EU' | 'UK';
    flag: string;
    event: string;
    forecast: string;
    previous: string;
    actual: string;
    impact: 'low' | 'medium' | 'high' | 'critical';
    isToday?: boolean;
    isTomorrow?: boolean;
    weekOffset: number;
    originalDate?: any;
    releasedAt?: string;
}

// 30 Makroekonomik Gösterge (33 Takvim Kaydı) — TradingView & Resmi Veri Takvimi Gerçek Tarih ve Değerleri
export const ECONOMIC_CALENDAR_CATALOG: CatalogCalendarEvent[] = [
    // --- 02 KASIM 2026 PAZARTESİ ---
    {
        id: "tr_trade_balance_1",
        dateFormatted: "02.11.2026",
        dateDayName: "Pazartesi",
        time: "11:00",
        country: "TR",
        flag: "🇹🇷",
        event: "Dış Ticaret Dengesi (Öncü)",
        forecast: "-6,20 B $",
        previous: "-5,23 B $",
        actual: "-6,70 B $",
        impact: "high",
        weekOffset: 0
    },
    {
        id: "eu_manufacturing_pmi_1",
        dateFormatted: "02.11.2026",
        dateDayName: "Pazartesi",
        time: "12:00",
        country: "EU",
        flag: "🇪🇺",
        event: "S&P Global İmalat PMI (Nihai)",
        forecast: "52,4",
        previous: "52,0",
        actual: "52,4",
        impact: "medium",
        weekOffset: 0
    },
    {
        id: "uk_manufacturing_pmi_1",
        dateFormatted: "02.11.2026",
        dateDayName: "Pazartesi",
        time: "12:30",
        country: "UK",
        flag: "🇬🇧",
        event: "S&P Global İmalat PMI (Nihai)",
        forecast: "52,8",
        previous: "52,3",
        actual: "52,8",
        impact: "medium",
        weekOffset: 0
    },
    {
        id: "us_ism_pmi_1",
        dateFormatted: "02.11.2026",
        dateDayName: "Pazartesi",
        time: "18:00",
        country: "ABD",
        flag: "🇺🇸",
        event: "ISM İmalat PMI Endeksi",
        forecast: "54,5",
        previous: "54,5",
        actual: "55,5",
        impact: "high",
        weekOffset: 0
    },
    {
        id: "us_ism_prices_1",
        dateFormatted: "02.11.2026",
        dateDayName: "Pazartesi",
        time: "18:00",
        country: "ABD",
        flag: "🇺🇸",
        event: "ISM İmalat Fiyat Endeksi",
        forecast: "77,5",
        previous: "77,9",
        actual: "75,2",
        impact: "high",
        weekOffset: 0
    },
    {
        id: "us_construction_1",
        dateFormatted: "02.11.2026",
        dateDayName: "Pazartesi",
        time: "18:00",
        country: "ABD",
        flag: "🇺🇸",
        event: "Aylık İnşaat Harcamaları",
        forecast: "%0,3",
        previous: "%2,0",
        actual: "-%1,9",
        impact: "medium",
        weekOffset: 0
    },

    // --- 03 KASIM 2026 SALI ---
    {
        id: "tr_cpi_mom_1",
        dateFormatted: "03.11.2026",
        dateDayName: "Salı",
        time: "10:00",
        country: "TR",
        flag: "🇹🇷",
        event: "Aylık Tüketici Fiyat Endeksi (TÜFE)",
        forecast: "%2,40",
        previous: "%1,84",
        actual: "%2,58",
        impact: "critical",
        weekOffset: 0
    },
    {
        id: "tr_cpi_yoy_1",
        dateFormatted: "03.11.2026",
        dateDayName: "Salı",
        time: "10:00",
        country: "TR",
        flag: "🇹🇷",
        event: "Yıllık Enflasyon Oranı (TÜFE)",
        forecast: "%29,56",
        previous: "%29,73",
        actual: "%29,77",
        impact: "critical",
        weekOffset: 0
    },
    {
        id: "tr_ppi_mom_1",
        dateFormatted: "03.11.2026",
        dateDayName: "Salı",
        time: "10:00",
        country: "TR",
        flag: "🇹🇷",
        event: "Aylık Üretici Fiyat Endeksi (ÜFE)",
        forecast: "%1,90",
        previous: "%2,07",
        actual: "%1,65",
        impact: "high",
        weekOffset: 0
    },
    {
        id: "us_factory_orders_1",
        dateFormatted: "03.11.2026",
        dateDayName: "Salı",
        time: "18:00",
        country: "ABD",
        flag: "🇺🇸",
        event: "Aylık Fabrika Siparişleri",
        forecast: "%1,2",
        previous: "%0,3",
        actual: "%1,8",
        impact: "medium",
        weekOffset: 0
    },

    // --- 04 KASIM 2026 ÇARŞAMBA ---
    {
        id: "us_services_pmi_1",
        dateFormatted: "04.11.2026",
        dateDayName: "Çarşamba",
        time: "17:45",
        country: "ABD",
        flag: "🇺🇸",
        event: "S&P Global Hizmet PMI (Nihai)",
        forecast: "55,0",
        previous: "55,2",
        actual: "55,0",
        impact: "medium",
        weekOffset: 0
    },
    {
        id: "us_ism_services_1",
        dateFormatted: "04.11.2026",
        dateDayName: "Çarşamba",
        time: "18:00",
        country: "ABD",
        flag: "🇺🇸",
        event: "ISM İmalat Dışı (Hizmet) PMI",
        forecast: "54,8",
        previous: "54,9",
        actual: "54,5",
        impact: "high",
        weekOffset: 0
    },
    {
        id: "us_crude_oil_1",
        dateFormatted: "04.11.2026",
        dateDayName: "Çarşamba",
        time: "18:30",
        country: "ABD",
        flag: "🇺🇸",
        event: "Haftalık Ham Petrol Stokları",
        forecast: "1,750 M",
        previous: "-1,892 M",
        actual: "-0,865 M",
        impact: "medium",
        weekOffset: 0
    },

    // --- 05 KASIM 2026 PERŞEMBE ---
    {
        id: "eu_ppi_mom_1",
        dateFormatted: "05.11.2026",
        dateDayName: "Perşembe",
        time: "13:00",
        country: "EU",
        flag: "🇪🇺",
        event: "Aylık Üretici Fiyat Endeksi (ÜFE)",
        forecast: "%2,5",
        previous: "%2,0",
        actual: "%2,5",
        impact: "medium",
        weekOffset: 0
    },
    {
        id: "uk_boe_rate_1",
        dateFormatted: "05.11.2026",
        dateDayName: "Perşembe",
        time: "15:00",
        country: "UK",
        flag: "🇬🇧",
        event: "İngiltere Merkez Bankası (BoE) Faiz Kararı",
        forecast: "%4,00",
        previous: "%3,75",
        actual: "%4,00",
        impact: "critical",
        weekOffset: 0
    },
    {
        id: "us_jobless_claims_1",
        dateFormatted: "05.11.2026",
        dateDayName: "Perşembe",
        time: "16:30",
        country: "ABD",
        flag: "🇺🇸",
        event: "İşsizlik Haklarından Yararlanma Başvuruları",
        forecast: "196K",
        previous: "195K",
        actual: "189K",
        impact: "high",
        weekOffset: 0
    },

    // --- 06 KASIM 2026 CUMA ---
    {
        id: "us_nfp_1",
        dateFormatted: "06.11.2026",
        dateDayName: "Cuma",
        time: "16:30",
        country: "ABD",
        flag: "🇺🇸",
        event: "Tarım Dışı İstihdam Değişimi (NFP)",
        forecast: "65K",
        previous: "60K",
        actual: "165K",
        impact: "critical",
        weekOffset: 0
    },
    {
        id: "us_unemp_1",
        dateFormatted: "06.11.2026",
        dateDayName: "Cuma",
        time: "16:30",
        country: "ABD",
        flag: "🇺🇸",
        event: "ABD İşsizlik Oranı",
        forecast: "%4,2",
        previous: "%4,2",
        actual: "%4,1",
        impact: "critical",
        weekOffset: 0
    },
    {
        id: "us_hourly_earnings_1",
        dateFormatted: "06.11.2026",
        dateDayName: "Cuma",
        time: "16:30",
        country: "ABD",
        flag: "🇺🇸",
        event: "Aylık Ortalama Saatlik Kazançlar",
        forecast: "%0,3",
        previous: "%0,3",
        actual: "%0,4",
        impact: "high",
        weekOffset: 0
    },
    {
        id: "us_michigan_2",
        dateFormatted: "06.11.2026",
        dateDayName: "Cuma",
        time: "18:00",
        country: "ABD",
        flag: "🇺🇸",
        event: "Michigan Tüketici Duyarlılık Endeksi (Öncü)",
        forecast: "48,0",
        previous: "46,3",
        actual: "51,0",
        impact: "medium",
        weekOffset: 0
    },

    // --- 10 KASIM 2026 SALI ---
    {
        id: "tr_ind_prod_1",
        dateFormatted: "10.11.2026",
        dateDayName: "Salı",
        time: "10:00",
        country: "TR",
        flag: "🇹🇷",
        event: "Aylık Sanayi Üretim Endeksi",
        forecast: "%1,2",
        previous: "-%1,0",
        actual: "%2,1",
        impact: "medium",
        weekOffset: 1
    },
    {
        id: "us_cpi_mom_2",
        dateFormatted: "10.11.2026",
        dateDayName: "Salı",
        time: "16:30",
        country: "ABD",
        flag: "🇺🇸",
        event: "ABD Aylık Tüketici Fiyat Endeksi (TÜFE)",
        forecast: "%0,3",
        previous: "%0,6",
        actual: "Bekleniyor",
        impact: "critical",
        weekOffset: 1
    },
    {
        id: "us_cpi_yoy_2",
        dateFormatted: "10.11.2026",
        dateDayName: "Salı",
        time: "16:30",
        country: "ABD",
        flag: "🇺🇸",
        event: "ABD Yıllık Enflasyon Oranı (TÜFE)",
        forecast: "%3,9",
        previous: "%3,7",
        actual: "Bekleniyor",
        impact: "critical",
        weekOffset: 1
    },

    // --- 12 KASIM 2026 PERŞEMBE ---
    {
        id: "us_jobless_claims_2",
        dateFormatted: "12.11.2026",
        dateDayName: "Perşembe",
        time: "16:30",
        country: "ABD",
        flag: "🇺🇸",
        event: "İşsizlik Haklarından Yararlanma Başvuruları",
        forecast: "195K",
        previous: "189K",
        actual: "Bekleniyor",
        impact: "high",
        weekOffset: 1
    },
    {
        id: "us_crude_oil_2",
        dateFormatted: "12.11.2026",
        dateDayName: "Perşembe",
        time: "20:00",
        country: "ABD",
        flag: "🇺🇸",
        event: "Haftalık Ham Petrol Stokları",
        forecast: "0,500 M",
        previous: "-0,865 M",
        actual: "Bekleniyor",
        impact: "medium",
        weekOffset: 1
    },

    // --- 13 KASIM 2026 CUMA ---
    {
        id: "eu_gdp_qoq_2",
        dateFormatted: "13.11.2026",
        dateDayName: "Cuma",
        time: "13:00",
        country: "EU",
        flag: "🇪🇺",
        event: "Euro Bölgesi Çeyreklik Büyüme (GSYH)",
        forecast: "%0,4",
        previous: "%0,4",
        actual: "Bekleniyor",
        impact: "high",
        weekOffset: 1
    },
    {
        id: "us_ppi_mom_2",
        dateFormatted: "13.11.2026",
        dateDayName: "Cuma",
        time: "16:30",
        country: "ABD",
        flag: "🇺🇸",
        event: "ABD Aylık Üretici Fiyat Endeksi (ÜFE)",
        forecast: "%0,4",
        previous: "%1,3",
        actual: "Bekleniyor",
        impact: "high",
        weekOffset: 1
    },

    // --- 17 KASIM 2026 SALI ---
    {
        id: "tr_home_sales_3",
        dateFormatted: "17.11.2026",
        dateDayName: "Salı",
        time: "10:00",
        country: "TR",
        flag: "🇹🇷",
        event: "Türkiye Konut Satış İstatistikleri",
        forecast: "130,0K",
        previous: "128,4K",
        actual: "Bekleniyor",
        impact: "medium",
        weekOffset: 2
    },
    {
        id: "us_retail_sales_2",
        dateFormatted: "17.11.2026",
        dateDayName: "Salı",
        time: "16:30",
        country: "ABD",
        flag: "🇺🇸",
        event: "ABD Aylık Perakende Satışlar",
        forecast: "%0,0",
        previous: "%0,8",
        actual: "Bekleniyor",
        impact: "high",
        weekOffset: 2
    },

    // --- 18 KASIM 2026 ÇARŞAMBA ---
    {
        id: "us_building_permits_3",
        dateFormatted: "18.11.2026",
        dateDayName: "Çarşamba",
        time: "16:30",
        country: "ABD",
        flag: "🇺🇸",
        event: "ABD Yapı Ruhsatları",
        forecast: "1,41 M",
        previous: "1,40 M",
        actual: "Bekleniyor",
        impact: "medium",
        weekOffset: 2
    },
    {
        id: "us_fomc_minutes_2",
        dateFormatted: "18.11.2026",
        dateDayName: "Çarşamba",
        time: "22:00",
        country: "ABD",
        flag: "🇺🇸",
        event: "FOMC Toplantı Tutanakları (Fed)",
        forecast: "-",
        previous: "-",
        actual: "Bekleniyor",
        impact: "critical",
        weekOffset: 2
    },

    // --- 19 KASIM 2026 PERŞEMBE ---
    {
        id: "us_jobless_claims_3",
        dateFormatted: "19.11.2026",
        dateDayName: "Perşembe",
        time: "16:30",
        country: "ABD",
        flag: "🇺🇸",
        event: "İşsizlik Haklarından Yararlanma Başvuruları",
        forecast: "195K",
        previous: "189K",
        actual: "Bekleniyor",
        impact: "high",
        weekOffset: 2
    },

    // --- 20 KASIM 2026 CUMA ---
    {
        id: "eu_consumer_conf_3",
        dateFormatted: "20.11.2026",
        dateDayName: "Cuma",
        time: "18:00",
        country: "EU",
        flag: "🇪🇺",
        event: "Euro Bölgesi Tüketici Güven Endeksi (Öncü)",
        forecast: "-17,5",
        previous: "-17,9",
        actual: "Bekleniyor",
        impact: "medium",
        weekOffset: 2
    },

    // --- 30 KASIM 2026 PAZARTESİ ---
    {
        id: "tr_unemp_1",
        dateFormatted: "30.11.2026",
        dateDayName: "Pazartesi",
        time: "10:00",
        country: "TR",
        flag: "🇹🇷",
        event: "Türkiye İşsizlik Oranı",
        forecast: "%8,3",
        previous: "%8,4",
        actual: "Bekleniyor",
        impact: "medium",
        weekOffset: 2
    },

    // --- MERKEZ BANKASI FAİZ KARARLARI ---
    {
        id: "us_fed_rate_3",
        dateFormatted: "09.12.2026",
        dateDayName: "Çarşamba",
        time: "22:00",
        country: "ABD",
        flag: "🇺🇸",
        event: "Fed Politika Faizi Kararı",
        forecast: "%4,00",
        previous: "%4,00",
        actual: "Bekleniyor",
        impact: "critical",
        weekOffset: 2
    },
    {
        id: "tr_tcmb_rate_2",
        dateFormatted: "10.12.2026",
        dateDayName: "Perşembe",
        time: "14:00",
        country: "TR",
        flag: "🇹🇷",
        event: "TCMB Politika Faizi Kararı",
        forecast: "%35,00",
        previous: "%36,00",
        actual: "Bekleniyor",
        impact: "critical",
        weekOffset: 2
    }
];

/**
 * Haber açıklanma zamanı (Date objesi olarak)
 */
export function getEventReleaseTimestamp(event: CatalogCalendarEvent): Date | null {
    if (event.releasedAt) return new Date(event.releasedAt);

    if (!event.dateFormatted || !event.time) return null;

    // Parse DD.MM.YYYY and HH:mm
    const [day, month, year] = event.dateFormatted.split('.').map(Number);
    const [hour, minute] = event.time.split(':').map(Number);

    if (!day || !month || !year || isNaN(hour) || isNaN(minute)) return null;

    // TSİ (UTC+3)
    return new Date(Date.UTC(year, month - 1, day, hour - 3, minute));
}

/**
 * Açıklanan verinin beklentiye kıyasla durumu
 */
export function getActualVsForecastStatus(event: CatalogCalendarEvent): 'above' | 'below' | 'inline' | 'pending' {
    if (!event.actual || event.actual === 'Bekleniyor' || event.actual === 'Açıklanacak') {
        return 'pending';
    }

    const parseNum = (str: string) => {
        if (!str) return NaN;
        const clean = str.replace(/%/g, '').replace(/,/g, '.').replace(/B/g, '').replace(/\$/g, '').replace(/K/g, '').replace(/M/g, '').trim();
        return parseFloat(clean);
    };

    const actVal = parseNum(event.actual);
    const foreVal = parseNum(event.forecast);

    if (isNaN(actVal) || isNaN(foreVal)) return 'inline';

    if (actVal > foreVal) return 'above';
    if (actVal < foreVal) return 'below';
    return 'inline';
}

/**
 * Veri açıklanalı henüz 30 dakika geçip geçmediğini kontrol eder
 */
export function isEventWithin30Minutes(event: CatalogCalendarEvent): boolean {
    if (!event.actual || event.actual === 'Bekleniyor' || event.actual === 'Açıklanacak') {
        return false;
    }

    const releaseTime = getEventReleaseTimestamp(event);
    if (!releaseTime) return false;

    const now = new Date();
    const diffMs = now.getTime() - releaseTime.getTime();
    const diffMinutes = diffMs / (1000 * 60);

    // 0 ile 30 dakika arasında açıklanmışsa yanıp sönmeli!
    return diffMinutes >= 0 && diffMinutes <= 30;
}
