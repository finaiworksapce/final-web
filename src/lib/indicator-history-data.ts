export interface HistoricalDataPoint {
    date: string;
    label: string;
    period?: string;
    actual: number | null;
    forecast: number | null;
    previous?: number | null;
    unit?: string;
}

export interface IndicatorHistorySeries {
    unit: string;
    points: HistoricalDataPoint[];
}

export const INDICATOR_HISTORY_DATABASE: Record<string, IndicatorHistorySeries> = {
  "TR|Aylık Tüketici Fiyat Endeksi (TÜFE)": {
    "unit": "%",
    "points": [
      {
        "date": "2026-03-03",
        "label": "Mar 26",
        "period": "Feb",
        "actual": 2.96,
        "forecast": 3,
        "previous": 4.84,
        "unit": "%"
      },
      {
        "date": "2026-04-03",
        "label": "Nis 26",
        "period": "Mar",
        "actual": 1.94,
        "forecast": 2.32,
        "previous": 2.96,
        "unit": "%"
      },
      {
        "date": "2026-05-04",
        "label": "May 26",
        "period": "Apr",
        "actual": 4.18,
        "forecast": 3.28,
        "previous": 1.94,
        "unit": "%"
      },
      {
        "date": "2026-06-05",
        "label": "Haz 26",
        "period": "May",
        "actual": 1.71,
        "forecast": 1.6,
        "previous": 4.18,
        "unit": "%"
      },
      {
        "date": "2026-07-03",
        "label": "Tem 26",
        "period": "Jun",
        "actual": 0.99,
        "forecast": 0.99,
        "previous": 1.71,
        "unit": "%"
      },
      {
        "date": "2026-08-03",
        "label": "Ağu 26",
        "period": "Jul",
        "actual": 1.78,
        "forecast": 1.83,
        "previous": 0.99,
        "unit": "%"
      },
      {
        "date": "2026-09-03",
        "label": "Eyl 26",
        "period": "Aug",
        "actual": 1.84,
        "forecast": 1.93,
        "previous": 1.78,
        "unit": "%"
      },
      {
        "date": "2026-10-05",
        "label": "Eki 26",
        "period": "Sep",
        "actual": 1.84,
        "forecast": 2.3,
        "previous": 1.84,
        "unit": "%"
      }
    ]
  },
  "TR|Yıllık Enflasyon Oranı (TÜFE)": {
    "unit": "%",
    "points": [
      {
        "date": "2026-03-03",
        "label": "Mar 26",
        "period": "Feb",
        "actual": 31.53,
        "forecast": 31.55,
        "previous": 30.65,
        "unit": "%"
      },
      {
        "date": "2026-04-03",
        "label": "Nis 26",
        "period": "Mar",
        "actual": 30.87,
        "forecast": 31.4,
        "previous": 31.53,
        "unit": "%"
      },
      {
        "date": "2026-05-04",
        "label": "May 26",
        "period": "Apr",
        "actual": 32.37,
        "forecast": 31.25,
        "previous": 30.87,
        "unit": "%"
      },
      {
        "date": "2026-06-05",
        "label": "Haz 26",
        "period": "May",
        "actual": 32.61,
        "forecast": 32.5,
        "previous": 32.37,
        "unit": "%"
      },
      {
        "date": "2026-07-03",
        "label": "Tem 26",
        "period": "Jun",
        "actual": 32.11,
        "forecast": 32.1,
        "previous": 32.61,
        "unit": "%"
      },
      {
        "date": "2026-08-03",
        "label": "Ağu 26",
        "period": "Jul",
        "actual": 31.75,
        "forecast": 31.8,
        "previous": 32.11,
        "unit": "%"
      },
      {
        "date": "2026-09-03",
        "label": "Eyl 26",
        "period": "Aug",
        "actual": 31.51,
        "forecast": 31.62,
        "previous": 31.75,
        "unit": "%"
      },
      {
        "date": "2026-10-05",
        "label": "Eki 26",
        "period": "Sep",
        "actual": 29.73,
        "forecast": 30.3,
        "previous": 31.51,
        "unit": "%"
      }
    ]
  },
  "TR|Aylık Üretici Fiyat Endeksi (ÜFE)": {
    "unit": "%",
    "points": [
      {
        "date": "2026-03-03",
        "label": "Mar 26",
        "period": "Feb",
        "actual": 2.96,
        "forecast": 3,
        "previous": 4.84,
        "unit": "%"
      },
      {
        "date": "2026-04-03",
        "label": "Nis 26",
        "period": "Mar",
        "actual": 1.94,
        "forecast": 2.32,
        "previous": 2.96,
        "unit": "%"
      },
      {
        "date": "2026-05-04",
        "label": "May 26",
        "period": "Apr",
        "actual": 4.18,
        "forecast": 3.28,
        "previous": 1.94,
        "unit": "%"
      },
      {
        "date": "2026-06-05",
        "label": "Haz 26",
        "period": "May",
        "actual": 1.71,
        "forecast": 1.6,
        "previous": 4.18,
        "unit": "%"
      },
      {
        "date": "2026-07-03",
        "label": "Tem 26",
        "period": "Jun",
        "actual": 0.99,
        "forecast": 0.99,
        "previous": 1.71,
        "unit": "%"
      },
      {
        "date": "2026-08-03",
        "label": "Ağu 26",
        "period": "Jul",
        "actual": 1.78,
        "forecast": 1.83,
        "previous": 0.99,
        "unit": "%"
      },
      {
        "date": "2026-09-03",
        "label": "Eyl 26",
        "period": "Aug",
        "actual": 1.84,
        "forecast": 1.93,
        "previous": 1.78,
        "unit": "%"
      },
      {
        "date": "2026-10-05",
        "label": "Eki 26",
        "period": "Sep",
        "actual": 1.84,
        "forecast": 2.3,
        "previous": 1.84,
        "unit": "%"
      }
    ]
  },
  "TR|Türkiye İşsizlik Oranı": {
    "unit": "%",
    "points": [
      {
        "date": "2026-02-27",
        "label": "Şub 26",
        "period": "Jan",
        "actual": 8.1,
        "forecast": null,
        "previous": 7.8,
        "unit": "%"
      },
      {
        "date": "2026-03-31",
        "label": "Mar 26",
        "period": "Feb",
        "actual": 8.5,
        "forecast": null,
        "previous": 8.2,
        "unit": "%"
      },
      {
        "date": "2026-04-29",
        "label": "Nis 26",
        "period": "Mar",
        "actual": 8.1,
        "forecast": null,
        "previous": 8.4,
        "unit": "%"
      },
      {
        "date": "2026-06-04",
        "label": "Haz 26",
        "period": "Apr",
        "actual": 8.2,
        "forecast": null,
        "previous": 8.1,
        "unit": "%"
      },
      {
        "date": "2026-07-30",
        "label": "Tem 26",
        "period": "Jun",
        "actual": 7.6,
        "forecast": null,
        "previous": 8.1,
        "unit": "%"
      },
      {
        "date": "2026-08-31",
        "label": "Ağu 26",
        "period": "Jul",
        "actual": 8.1,
        "forecast": null,
        "previous": 7.6,
        "unit": "%"
      },
      {
        "date": "2026-09-30",
        "label": "Eyl 26",
        "period": "Aug",
        "actual": 7.8,
        "forecast": null,
        "previous": 8.1,
        "unit": "%"
      },
      {
        "date": "2026-10-27",
        "label": "Eki 26",
        "period": "Sep",
        "actual": 8.4,
        "forecast": null,
        "previous": 7.9,
        "unit": "%"
      }
    ]
  },
  "TR|Aylık Sanayi Üretim Endeksi": {
    "unit": "%",
    "points": [
      {
        "date": "2026-03-10",
        "label": "Mar 26",
        "period": "Jan",
        "actual": -1.8,
        "forecast": null,
        "previous": -2.1,
        "unit": "%"
      },
      {
        "date": "2026-04-10",
        "label": "Nis 26",
        "period": "Feb",
        "actual": 2.2,
        "forecast": null,
        "previous": -1.9,
        "unit": "%"
      },
      {
        "date": "2026-05-08",
        "label": "May 26",
        "period": "Mar",
        "actual": -1.1,
        "forecast": null,
        "previous": 2.2,
        "unit": "%"
      },
      {
        "date": "2026-06-15",
        "label": "Haz 26",
        "period": "Apr",
        "actual": 6,
        "forecast": null,
        "previous": -1.1,
        "unit": "%"
      },
      {
        "date": "2026-07-10",
        "label": "Tem 26",
        "period": "May",
        "actual": 0,
        "forecast": null,
        "previous": 6.1,
        "unit": "%"
      },
      {
        "date": "2026-08-10",
        "label": "Ağu 26",
        "period": "Jun",
        "actual": -1.4,
        "forecast": null,
        "previous": -0.1,
        "unit": "%"
      },
      {
        "date": "2026-09-10",
        "label": "Eyl 26",
        "period": "Jul",
        "actual": -0.3,
        "forecast": null,
        "previous": -1.3,
        "unit": "%"
      },
      {
        "date": "2026-10-09",
        "label": "Eki 26",
        "period": "Aug",
        "actual": -1.9,
        "forecast": null,
        "previous": -0.2,
        "unit": "%"
      }
    ]
  },
  "TR|TCMB Politika Faizi Kararı": {
    "unit": "%",
    "points": [
      {
        "date": "2025-12-11",
        "label": "Ara 25",
        "period": "",
        "actual": 38,
        "forecast": 38.5,
        "previous": 39.5,
        "unit": "%"
      },
      {
        "date": "2026-01-22",
        "label": "Oca 26",
        "period": "",
        "actual": 37,
        "forecast": 36.5,
        "previous": 38,
        "unit": "%"
      },
      {
        "date": "2026-03-12",
        "label": "Mar 26",
        "period": "",
        "actual": 37,
        "forecast": 37,
        "previous": 37,
        "unit": "%"
      },
      {
        "date": "2026-04-22",
        "label": "Nis 26",
        "period": "",
        "actual": 37,
        "forecast": null,
        "previous": 37,
        "unit": "%"
      },
      {
        "date": "2026-06-11",
        "label": "Haz 26",
        "period": "",
        "actual": 37,
        "forecast": 37,
        "previous": 37,
        "unit": "%"
      },
      {
        "date": "2026-07-23",
        "label": "Tem 26",
        "period": "",
        "actual": 37,
        "forecast": 37,
        "previous": 37,
        "unit": "%"
      },
      {
        "date": "2026-09-10",
        "label": "Eyl 26",
        "period": "",
        "actual": 37,
        "forecast": 37,
        "previous": 37,
        "unit": "%"
      },
      {
        "date": "2026-10-22",
        "label": "Eki 26",
        "period": "",
        "actual": 36,
        "forecast": 36,
        "previous": 37,
        "unit": "%"
      }
    ]
  },
  "TR|Dış Ticaret Dengesi (Öncü)": {
    "unit": "Milyar $",
    "points": [
      {
        "date": "2026-03-03",
        "label": "Mar 26",
        "period": "Feb",
        "actual": -9.2,
        "forecast": null,
        "previous": -8.4,
        "unit": "$"
      },
      {
        "date": "2026-04-02",
        "label": "Nis 26",
        "period": "Mar",
        "actual": -11.3,
        "forecast": null,
        "previous": -9,
        "unit": "$"
      },
      {
        "date": "2026-05-04",
        "label": "May 26",
        "period": "Apr",
        "actual": -8.51,
        "forecast": null,
        "previous": -11.2,
        "unit": "$"
      },
      {
        "date": "2026-06-04",
        "label": "Haz 26",
        "period": "May",
        "actual": -5.6,
        "forecast": null,
        "previous": -8.5,
        "unit": "$"
      },
      {
        "date": "2026-07-03",
        "label": "Tem 26",
        "period": "Jun",
        "actual": -10.4,
        "forecast": null,
        "previous": -5.61,
        "unit": "$"
      },
      {
        "date": "2026-08-03",
        "label": "Ağu 26",
        "period": "Jul",
        "actual": -7.4,
        "forecast": null,
        "previous": -10.37,
        "unit": "$"
      },
      {
        "date": "2026-09-03",
        "label": "Eyl 26",
        "period": "Aug",
        "actual": -5.24,
        "forecast": null,
        "previous": -7.34,
        "unit": "$"
      },
      {
        "date": "2026-10-05",
        "label": "Eki 26",
        "period": "Sep",
        "actual": -5.23,
        "forecast": null,
        "previous": -5.24,
        "unit": "$"
      }
    ]
  },
  "TR|Türkiye Konut Satış İstatistikleri": {
    "unit": "Bin Adet",
    "points": [
      {
        "date": "2026-03-15",
        "label": "Mar 26",
        "period": "Şub",
        "actual": 94.2,
        "forecast": 92,
        "previous": 89.5,
        "unit": "Bin"
      },
      {
        "date": "2026-04-15",
        "label": "Nis 26",
        "period": "Mar",
        "actual": 105.3,
        "forecast": 102.5,
        "previous": 94.2,
        "unit": "Bin"
      },
      {
        "date": "2026-05-15",
        "label": "May 26",
        "period": "Nis",
        "actual": 110.6,
        "forecast": 108,
        "previous": 105.3,
        "unit": "Bin"
      },
      {
        "date": "2026-06-15",
        "label": "Haz 26",
        "period": "May",
        "actual": 99.4,
        "forecast": 104,
        "previous": 110.6,
        "unit": "Bin"
      },
      {
        "date": "2026-07-15",
        "label": "Tem 26",
        "period": "Haz",
        "actual": 108.2,
        "forecast": 106,
        "previous": 99.4,
        "unit": "Bin"
      },
      {
        "date": "2026-08-15",
        "label": "Ağu 26",
        "period": "Tem",
        "actual": 114.5,
        "forecast": 111,
        "previous": 108.2,
        "unit": "Bin"
      },
      {
        "date": "2026-09-15",
        "label": "Eyl 26",
        "period": "Ağu",
        "actual": 122.1,
        "forecast": 118.5,
        "previous": 114.5,
        "unit": "Bin"
      },
      {
        "date": "2026-10-15",
        "label": "Eki 26",
        "period": "Eyl",
        "actual": 128.4,
        "forecast": 125,
        "previous": 122.1,
        "unit": "Bin"
      }
    ]
  },
  "ABD|ABD Aylık Tüketici Fiyat Endeksi (TÜFE)": {
    "unit": "%",
    "points": [
      {
        "date": "2026-03-11",
        "label": "Mar 26",
        "period": "Feb",
        "actual": 0.3,
        "forecast": 0.3,
        "previous": 0.2,
        "unit": "%"
      },
      {
        "date": "2026-04-10",
        "label": "Nis 26",
        "period": "Mar",
        "actual": 0.9,
        "forecast": 0.9,
        "previous": 0.3,
        "unit": "%"
      },
      {
        "date": "2026-05-12",
        "label": "May 26",
        "period": "Apr",
        "actual": 0.6,
        "forecast": 0.6,
        "previous": 0.9,
        "unit": "%"
      },
      {
        "date": "2026-06-10",
        "label": "Haz 26",
        "period": "May",
        "actual": 0.5,
        "forecast": 0.5,
        "previous": 0.6,
        "unit": "%"
      },
      {
        "date": "2026-07-14",
        "label": "Tem 26",
        "period": "Jun",
        "actual": -0.4,
        "forecast": -0.1,
        "previous": 0.5,
        "unit": "%"
      },
      {
        "date": "2026-08-12",
        "label": "Ağu 26",
        "period": "Jul",
        "actual": 0.1,
        "forecast": 0.1,
        "previous": -0.4,
        "unit": "%"
      },
      {
        "date": "2026-09-11",
        "label": "Eyl 26",
        "period": "Aug",
        "actual": 0.4,
        "forecast": 0.4,
        "previous": 0.1,
        "unit": "%"
      },
      {
        "date": "2026-10-14",
        "label": "Eki 26",
        "period": "Sep",
        "actual": 0.6,
        "forecast": 0.6,
        "previous": 0.4,
        "unit": "%"
      }
    ]
  },
  "ABD|ABD Yıllık Enflasyon Oranı (TÜFE)": {
    "unit": "%",
    "points": [
      {
        "date": "2026-03-11",
        "label": "Mar 26",
        "period": "Feb",
        "actual": 2.4,
        "forecast": 2.4,
        "previous": 2.4,
        "unit": "%"
      },
      {
        "date": "2026-04-10",
        "label": "Nis 26",
        "period": "Mar",
        "actual": 3.3,
        "forecast": 3.3,
        "previous": 2.4,
        "unit": "%"
      },
      {
        "date": "2026-05-12",
        "label": "May 26",
        "period": "Apr",
        "actual": 3.8,
        "forecast": 3.7,
        "previous": 3.3,
        "unit": "%"
      },
      {
        "date": "2026-06-10",
        "label": "Haz 26",
        "period": "May",
        "actual": 4.2,
        "forecast": 4.2,
        "previous": 3.8,
        "unit": "%"
      },
      {
        "date": "2026-07-14",
        "label": "Tem 26",
        "period": "Jun",
        "actual": 3.5,
        "forecast": 3.8,
        "previous": 4.2,
        "unit": "%"
      },
      {
        "date": "2026-08-12",
        "label": "Ağu 26",
        "period": "Jul",
        "actual": 3.4,
        "forecast": 3.4,
        "previous": 3.5,
        "unit": "%"
      },
      {
        "date": "2026-09-11",
        "label": "Eyl 26",
        "period": "Aug",
        "actual": 3.4,
        "forecast": 3.4,
        "previous": 3.4,
        "unit": "%"
      },
      {
        "date": "2026-10-14",
        "label": "Eki 26",
        "period": "Sep",
        "actual": 3.7,
        "forecast": 3.6,
        "previous": 3.4,
        "unit": "%"
      }
    ]
  },
  "ABD|ABD Aylık Üretici Fiyat Endeksi (ÜFE)": {
    "unit": "%",
    "points": [
      {
        "date": "2026-03-18",
        "label": "Mar 26",
        "period": "Feb",
        "actual": 0.7,
        "forecast": 0.3,
        "previous": 0.5,
        "unit": "%"
      },
      {
        "date": "2026-04-14",
        "label": "Nis 26",
        "period": "Mar",
        "actual": 0.5,
        "forecast": 1.1,
        "previous": 0.5,
        "unit": "%"
      },
      {
        "date": "2026-05-13",
        "label": "May 26",
        "period": "Apr",
        "actual": 1.4,
        "forecast": 0.5,
        "previous": 0.7,
        "unit": "%"
      },
      {
        "date": "2026-06-11",
        "label": "Haz 26",
        "period": "May",
        "actual": 1.1,
        "forecast": 0.7,
        "previous": 1.1,
        "unit": "%"
      },
      {
        "date": "2026-07-15",
        "label": "Tem 26",
        "period": "Jun",
        "actual": -0.3,
        "forecast": 0,
        "previous": 0.6,
        "unit": "%"
      },
      {
        "date": "2026-08-13",
        "label": "Ağu 26",
        "period": "Jul",
        "actual": 0,
        "forecast": 0.2,
        "previous": -0.1,
        "unit": "%"
      },
      {
        "date": "2026-09-10",
        "label": "Eyl 26",
        "period": "Aug",
        "actual": 0.4,
        "forecast": 0.4,
        "previous": 0.1,
        "unit": "%"
      },
      {
        "date": "2026-10-15",
        "label": "Eki 26",
        "period": "Sep",
        "actual": 1.3,
        "forecast": 0.5,
        "previous": 0.5,
        "unit": "%"
      }
    ]
  },
  "ABD|ABD İşsizlik Oranı": {
    "unit": "%",
    "points": [
      {
        "date": "2026-03-06",
        "label": "Mar 26",
        "period": "Feb",
        "actual": 4.4,
        "forecast": 4.3,
        "previous": 4.3,
        "unit": "%"
      },
      {
        "date": "2026-04-03",
        "label": "Nis 26",
        "period": "Mar",
        "actual": 4.3,
        "forecast": 4.4,
        "previous": 4.4,
        "unit": "%"
      },
      {
        "date": "2026-05-08",
        "label": "May 26",
        "period": "Apr",
        "actual": 4.3,
        "forecast": 4.3,
        "previous": 4.3,
        "unit": "%"
      },
      {
        "date": "2026-06-05",
        "label": "Haz 26",
        "period": "May",
        "actual": 4.3,
        "forecast": 4.3,
        "previous": 4.3,
        "unit": "%"
      },
      {
        "date": "2026-07-02",
        "label": "Tem 26",
        "period": "Jun",
        "actual": 4.2,
        "forecast": 4.3,
        "previous": 4.3,
        "unit": "%"
      },
      {
        "date": "2026-08-07",
        "label": "Ağu 26",
        "period": "Jul",
        "actual": 4.1,
        "forecast": 4.2,
        "previous": 4.2,
        "unit": "%"
      },
      {
        "date": "2026-09-04",
        "label": "Eyl 26",
        "period": "Aug",
        "actual": 4.1,
        "forecast": 4.1,
        "previous": 4.1,
        "unit": "%"
      },
      {
        "date": "2026-10-02",
        "label": "Eki 26",
        "period": "Sep",
        "actual": 4.2,
        "forecast": 4.1,
        "previous": 4.1,
        "unit": "%"
      }
    ]
  },
  "ABD|Tarım Dışı İstihdam Değişimi (NFP)": {
    "unit": "Bin",
    "points": [
      {
        "date": "2026-03-06",
        "label": "Mar 26",
        "period": "Feb",
        "actual": -92,
        "forecast": 59,
        "previous": 126,
        "unit": ""
      },
      {
        "date": "2026-04-03",
        "label": "Nis 26",
        "period": "Mar",
        "actual": 178,
        "forecast": 60,
        "previous": -133,
        "unit": ""
      },
      {
        "date": "2026-05-08",
        "label": "May 26",
        "period": "Apr",
        "actual": 115,
        "forecast": 62,
        "previous": 185,
        "unit": ""
      },
      {
        "date": "2026-06-05",
        "label": "Haz 26",
        "period": "May",
        "actual": 172,
        "forecast": 85,
        "previous": 179,
        "unit": ""
      },
      {
        "date": "2026-07-02",
        "label": "Tem 26",
        "period": "Jun",
        "actual": 57,
        "forecast": 110,
        "previous": 129,
        "unit": ""
      },
      {
        "date": "2026-08-07",
        "label": "Ağu 26",
        "period": "Jul",
        "actual": -23,
        "forecast": 80,
        "previous": 20,
        "unit": ""
      },
      {
        "date": "2026-09-04",
        "label": "Eyl 26",
        "period": "Aug",
        "actual": 162,
        "forecast": 56,
        "previous": 21,
        "unit": ""
      },
      {
        "date": "2026-10-02",
        "label": "Eki 26",
        "period": "Sep",
        "actual": 29,
        "forecast": 90,
        "previous": 133,
        "unit": ""
      }
    ]
  },
  "ABD|Aylık Ortalama Saatlik Kazançlar": {
    "unit": "%",
    "points": [
      {
        "date": "2026-03-06",
        "label": "Mar 26",
        "period": "Feb",
        "actual": 0.4,
        "forecast": 0.3,
        "previous": 0.4,
        "unit": "%"
      },
      {
        "date": "2026-04-03",
        "label": "Nis 26",
        "period": "Mar",
        "actual": 0.2,
        "forecast": 0.3,
        "previous": 0.4,
        "unit": "%"
      },
      {
        "date": "2026-05-08",
        "label": "May 26",
        "period": "Apr",
        "actual": 0.2,
        "forecast": 0.3,
        "previous": 0.2,
        "unit": "%"
      },
      {
        "date": "2026-06-05",
        "label": "Haz 26",
        "period": "May",
        "actual": 0.3,
        "forecast": 0.3,
        "previous": 0.2,
        "unit": "%"
      },
      {
        "date": "2026-07-02",
        "label": "Tem 26",
        "period": "Jun",
        "actual": 0.3,
        "forecast": 0.3,
        "previous": 0.3,
        "unit": "%"
      },
      {
        "date": "2026-08-07",
        "label": "Ağu 26",
        "period": "Jul",
        "actual": 0.1,
        "forecast": 0.3,
        "previous": 0.3,
        "unit": "%"
      },
      {
        "date": "2026-09-04",
        "label": "Eyl 26",
        "period": "Aug",
        "actual": 0.3,
        "forecast": 0.3,
        "previous": 0.2,
        "unit": "%"
      },
      {
        "date": "2026-10-02",
        "label": "Eki 26",
        "period": "Sep",
        "actual": 0.1,
        "forecast": 0.3,
        "previous": 0.3,
        "unit": "%"
      }
    ]
  },
  "ABD|İşsizlik Haklarından Yararlanma Başvuruları": {
    "unit": "Bin",
    "points": [
      {
        "date": "2026-03-05",
        "label": "Mar 26",
        "period": "Feb/28",
        "actual": 213,
        "forecast": 215,
        "previous": 213,
        "unit": ""
      },
      {
        "date": "2026-04-02",
        "label": "Nis 26",
        "period": "Mar/28",
        "actual": 202,
        "forecast": 212,
        "previous": 211,
        "unit": ""
      },
      {
        "date": "2026-05-07",
        "label": "May 26",
        "period": "May/02",
        "actual": 200,
        "forecast": 205,
        "previous": 190,
        "unit": ""
      },
      {
        "date": "2026-06-04",
        "label": "Haz 26",
        "period": "May/30",
        "actual": 225,
        "forecast": 213,
        "previous": 212,
        "unit": ""
      },
      {
        "date": "2026-07-02",
        "label": "Tem 26",
        "period": "Jun/27",
        "actual": 215,
        "forecast": 220,
        "previous": 216,
        "unit": ""
      },
      {
        "date": "2026-08-06",
        "label": "Ağu 26",
        "period": "Aug/01",
        "actual": 199,
        "forecast": 202,
        "previous": 198,
        "unit": ""
      },
      {
        "date": "2026-09-03",
        "label": "Eyl 26",
        "period": "Aug/29",
        "actual": 206,
        "forecast": 205,
        "previous": 204,
        "unit": ""
      },
      {
        "date": "2026-10-01",
        "label": "Eki 26",
        "period": "Sep/26",
        "actual": 197,
        "forecast": 200,
        "previous": 198,
        "unit": ""
      }
    ]
  },
  "ABD|ABD Aylık Perakende Satışlar": {
    "unit": "%",
    "points": [
      {
        "date": "2026-03-06",
        "label": "Mar 26",
        "period": "Jan",
        "actual": -0.2,
        "forecast": -0.3,
        "previous": 0,
        "unit": "%"
      },
      {
        "date": "2026-04-01",
        "label": "Nis 26",
        "period": "Feb",
        "actual": 0.6,
        "forecast": 0.5,
        "previous": -0.1,
        "unit": "%"
      },
      {
        "date": "2026-05-14",
        "label": "May 26",
        "period": "Apr",
        "actual": 0.5,
        "forecast": 0.5,
        "previous": 1.6,
        "unit": "%"
      },
      {
        "date": "2026-06-17",
        "label": "Haz 26",
        "period": "May",
        "actual": 0.9,
        "forecast": 0.5,
        "previous": 0.4,
        "unit": "%"
      },
      {
        "date": "2026-07-16",
        "label": "Tem 26",
        "period": "Jun",
        "actual": 0.2,
        "forecast": 0.2,
        "previous": 1,
        "unit": "%"
      },
      {
        "date": "2026-08-14",
        "label": "Ağu 26",
        "period": "Jul",
        "actual": -0.6,
        "forecast": 0.1,
        "previous": 0.2,
        "unit": "%"
      },
      {
        "date": "2026-09-16",
        "label": "Eyl 26",
        "period": "Aug",
        "actual": 1.2,
        "forecast": 0.8,
        "previous": -0.5,
        "unit": "%"
      },
      {
        "date": "2026-10-15",
        "label": "Eki 26",
        "period": "Sep",
        "actual": 0.8,
        "forecast": 0.3,
        "previous": 1.3,
        "unit": "%"
      }
    ]
  },
  "ABD|Aylık Fabrika Siparişleri": {
    "unit": "%",
    "points": [
      {
        "date": "2026-03-18",
        "label": "Mar 26",
        "period": "Jan",
        "actual": 0.1,
        "forecast": 0.1,
        "previous": -0.4,
        "unit": "%"
      },
      {
        "date": "2026-04-10",
        "label": "Nis 26",
        "period": "Feb",
        "actual": 0,
        "forecast": -0.2,
        "previous": 0,
        "unit": "%"
      },
      {
        "date": "2026-05-04",
        "label": "May 26",
        "period": "Mar",
        "actual": 1.5,
        "forecast": 0.5,
        "previous": 0.3,
        "unit": "%"
      },
      {
        "date": "2026-06-03",
        "label": "Haz 26",
        "period": "Apr",
        "actual": 4.8,
        "forecast": 4.6,
        "previous": 1.8,
        "unit": "%"
      },
      {
        "date": "2026-07-02",
        "label": "Tem 26",
        "period": "May",
        "actual": -1.3,
        "forecast": -1.8,
        "previous": 5.3,
        "unit": "%"
      },
      {
        "date": "2026-08-04",
        "label": "Ağu 26",
        "period": "Jun",
        "actual": -0.3,
        "forecast": 0.2,
        "previous": -1.1,
        "unit": "%"
      },
      {
        "date": "2026-09-02",
        "label": "Eyl 26",
        "period": "Jul",
        "actual": 0.9,
        "forecast": 0.6,
        "previous": -0.2,
        "unit": "%"
      },
      {
        "date": "2026-10-02",
        "label": "Eki 26",
        "period": "Aug",
        "actual": 0.1,
        "forecast": 0.1,
        "previous": 0.8,
        "unit": "%"
      }
    ]
  },
  "ABD|ISM İmalat PMI Endeksi": {
    "unit": "Puan",
    "points": [
      {
        "date": "2026-03-02",
        "label": "Mar 26",
        "period": "Feb",
        "actual": 52.4,
        "forecast": 51.8,
        "previous": 52.6,
        "unit": ""
      },
      {
        "date": "2026-04-01",
        "label": "Nis 26",
        "period": "Mar",
        "actual": 52.7,
        "forecast": 52.5,
        "previous": 52.4,
        "unit": ""
      },
      {
        "date": "2026-05-01",
        "label": "May 26",
        "period": "Apr",
        "actual": 52.7,
        "forecast": 53,
        "previous": 52.7,
        "unit": ""
      },
      {
        "date": "2026-06-01",
        "label": "Haz 26",
        "period": "May",
        "actual": 54,
        "forecast": 53,
        "previous": 52.7,
        "unit": ""
      },
      {
        "date": "2026-07-01",
        "label": "Tem 26",
        "period": "Jun",
        "actual": 53.3,
        "forecast": 54,
        "previous": 54,
        "unit": ""
      },
      {
        "date": "2026-08-03",
        "label": "Ağu 26",
        "period": "Jul",
        "actual": 55.6,
        "forecast": 54,
        "previous": 53.3,
        "unit": ""
      },
      {
        "date": "2026-09-01",
        "label": "Eyl 26",
        "period": "Aug",
        "actual": 54.6,
        "forecast": 55.2,
        "previous": 55.6,
        "unit": ""
      },
      {
        "date": "2026-10-01",
        "label": "Eki 26",
        "period": "Sep",
        "actual": 54.5,
        "forecast": 55,
        "previous": 54.6,
        "unit": ""
      }
    ]
  },
  "ABD|ISM İmalat Dışı (Hizmet) PMI": {
    "unit": "Puan",
    "points": [
      {
        "date": "2026-03-04",
        "label": "Mar 26",
        "period": "Feb",
        "actual": 56.1,
        "forecast": 53.5,
        "previous": 53.8,
        "unit": ""
      },
      {
        "date": "2026-04-06",
        "label": "Nis 26",
        "period": "Mar",
        "actual": 54,
        "forecast": 55,
        "previous": 56.1,
        "unit": ""
      },
      {
        "date": "2026-05-05",
        "label": "May 26",
        "period": "Apr",
        "actual": 53.6,
        "forecast": 53.7,
        "previous": 54,
        "unit": ""
      },
      {
        "date": "2026-06-03",
        "label": "Haz 26",
        "period": "May",
        "actual": 54.5,
        "forecast": 53.8,
        "previous": 53.6,
        "unit": ""
      },
      {
        "date": "2026-07-06",
        "label": "Tem 26",
        "period": "Jun",
        "actual": 54,
        "forecast": 54,
        "previous": 54.5,
        "unit": ""
      },
      {
        "date": "2026-08-05",
        "label": "Ağu 26",
        "period": "Jul",
        "actual": 54.1,
        "forecast": 54.5,
        "previous": 54,
        "unit": ""
      },
      {
        "date": "2026-09-03",
        "label": "Eyl 26",
        "period": "Aug",
        "actual": 55.4,
        "forecast": 54.3,
        "previous": 54.1,
        "unit": ""
      },
      {
        "date": "2026-10-05",
        "label": "Eki 26",
        "period": "Sep",
        "actual": 54.9,
        "forecast": 55,
        "previous": 55.4,
        "unit": ""
      }
    ]
  },
  "ABD|ISM İmalat Fiyat Endeksi": {
    "unit": "Puan",
    "points": [
      {
        "date": "2026-03-01",
        "label": "Mar 26",
        "period": "Şub",
        "actual": 52.5,
        "forecast": 51.8,
        "previous": 51,
        "unit": "Puan"
      },
      {
        "date": "2026-04-01",
        "label": "Nis 26",
        "period": "Mar",
        "actual": 53,
        "forecast": 52.6,
        "previous": 52.5,
        "unit": "Puan"
      },
      {
        "date": "2026-05-01",
        "label": "May 26",
        "period": "Nis",
        "actual": 51.9,
        "forecast": 52.4,
        "previous": 53,
        "unit": "Puan"
      },
      {
        "date": "2026-06-01",
        "label": "Haz 26",
        "period": "May",
        "actual": 52.4,
        "forecast": 52,
        "previous": 51.9,
        "unit": "Puan"
      },
      {
        "date": "2026-07-01",
        "label": "Tem 26",
        "period": "Haz",
        "actual": 51.8,
        "forecast": 52.1,
        "previous": 52.4,
        "unit": "Puan"
      },
      {
        "date": "2026-08-01",
        "label": "Ağu 26",
        "period": "Tem",
        "actual": 52.9,
        "forecast": 53.2,
        "previous": 52.1,
        "unit": "Puan"
      },
      {
        "date": "2026-09-01",
        "label": "Eyl 26",
        "period": "Ağu",
        "actual": 53.4,
        "forecast": 53,
        "previous": 52.9,
        "unit": "Puan"
      },
      {
        "date": "2026-10-01",
        "label": "Eki 26",
        "period": "Eyl",
        "actual": 54.1,
        "forecast": 53.6,
        "previous": 53.4,
        "unit": "Puan"
      }
    ]
  },
  "ABD|Aylık İnşaat Harcamaları": {
    "unit": "%",
    "points": [
      {
        "date": "2026-03-01",
        "label": "Mar 26",
        "period": "Şub",
        "actual": 0.1,
        "forecast": 0.2,
        "previous": -0.2,
        "unit": "%"
      },
      {
        "date": "2026-04-01",
        "label": "Nis 26",
        "period": "Mar",
        "actual": -0.1,
        "forecast": 0.1,
        "previous": 0.1,
        "unit": "%"
      },
      {
        "date": "2026-05-01",
        "label": "May 26",
        "period": "Nis",
        "actual": 0.3,
        "forecast": 0.2,
        "previous": -0.1,
        "unit": "%"
      },
      {
        "date": "2026-06-01",
        "label": "Haz 26",
        "period": "May",
        "actual": 0.4,
        "forecast": 0.3,
        "previous": 0.3,
        "unit": "%"
      },
      {
        "date": "2026-07-01",
        "label": "Tem 26",
        "period": "Haz",
        "actual": -0.1,
        "forecast": 0.2,
        "previous": 0.4,
        "unit": "%"
      },
      {
        "date": "2026-08-01",
        "label": "Ağu 26",
        "period": "Tem",
        "actual": 0.2,
        "forecast": 0.2,
        "previous": -0.1,
        "unit": "%"
      },
      {
        "date": "2026-09-01",
        "label": "Eyl 26",
        "period": "Ağu",
        "actual": 0.3,
        "forecast": 0.2,
        "previous": 0.2,
        "unit": "%"
      },
      {
        "date": "2026-10-01",
        "label": "Eki 26",
        "period": "Eyl",
        "actual": 0.1,
        "forecast": 0.2,
        "previous": 0.3,
        "unit": "%"
      }
    ]
  },
  "ABD|Michigan Tüketici Duyarlılık Endeksi (Öncü)": {
    "unit": "Puan",
    "points": [
      {
        "date": "2026-03-13",
        "label": "Mar 26",
        "period": "Mar",
        "actual": 55.5,
        "forecast": 55,
        "previous": 56.6,
        "unit": ""
      },
      {
        "date": "2026-04-10",
        "label": "Nis 26",
        "period": "Apr",
        "actual": 47.6,
        "forecast": 52,
        "previous": 53.3,
        "unit": ""
      },
      {
        "date": "2026-05-08",
        "label": "May 26",
        "period": "May",
        "actual": 48.2,
        "forecast": 49.5,
        "previous": 49.8,
        "unit": ""
      },
      {
        "date": "2026-06-12",
        "label": "Haz 26",
        "period": "Jun",
        "actual": 48.9,
        "forecast": 46,
        "previous": 44.8,
        "unit": ""
      },
      {
        "date": "2026-07-17",
        "label": "Tem 26",
        "period": "Jul",
        "actual": 54.4,
        "forecast": 51,
        "previous": 49.5,
        "unit": ""
      },
      {
        "date": "2026-08-14",
        "label": "Ağu 26",
        "period": "Aug",
        "actual": 51,
        "forecast": 54.5,
        "previous": 55.2,
        "unit": ""
      },
      {
        "date": "2026-09-11",
        "label": "Eyl 26",
        "period": "Sep",
        "actual": 47.8,
        "forecast": 51,
        "previous": 51.7,
        "unit": ""
      },
      {
        "date": "2026-10-09",
        "label": "Eki 26",
        "period": "Oct",
        "actual": 46.3,
        "forecast": 47.6,
        "previous": 48.1,
        "unit": ""
      }
    ]
  },
  "ABD|ABD Yapı Ruhsatları": {
    "unit": "%",
    "points": [
      {
        "date": "2026-03-12",
        "label": "Mar 26",
        "period": "Jan",
        "actual": -5.4,
        "forecast": null,
        "previous": 4.8,
        "unit": "%"
      },
      {
        "date": "2026-04-29",
        "label": "Nis 26",
        "period": "Feb",
        "actual": 10.9,
        "forecast": null,
        "previous": -4.7,
        "unit": "%"
      },
      {
        "date": "2026-05-21",
        "label": "May 26",
        "period": "Apr",
        "actual": 5.8,
        "forecast": null,
        "previous": -11.5,
        "unit": "%"
      },
      {
        "date": "2026-06-16",
        "label": "Haz 26",
        "period": "May",
        "actual": -0.7,
        "forecast": null,
        "previous": 4.4,
        "unit": "%"
      },
      {
        "date": "2026-07-17",
        "label": "Tem 26",
        "period": "Jun",
        "actual": -3,
        "forecast": null,
        "previous": -0.9,
        "unit": "%"
      },
      {
        "date": "2026-08-18",
        "label": "Ağu 26",
        "period": "Jul",
        "actual": 5,
        "forecast": null,
        "previous": -2.6,
        "unit": "%"
      },
      {
        "date": "2026-09-17",
        "label": "Eyl 26",
        "period": "Aug",
        "actual": -2.7,
        "forecast": null,
        "previous": 4.3,
        "unit": "%"
      },
      {
        "date": "2026-10-20",
        "label": "Eki 26",
        "period": "Sep",
        "actual": -0.2,
        "forecast": null,
        "previous": -2.1,
        "unit": "%"
      }
    ]
  },
  "ABD|Haftalık Ham Petrol Stokları": {
    "unit": "Milyon Varis",
    "points": [
      {
        "date": "2026-03-04",
        "label": "Mar 26",
        "period": "Feb/27",
        "actual": 3.475,
        "forecast": 2.3,
        "previous": 15.989,
        "unit": ""
      },
      {
        "date": "2026-04-01",
        "label": "Nis 26",
        "period": "Mar/27",
        "actual": 5.451,
        "forecast": 0.8,
        "previous": 6.926,
        "unit": ""
      },
      {
        "date": "2026-05-06",
        "label": "May 26",
        "period": "May/01",
        "actual": -2.314,
        "forecast": -3.3,
        "previous": -6.233,
        "unit": ""
      },
      {
        "date": "2026-06-03",
        "label": "Haz 26",
        "period": "May/29",
        "actual": -7.974,
        "forecast": -4,
        "previous": -3.327,
        "unit": ""
      },
      {
        "date": "2026-07-01",
        "label": "Tem 26",
        "period": "Jun/26",
        "actual": -3.775,
        "forecast": -5.1,
        "previous": -6.088,
        "unit": ""
      },
      {
        "date": "2026-08-05",
        "label": "Ağu 26",
        "period": "Jul/31",
        "actual": 2.479,
        "forecast": -1.5,
        "previous": -7.167,
        "unit": ""
      },
      {
        "date": "2026-09-02",
        "label": "Eyl 26",
        "period": "Aug/28",
        "actual": -4.45,
        "forecast": -1.1,
        "previous": 0.095,
        "unit": ""
      },
      {
        "date": "2026-10-07",
        "label": "Eki 26",
        "period": "Oct/02",
        "actual": -3.186,
        "forecast": 1.7,
        "previous": 0.922,
        "unit": ""
      }
    ]
  },
  "ABD|FOMC Toplantı Tutanakları (Fed)": {
    "unit": "%",
    "points": [
      {
        "date": "2025-12-10",
        "label": "Ara 25",
        "period": "",
        "actual": 3.75,
        "forecast": 3.75,
        "previous": 4,
        "unit": "%"
      },
      {
        "date": "2026-01-28",
        "label": "Oca 26",
        "period": "",
        "actual": 3.75,
        "forecast": 3.75,
        "previous": 3.75,
        "unit": "%"
      },
      {
        "date": "2026-03-18",
        "label": "Mar 26",
        "period": "",
        "actual": 3.75,
        "forecast": 3.75,
        "previous": 3.75,
        "unit": "%"
      },
      {
        "date": "2026-04-29",
        "label": "Nis 26",
        "period": "",
        "actual": 3.75,
        "forecast": 3.75,
        "previous": 3.75,
        "unit": "%"
      },
      {
        "date": "2026-06-17",
        "label": "Haz 26",
        "period": "",
        "actual": 3.75,
        "forecast": 3.75,
        "previous": 3.75,
        "unit": "%"
      },
      {
        "date": "2026-07-29",
        "label": "Tem 26",
        "period": "",
        "actual": 3.75,
        "forecast": 3.75,
        "previous": 3.75,
        "unit": "%"
      },
      {
        "date": "2026-09-16",
        "label": "Eyl 26",
        "period": "",
        "actual": 4,
        "forecast": 4,
        "previous": 3.75,
        "unit": "%"
      },
      {
        "date": "2026-10-28",
        "label": "Eki 26",
        "period": "",
        "actual": 4,
        "forecast": 4,
        "previous": 4,
        "unit": "%"
      }
    ]
  },
  "ABD|Fed Politika Faizi Kararı": {
    "unit": "%",
    "points": [
      {
        "date": "2025-12-10",
        "label": "Ara 25",
        "period": "",
        "actual": 3.75,
        "forecast": 3.75,
        "previous": 4,
        "unit": "%"
      },
      {
        "date": "2026-01-28",
        "label": "Oca 26",
        "period": "",
        "actual": 3.75,
        "forecast": 3.75,
        "previous": 3.75,
        "unit": "%"
      },
      {
        "date": "2026-03-18",
        "label": "Mar 26",
        "period": "",
        "actual": 3.75,
        "forecast": 3.75,
        "previous": 3.75,
        "unit": "%"
      },
      {
        "date": "2026-04-29",
        "label": "Nis 26",
        "period": "",
        "actual": 3.75,
        "forecast": 3.75,
        "previous": 3.75,
        "unit": "%"
      },
      {
        "date": "2026-06-17",
        "label": "Haz 26",
        "period": "",
        "actual": 3.75,
        "forecast": 3.75,
        "previous": 3.75,
        "unit": "%"
      },
      {
        "date": "2026-07-29",
        "label": "Tem 26",
        "period": "",
        "actual": 3.75,
        "forecast": 3.75,
        "previous": 3.75,
        "unit": "%"
      },
      {
        "date": "2026-09-16",
        "label": "Eyl 26",
        "period": "",
        "actual": 4,
        "forecast": 4,
        "previous": 3.75,
        "unit": "%"
      },
      {
        "date": "2026-10-28",
        "label": "Eki 26",
        "period": "",
        "actual": 4,
        "forecast": 4,
        "previous": 4,
        "unit": "%"
      }
    ]
  },
  "ABD|S&P Global Hizmet PMI (Nihai)": {
    "unit": "Puan",
    "points": [
      {
        "date": "2026-03-24",
        "label": "Mar 26",
        "period": "Mar",
        "actual": 51.2,
        "forecast": 51.5,
        "previous": null,
        "unit": ""
      },
      {
        "date": "2026-04-23",
        "label": "Nis 26",
        "period": "Apr",
        "actual": 49.6,
        "forecast": 50,
        "previous": null,
        "unit": ""
      },
      {
        "date": "2026-05-21",
        "label": "May 26",
        "period": "May",
        "actual": 51,
        "forecast": 51.1,
        "previous": null,
        "unit": ""
      },
      {
        "date": "2026-06-23",
        "label": "Haz 26",
        "period": "Jun",
        "actual": 51.3,
        "forecast": 51,
        "previous": null,
        "unit": ""
      },
      {
        "date": "2026-07-24",
        "label": "Tem 26",
        "period": "Jul",
        "actual": 51.9,
        "forecast": 51.5,
        "previous": null,
        "unit": ""
      },
      {
        "date": "2026-08-21",
        "label": "Ağu 26",
        "period": "Aug",
        "actual": 54.2,
        "forecast": 54,
        "previous": null,
        "unit": ""
      },
      {
        "date": "2026-09-23",
        "label": "Eyl 26",
        "period": "Sep",
        "actual": 55.8,
        "forecast": 56,
        "previous": null,
        "unit": ""
      },
      {
        "date": "2026-10-23",
        "label": "Eki 26",
        "period": "Oct",
        "actual": 57.6,
        "forecast": 58,
        "previous": null,
        "unit": ""
      }
    ]
  },
  "EU|Aylık Üretici Fiyat Endeksi (ÜFE)": {
    "unit": "%",
    "points": [
      {
        "date": "2026-03-13",
        "label": "Mar 26",
        "period": "Jan",
        "actual": -1.5,
        "forecast": 0.6,
        "previous": -0.6,
        "unit": "%"
      },
      {
        "date": "2026-04-15",
        "label": "Nis 26",
        "period": "Feb",
        "actual": 0.4,
        "forecast": 0.3,
        "previous": -0.8,
        "unit": "%"
      },
      {
        "date": "2026-05-13",
        "label": "May 26",
        "period": "Mar",
        "actual": 0.2,
        "forecast": 0.3,
        "previous": 0.2,
        "unit": "%"
      },
      {
        "date": "2026-06-15",
        "label": "Haz 26",
        "period": "Apr",
        "actual": 0.1,
        "forecast": 0.3,
        "previous": 0.4,
        "unit": "%"
      },
      {
        "date": "2026-07-15",
        "label": "Tem 26",
        "period": "May",
        "actual": -0.2,
        "forecast": 0.2,
        "previous": 0.3,
        "unit": "%"
      },
      {
        "date": "2026-08-13",
        "label": "Ağu 26",
        "period": "Jun",
        "actual": 0,
        "forecast": -0.1,
        "previous": 0.3,
        "unit": "%"
      },
      {
        "date": "2026-09-16",
        "label": "Eyl 26",
        "period": "Jul",
        "actual": -0.1,
        "forecast": -0.2,
        "previous": -0.1,
        "unit": "%"
      },
      {
        "date": "2026-10-15",
        "label": "Eki 26",
        "period": "Aug",
        "actual": -0.5,
        "forecast": 0,
        "previous": -0.3,
        "unit": "%"
      }
    ]
  },
  "EU|Euro Bölgesi Çeyreklik Büyüme (GSYH)": {
    "unit": "%",
    "points": [
      {
        "date": "2026-01-30",
        "label": "Oca 26",
        "period": "Q4",
        "actual": 0.3,
        "forecast": 0.2,
        "previous": 0.3,
        "unit": "%"
      },
      {
        "date": "2026-04-30",
        "label": "Nis 26",
        "period": "Q1",
        "actual": 0.1,
        "forecast": 0.2,
        "previous": 0.2,
        "unit": "%"
      },
      {
        "date": "2026-07-30",
        "label": "Tem 26",
        "period": "Q2",
        "actual": 0.4,
        "forecast": 0.2,
        "previous": 0,
        "unit": "%"
      },
      {
        "date": "2026-10-30",
        "label": "Eki 26",
        "period": "Q3",
        "actual": 0.4,
        "forecast": 0.2,
        "previous": 0.6,
        "unit": "%"
      }
    ]
  },
  "EU|Euro Bölgesi Tüketici Güven Endeksi (Öncü)": {
    "unit": "Puan",
    "points": [
      {
        "date": "2026-03-23",
        "label": "Mar 26",
        "period": "Mar",
        "actual": -16.3,
        "forecast": -14.4,
        "previous": -12.3,
        "unit": ""
      },
      {
        "date": "2026-04-22",
        "label": "Nis 26",
        "period": "Apr",
        "actual": -20.6,
        "forecast": null,
        "previous": -16.4,
        "unit": ""
      },
      {
        "date": "2026-05-21",
        "label": "May 26",
        "period": "May",
        "actual": -19,
        "forecast": -20.8,
        "previous": -20.6,
        "unit": ""
      },
      {
        "date": "2026-06-22",
        "label": "Haz 26",
        "period": "Jun",
        "actual": -17.7,
        "forecast": -17.5,
        "previous": -19,
        "unit": ""
      },
      {
        "date": "2026-07-23",
        "label": "Tem 26",
        "period": "Jul",
        "actual": -15.9,
        "forecast": -16.8,
        "previous": -17.6,
        "unit": ""
      },
      {
        "date": "2026-08-21",
        "label": "Ağu 26",
        "period": "Aug",
        "actual": -15.5,
        "forecast": -16.3,
        "previous": -15.9,
        "unit": ""
      },
      {
        "date": "2026-09-22",
        "label": "Eyl 26",
        "period": "Sep",
        "actual": -16.5,
        "forecast": -16,
        "previous": -15.5,
        "unit": ""
      },
      {
        "date": "2026-10-22",
        "label": "Eki 26",
        "period": "Oct",
        "actual": -17.9,
        "forecast": -17,
        "previous": -16.8,
        "unit": ""
      }
    ]
  },
  "EU|S&P Global İmalat PMI (Nihai)": {
    "unit": "Puan",
    "points": [
      {
        "date": "2026-03-24",
        "label": "Mar 26",
        "period": "Mar",
        "actual": 49.4,
        "forecast": 49.4,
        "previous": null,
        "unit": ""
      },
      {
        "date": "2026-04-23",
        "label": "Nis 26",
        "period": "Apr",
        "actual": 51.1,
        "forecast": 50.8,
        "previous": null,
        "unit": ""
      },
      {
        "date": "2026-05-21",
        "label": "May 26",
        "period": "May",
        "actual": 52.2,
        "forecast": 51.8,
        "previous": null,
        "unit": ""
      },
      {
        "date": "2026-06-23",
        "label": "Haz 26",
        "period": "Jun",
        "actual": 51.7,
        "forecast": 51.6,
        "previous": null,
        "unit": ""
      },
      {
        "date": "2026-07-24",
        "label": "Tem 26",
        "period": "Jul",
        "actual": 51.2,
        "forecast": 51.5,
        "previous": null,
        "unit": ""
      },
      {
        "date": "2026-08-21",
        "label": "Ağu 26",
        "period": "Aug",
        "actual": 51.4,
        "forecast": 51.8,
        "previous": null,
        "unit": ""
      },
      {
        "date": "2026-09-23",
        "label": "Eyl 26",
        "period": "Sep",
        "actual": 52.5,
        "forecast": 52.6,
        "previous": null,
        "unit": ""
      },
      {
        "date": "2026-10-23",
        "label": "Eki 26",
        "period": "Oct",
        "actual": 53,
        "forecast": 52.7,
        "previous": null,
        "unit": ""
      }
    ]
  },
  "UK|S&P Global İmalat PMI (Nihai)": {
    "unit": "Puan",
    "points": [
      {
        "date": "2026-03-01",
        "label": "Mar 26",
        "period": "Şub",
        "actual": 51.2,
        "forecast": 51.5,
        "previous": 50.8,
        "unit": "Puan"
      },
      {
        "date": "2026-04-01",
        "label": "Nis 26",
        "period": "Mar",
        "actual": 52,
        "forecast": 51.8,
        "previous": 51.2,
        "unit": "Puan"
      },
      {
        "date": "2026-05-01",
        "label": "May 26",
        "period": "Nis",
        "actual": 52.4,
        "forecast": 52.1,
        "previous": 52,
        "unit": "Puan"
      },
      {
        "date": "2026-06-01",
        "label": "Haz 26",
        "period": "May",
        "actual": 51.8,
        "forecast": 52.2,
        "previous": 52.4,
        "unit": "Puan"
      },
      {
        "date": "2026-07-01",
        "label": "Tem 26",
        "period": "Haz",
        "actual": 52.5,
        "forecast": 52,
        "previous": 51.8,
        "unit": "Puan"
      },
      {
        "date": "2026-08-01",
        "label": "Ağu 26",
        "period": "Tem",
        "actual": 51.9,
        "forecast": 52.8,
        "previous": 52.5,
        "unit": "Puan"
      },
      {
        "date": "2026-09-01",
        "label": "Eyl 26",
        "period": "Ağu",
        "actual": 52.3,
        "forecast": 52,
        "previous": 51.9,
        "unit": "Puan"
      },
      {
        "date": "2026-10-01",
        "label": "Eki 26",
        "period": "Eyl",
        "actual": 52.8,
        "forecast": 52.5,
        "previous": 52.3,
        "unit": "Puan"
      }
    ]
  },
  "UK|İngiltere Merkez Bankası (BoE) Faiz Kararı": {
    "unit": "%",
    "points": [
      {
        "date": "2025-11-06",
        "label": "Kas 25",
        "period": "Kas",
        "actual": 5.25,
        "forecast": 5.25,
        "previous": 5.25,
        "unit": "%"
      },
      {
        "date": "2025-12-18",
        "label": "Ara 25",
        "period": "Ara",
        "actual": 5.25,
        "forecast": 5.25,
        "previous": 5.25,
        "unit": "%"
      },
      {
        "date": "2026-02-05",
        "label": "Şub 26",
        "period": "Şub",
        "actual": 5.25,
        "forecast": 5.25,
        "previous": 5.25,
        "unit": "%"
      },
      {
        "date": "2026-03-19",
        "label": "Mar 26",
        "period": "Mar",
        "actual": 5.25,
        "forecast": 5.25,
        "previous": 5.25,
        "unit": "%"
      },
      {
        "date": "2026-05-07",
        "label": "May 26",
        "period": "May",
        "actual": 5.25,
        "forecast": 5.25,
        "previous": 5.25,
        "unit": "%"
      },
      {
        "date": "2026-06-18",
        "label": "Haz 26",
        "period": "Haz",
        "actual": 5.25,
        "forecast": 5.25,
        "previous": 5.25,
        "unit": "%"
      },
      {
        "date": "2026-08-06",
        "label": "Ağu 26",
        "period": "Ağu",
        "actual": 5,
        "forecast": 5,
        "previous": 5.25,
        "unit": "%"
      },
      {
        "date": "2026-09-17",
        "label": "Eyl 26",
        "period": "Eyl",
        "actual": 5,
        "forecast": 5,
        "previous": 5,
        "unit": "%"
      }
    ]
  }
};

export function getIndicatorHistory(event: string, country?: string): IndicatorHistorySeries {
    if (country && INDICATOR_HISTORY_DATABASE[country + "|" + event]) {
        return INDICATOR_HISTORY_DATABASE[country + "|" + event];
    }
    // Arama yap
    for (const [k, v] of Object.entries(INDICATOR_HISTORY_DATABASE)) {
        if (k.endsWith("|" + event) || k.toLowerCase().includes(event.toLowerCase())) {
            return v;
        }
    }
    return {
        unit: "%",
        points: [
            { date: "2026-03-01", label: "Mar 26", actual: 2.1, forecast: 2.0 },
            { date: "2026-04-01", label: "Nis 26", actual: 2.4, forecast: 2.2 },
            { date: "2026-05-01", label: "May 26", actual: 1.9, forecast: 2.1 },
            { date: "2026-06-01", label: "Haz 26", actual: 2.5, forecast: 2.3 },
            { date: "2026-07-01", label: "Tem 26", actual: 2.0, forecast: 2.0 },
            { date: "2026-08-01", label: "Ağu 26", actual: 1.8, forecast: 1.9 }
        ]
    };
}
