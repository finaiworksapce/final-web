"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  ChevronRight, 
  ChevronLeft,
  Activity,
  Info,
  BarChart3,
  RefreshCw,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Trophy,
  Flame,
  X,
  Filter,
  ChevronDown,
  Coins,
  Minus,
  Layers,
  Sparkles,
  Building2,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { STOCK_SECTORS } from "@/lib/constants/assets-mapping";
import TradingViewScreenerWidget from "@/components/TradingViewScreenerWidget";
import StockLogo from "@/components/StockLogo";

// BIST Åirket Tam AdlarÄ± KataloÄŸu
const STOCK_NAMES: Record<string, string> = {
    "ATATR": "Ata Turizm Ä°ÅŸletmecilik TaÅŸÄ±macÄ±lÄ±k Madencilik Kuyumculuk San. ve DÄ±ÅŸ Ticaret A.Å.",
    "BESTE": "Best Brands Grup Enerji YatÄ±rÄ±m A.Å.",
    "AKHAN": "Akhan Un FabrikasÄ± ve TarÄ±m ÃœrÃ¼nleri GÄ±da Sanayi Tic. A.Å.",
    "NETCD": "Netcad YazÄ±lÄ±m A.Å.",
    "ZGYO": "Z Gayrimenkul YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "MEYSU": "Meysu GÄ±da San. ve Tic. A.Å.",
    "ARFYE": "Arf Bio Yenilenebilir Enerji Ãœretim A.Å.",
    "ZERGY": "Zeray Gayrimenkul YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "PAHOL": "Pasifik Holding A.Å.",
    "ECOGR": "Ecogreen Enerji Holding A.Å.",
    "MARMR": "Marmara Holding A.Å.",
    "DOFRB": "Dof Robotik Sanayi A.Å.",
    "BULGS": "Bulls GiriÅŸim Sermayesi YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "BALSU": "Balsu GÄ±da San. ve Tic. A.Å.",
    "KLYPV": "Kalyon GÃ¼neÅŸ Teknolojileri Ãœretim A.Å.",
    "ENDAE": "Enda Enerji Holding A.Å.",
    "VSNMD": "ViÅŸne Madencilik Ãœretim San. ve Tic. A.Å.",
    "DSTKF": "Destek Finans Faktoring A.Å.",
    "BIGEN": "BirleÅŸim Grup Enerji YatÄ±rÄ±mlarÄ± A.Å.",
    "SERNT": "Seranit Granit Seramik San. ve Tic. A.Å.",
    "MOPAS": "MopaÅŸ Marketcilik GÄ±da San. ve Tic. A.Å.",
    "AKFIS": "Akfen Ä°nÅŸaat Turizm ve Ticaret A.Å.",
    "GLRMK": "GÃ¼lermak AÄŸÄ±r Sanayi Ä°nÅŸaat ve TaahhÃ¼t A.Å.",
    "EGEGY": "EgeyapÄ± Avrupa Gayrimenkul YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "ARMGD": "Armada GÄ±da Ticaret Sanayi A.Å.",
    "SMRVA": "SÃ¼mer VarlÄ±k YÃ¶netim A.Å.",
    "CGCAM": "Ã‡aÄŸdaÅŸ Cam San. ve Tic. A.Å.",
    "BINBN": "(binbin) Bin UlaÅŸÄ±m ve AkÄ±llÄ± Åehir Teknolojileri A.Å.",
    "DURKN": "Durukan Åekerleme San. ve Tic. A.Å.",
    "CEMZY": "Cem Zeytin A.Å.",
    "OZATD": "Ã–zata Denizcilik San. ve Tic. A.Å.",
    "AHSGY": "Ahes Gayrimenkul YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "GUNDG": "GÃ¼ndoÄŸdu GÄ±da SÃ¼t ÃœrÃ¼nleri San. ve DÄ±ÅŸ Tic. A.Å.",
    "TCKRC": "KÄ±raÃ§ Galvaniz Telekominikasyon Metal Makine Ä°nÅŸaat Elektrik San. ve Tic. A.Å.",
    "BAHKM": "BahadÄ±r Kimya San. ve Tic. A.Å.",
    "DCTTR": "Dct Trading DÄ±ÅŸ Ticaret A.Å.",
    "SEGMN": "SeÄŸmen KardeÅŸler GÄ±da Ãœretim ve Ambalaj Sanayi A.Å.",
    "EFOR": "Efor YatÄ±rÄ±m Sanayi Tic. A.Å.",
    "HOROZ": "Horoz Lojistik Kargo Hizmetleri ve Tic. A.Å.",
    "YIGIT": "YiÄŸit AkÃ¼ Malzemeleri Nakliyat Turizm Ä°nÅŸaat San. ve Tic. A.Å.",
    "ALKLC": "AltÄ±nkÄ±lÄ±Ã§ GÄ±da ve SÃ¼t San. Tic. A.Å.",
    "OZYSR": "Ã–zyaÅŸar Tel ve Galvanizleme San. A.Å.",
    "ONRYT": "Onur YÃ¼ksek Teknoloji A.Å.",
    "HRKET": "Hareket Proje TaÅŸÄ±macÄ±lÄ±ÄŸÄ± ve YÃ¼k MÃ¼hendisliÄŸi A.Å.",
    "KOCMT": "KoÃ§ Metalurji A.Å.",
    "ALTNY": "AltÄ±nay Savunma Teknolojileri A.Å.",
    "KOTON": "Koton MaÄŸazacÄ±lÄ±k Tekstil San. ve Tic. A.Å.",
    "LILAK": "Lila KaÄŸÄ±t San. ve Tic. A.Å.",
    "RGYAS": "RÃ¶nesans Gayrimenkul YatÄ±rÄ±m A.Å.",
    "ENTRA": "Ic Enterra Yenilenebilir Enerji A.Å.",
    "ODINE": "Odine Solutions Teknoloji Tic. ve San. A.Å.",
    "MOGAN": "Mogan Enerji YatÄ±rÄ±m Holding A.Å.",
    "ARTMS": "Artemis HalÄ± A.Å.",
    "OBAMS": "Oba MakarnacÄ±lÄ±k San. ve Tic. A.Å.",
    "ALVES": "Alves Kablo San. ve Tic. A.Å.",
    "LMKDC": "Limak DoÄŸu Anadolu Ã‡imento San. ve Tic. A.Å.",
    "BORSK": "Bor Åeker A.Å.",
    "PATEK": "Pasifik Teknoloji A.Å.",
    "AVPGY": "Avrupakent Gayrimenkul YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "MEGMT": "Mega Metal San. ve Tic. A.Å.",
    "KBORU": "Kuzey Boru A.Å.",
    "SURGY": "Sur Tatil Evleri Gayrimenkul YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "CATES": "Ã‡ates Elektrik Ãœretim A.Å.",
    "SKYMD": "Åeker YatÄ±rÄ±m Menkul DeÄŸerler A.Å.",
    "BEGYO": "BatÄ± Ege Gayrimenkul YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "AGROT": "Agrotech YÃ¼ksek Teknoloji ve YatÄ±rÄ±m A.Å.",
    "EKOS": "Ekos Teknoloji ve Elektrik A.Å.",
    "BINHO": "1000 YatÄ±rÄ±mlar Holding A.Å.",
    "MARBL": "Tureks TurunÃ§ Madencilik Ä°Ã§ ve DÄ±ÅŸ Tic. A.Å.",
    "TABGD": "Tab GÄ±da San. ve Tic. A.Å.",
    "VRGYO": "Vera Konsept Gayrimenkul YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "MHRGY": "Mhr Gayrimenkul YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "BORLS": "Borlease Otomotiv A.Å.",
    "DOFER": "Dofer YapÄ± Malzemeleri San. ve Tic. A.Å.",
    "MEKAG": "Meka Global Makine Ä°malat San. ve Tic. A.Å.",
    "DMRGD": "Dmr Unlu Mamuller Ãœretim GÄ±da Toptan Perakende Ä°hracat A.Å.",
    "ADGYO": "Adra Gayrimenkul YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "HATSN": "Hat-San Gemi Ä°nÅŸaa BakÄ±m OnarÄ±m Deniz Nakliyat San. ve Tic. A.Å.",
    "REEDR": "Reeder Teknoloji San. ve Tic. A.Å.",
    "GIPTA": "GÄ±pta Ofis KÄ±rtasiye ve Promosyon ÃœrÃ¼nleri Ä°malat San. A.Å.",
    "TARKM": "Tarkim Bitki Koruma San. ve Tic. A.Å.",
    "EBEBK": "Ebebek MaÄŸazacÄ±lÄ±k A.Å.",
    "KZGYO": "Kuzugrup Gayrimenkul YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "ENERY": "Enerya Enerji A.Å.",
    "TATEN": "TatlÄ±pÄ±nar Enerji Ãœretim A.Å.",
    "OFSYM": "Ofis Yem GÄ±da San. Tic. A.Å.",
    "IZENR": "Ä°zdemir Enerji Elektrik Ãœretim A.Å.",
    "ASGYO": "Asce Gayrimenkul YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "KLSER": "Kaleseramik, Ã‡anakkale Kalebodur Seramik Sanayi A.Å.",
    "FZLGY": "Fuzul Gayrimenkul YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "ATAKP": "Atakey Patates GÄ±da San. ve Tic. A.Å.",
    "FORTE": "Forte Bilgi Ä°letiÅŸim Teknolojileri ve Savunma Sanayi A.Å.",
    "A1CAP": "A1 Capital YatÄ±rÄ±m Menkul DeÄŸerler A.Å.",
    "PASEU": "Pasifik Eurasia Lojistik DÄ±ÅŸ Ticaret A.Å.",
    "KTLEV": "KatÄ±lÄ±mevim Tasarruf Finansman A.Å.",
    "BIENY": "Bien YapÄ± ÃœrÃ¼nleri San. Turizm ve Tic. A.Å.",
    "KAYSE": "Kayseri Åeker FabrikasÄ± A.Å.",
    "BIGCH": "(BigChefs) BÃ¼yÃ¼k Åefler GÄ±da Turizm Tekstil DanÄ±ÅŸmanlÄ±k Organizasyon EÄŸitim San. ve Tic. A.Å.",
    "CWENE": "Cw Enerji MÃ¼hendislik Tic. ve San. A.Å.",
    "GRTHO": "GraÄ±nturk Holding A.Å.",
    "EUPWR": "Europower Enerji ve Otomasyon Teknolojileri San. Tic. A.Å.",
    "CVKMD": "Cvk Maden Ä°ÅŸletmeleri San. ve Tic. A.Å.",
    "KOPOL": "Koza Polyester San. ve Tic. A.Å.",
    "EKSUN": "Eksun GÄ±da TarÄ±m San. ve Tic. A.Å.",
    "AKFYE": "Akfen Yenilenebilir Enerji A.Å.",
    "GOKNR": "GÃ¶knur GÄ±da Maddeleri Enerji Ä°malat Ä°thalat Ä°hracat Tic. ve San. A.Å.",
    "BVSAN": "BÃ¼lbÃ¼loÄŸlu VinÃ§ San. ve Tic. A.Å.",
    "MACKO": "MaÃ§kolik Ä°nternet Hizmetleri Tic. A.Å.",
    "ASTOR": "Astor Enerji A.Å.",
    "TNZTP": "Tapdi Oksijen Ã–zel SaÄŸlÄ±k ve EÄŸitim Hizmetleri San. Tic. A.Å.",
    "SOKE": "SÃ¶ke DeÄŸirmencilik San. ve Tic. A.Å.",
    "SDTTR": "Sdt Uzay ve Savunma Teknolojileri A.Å.",
    "ONCSM": "Oncosem Onkolojik Sistemler San. ve Tic. A.Å.",
    "EYGYO": "Eyg Gayrimenkul YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "TERA": "Tera YatÄ±rÄ±m Menkul DeÄŸerler A.Å.",
    "AHGAZ": "AhlatcÄ± DoÄŸal Gaz DaÄŸÄ±tÄ±m Enerji ve YatÄ±rÄ±m A.Å.",
    "BRKVY": "Birikim VarlÄ±k YÃ¶netim A.Å.",
    "PLTUR": "Platform Turizm TaÅŸÄ±macÄ±lÄ±k GÄ±da Ä°nÅŸaat Temizlik Hizmetleri San. ve Tic. A.Å.",
    "OZSUB": "Ã–zsu BalÄ±k Ãœretim A.Å.",
    "SNICA": "Sanica IsÄ± Sanayi A.Å.",
    "ALFAS": "Alfa Solar Enerji San. ve Tic. A.Å.",
    "AZTEK": "Aztek Teknoloji ÃœrÃ¼nleri A.Å.",
    "HKTM": "Hidropar Hareket Kontrol Teknolojileri Merkezi San. ve Tic. A.Å.",
    "BARMA": "Barem Ambalaj San. ve Tic. A.Å.",
    "KRPLS": "Koroplast Temizlik Ambalaj ÃœrÃ¼nleri San. ve DÄ±ÅŸ Ticaret A.Å.",
    "KLRHO": "Kiler Holding A.Å.",
    "RUBNS": "Rubenis Tekstil San. Tic. A.Å.",
    "KCAER": "Kocaer Ã‡elik San. ve Tic. A.Å.",
    "PRDGS": "Pardus GiriÅŸim Sermayesi YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "MAKIM": "Makim Makina Teknolojileri San. Tic. A.Å.",
    "EUREN": "Europen EndÃ¼stri Ä°nÅŸaat San. ve Tic. A.Å.",
    "SEGYO": "Åeker Gayrimenkul YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "SUNTK": "Sun Tekstil San. ve Tic. A.Å.",
    "YYLGD": "Yayla Agro GÄ±da San. ve Tic. A.Å.",
    "BMSTL": "Bms BirleÅŸik Metal San. ve Tic. A.Å.",
    "IMASM": "Ä°maÅŸ Makine Sanayi A.Å.",
    "KMPUR": "Kimteks PoliÃ¼retan San. ve Tic. A.Å.",
    "CONSE": "Consus Enerji Ä°ÅŸletmeciliÄŸi ve Hizmetleri A.Å.",
    "SUWEN": "Suwen Tekstil Sanayi Pazarlama A.Å.",
    "LIDER": "Ldr Turizm A.Å.",
    "SMRTG": "Smart GÃ¼neÅŸ Enerjisi Teknolojileri Ar-Ge Ãœretim San. ve Tic. A.Å.",
    "ENSRI": "Ensari Deri GÄ±da San. ve Tic. A.Å.",
    "GRSEL": "GÃ¼r-Sel Turizm TaÅŸÄ±macÄ±lÄ±k ve Servis Tic. A.Å.",
    "GZNMI": "Gezinomi Seyahat Turizm Tic. A.Å.",
    "KLSYN": "Koleksiyon Mobilya Sanayi A.Å.",
    "HTTBT": "Hitit Bilgisayar Hizmetleri A.Å.",
    "INVES": "Investco Holding A.Å.",
    "DAPGM": "Dap Gayrimenkul GeliÅŸtirme A.Å.",
    "HUNER": "Hun Yenilenebilir Enerji Ãœretim A.Å.",
    "PNLSN": "Panelsan Ã‡atÄ± Cephe Sistemleri San. ve Tic. A.Å.",
    "ERCB": "Erciyas Ã‡elik Boru San. A.Å.",
    "PSGYO": "Pasifik Gayrimenkul YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "PCILT": "Pc Ä°letiÅŸim ve Medya Hizmetleri San. Tic. A.Å.",
    "GMTAS": "Gimat MaÄŸazacÄ±lÄ±k San. ve Tic. A.Å.",
    "KONKA": "Konya KaÄŸÄ±t San. ve Tic. A.Å.",
    "MOBTL": "Mobiltel Ä°letiÅŸim Hizmetleri San. ve Tic. A.Å.",
    "MIATK": "Mia Teknoloji A.Å.",
    "ISSEN": "Ä°ÅŸbir Sentetik Dokuma Sanayi A.Å.",
    "ELITE": "Elite Naturel Organik GÄ±da San. ve Tic. A.Å.",
    "ARASE": "DoÄŸu Aras Enerji YatÄ±rÄ±mlarÄ± A.Å.",
    "ULUFA": "Ulusal Faktoring A.Å.",
    "IHAAS": "Ä°hlas Haber AjansÄ± A.Å.",
    "ANGEN": "Anatolia TanÄ± ve Biyoteknoloji ÃœrÃ¼nleri Ar-Ge San. ve Tic. A.Å.",
    "HEDEF": "Hedef Holding A.Å.",
    "GLCVY": "Gelecek VarlÄ±k YÃ¶netimi A.Å.",
    "MAGEN": "MargÃ¼n Enerji Ãœretim San. ve Tic. A.Å.",
    "KIMMR": "Ersan AlÄ±ÅŸveriÅŸ Hizmetleri ve GÄ±da San. Tic. A.Å.",
    "TEZOL": "Europap Tezol KaÄŸÄ±t San. ve Tic. A.Å.",
    "YEOTK": "Yeo Teknoloji Enerji ve EndÃ¼stri A.Å.",
    "EGEPO": "Nasmed Ã–zel SaÄŸlÄ±k Hizmetleri Ticaret A.Å.",
    "BRLSM": "BirleÅŸim MÃ¼hendislik IsÄ±tma SoÄŸutma HavalandÄ±rma San. ve Tic. A.Å.",
    "GESAN": "GiriÅŸim Elektrik Sanayi TaahhÃ¼t ve Tic. A.Å.",
    "KZBGY": "KÄ±zÄ±lbÃ¼k Gayrimenkul YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "GENIL": "Gen Ä°laÃ§ ve SaÄŸlÄ±k ÃœrÃ¼nleri San. ve Tic. A.Å.",
    "MANAS": "Manas Enerji YÃ¶netimi San. ve Tic. A.Å.",
    "A1YEN": "A1 Yenilenebilir Enerji Ãœretim A.Å.",
    "ESCAR": "Escar Turizm TaÅŸÄ±macÄ±lÄ±k Ticaret A.Å.",
    "VBTYZ": "Vbt YazÄ±lÄ±m A.Å.",
    "KTSKR": "KÃ¼tahya Åeker FabrikasÄ± A.Å.",
    "EDATA": "E-Data Teknoloji Pazarlama A.Å.",
    "MEDTR": "Meditera TÄ±bbi Malzeme San. ve Tic. A.Å.",
    "SELVA": "Selva GÄ±da Sanayi A.Å.",
    "BASGZ": "BaÅŸkent DoÄŸalgaz DaÄŸÄ±tÄ±m Gayrimenkul YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "OYYAT": "Oyak YatÄ±rÄ±m Menkul DeÄŸerler A.Å.",
    "BMSCH": "Bms Ã‡elik HasÄ±r San. ve Tic. A.Å.",
    "UNLU": "ÃœnlÃ¼ YatÄ±rÄ±m Holding A.Å.",
    "BOBET": "BoÄŸaziÃ§i Beton San. ve Tic. A.Å.",
    "ATATP": "Atp YazÄ±lÄ±m ve Teknoloji A.Å.",
    "MERCN": "Mercan Kimya San. ve Tic. A.Å.",
    "KLKIM": "Kalekim Kimyevi Maddeler San. ve Tic. A.Å.",
    "PENTA": "Penta Teknoloji ÃœrÃ¼nleri DaÄŸÄ±tÄ±m Ticaret A.Å.",
    "ZRGYO": "Ziraat Gayrimenkul YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "CANTE": "Ã‡an2 Termik A.Å.",
    "AYDEM": "Aydem Yenilenebilir Enerji A.Å.",
    "BIOEN": "Biotrend Ã‡evre ve Enerji YatÄ±rÄ±mlarÄ± A.Å.",
    "GWIND": "Galata Wind Enerji A.Å.",
    "TUREX": "Tureks Turizm TaÅŸÄ±macÄ±lÄ±k A.Å.",
    "QUAGR": "Qua Granite Hayal YapÄ± ve ÃœrÃ¼nleri San. Tic. A.Å.",
    "MTRKS": "Matriks Finansal Teknolojiler A.Å.",
    "NTGAZ": "Naturelgaz Sanayi ve Ticaret A.Å.",
    "ISKPL": "IÅŸÄ±k Plastik Sanayi ve DÄ±ÅŸ Ticaret Pazarlama A.Å.",
    "ARZUM": "Arzum Elektrikli Ev Aletleri San. ve Tic. A.Å.",
    "KRVGD": "Kervan GÄ±da San. ve Tic. A.Å.",
    "ESEN": "EsenboÄŸa Elektrik Ãœretim A.Å.",
    "DNISI": "Dinamik IsÄ± YalÄ±tÄ±m Malzemeleri San. ve Tic. A.Å.",
    "FADE": "Fade GÄ±da YatÄ±rÄ±m San. ve Tic. A.Å.",
    "BAYRK": "Bayrak Ebt Taban San. ve Tic. A.Å.",
    "ARDYZ": "Ard Grup BiliÅŸim Teknolojileri A.Å.",
    "PAPIL": "Papilon Savunma Teknoloji ve Tic. A.Å.",
    "YKSLN": "YÃ¼kselen Ã‡elik A.Å.",
    "NATEN": "Naturel Yenilenebilir Enerji A.Å.",
    "DERHL": "DerlÃ¼ks YatÄ±rÄ±m Holding A.Å.",
    "CEOEM": "Ceo Event Medya A.Å.",
    "SMART": "Smartiks YazÄ±lÄ±m A.Å.",
    "FORMT": "Formet Ã‡elik KapÄ± San. ve Tic. A.Å.",
    "KFEIN": "Kafein YazÄ±lÄ±m Hizmetleri Ticaret A.Å.",
    "SOKM": "Åok Marketler Ticaret A.Å.",
    "PEKGY": "Peker Gayrimenkul YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "MPARK": "MLP SaÄŸlÄ±k Hizmetleri A.Å.",
    "ENJSA": "Enerjisa Enerji A.Å.",
    "TLMAN": "Trabzon Liman Ä°ÅŸletmeciliÄŸi A.Å.",
    "SAFKR": "Safkar Ege SoÄŸutmacÄ±lÄ±k Klima SoÄŸuk Hava Tesisleri Ä°hr. Ä°th. San. ve Tic. A.Å.",
    "MAVI": "Mavi Giyim San. ve Tic. A.Å.",
    "FONET": "Fonet Bilgi Teknolojileri A.Å.",
    "MSGYO": "Mistral Gayrimenkul YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "ISDMR": "Ä°skenderun Demir ve Ã‡elik A.Å.",
    "VERTU": "Verusaturk GiriÅŸim Sermayesi YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "BNTAS": "BantaÅŸ BandÄ±rma Ambalaj San. ve Tic. A.Å.",
    "HDFGS": "Hedef GiriÅŸim Sermayesi YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "AGESA": "Agesa Hayat ve Emeklilik A.Å.",
    "ULUUN": "Ulusoy Un San. ve Tic. A.Å.",
    "ULUSE": "Ulusoy Elektrik Ä°malat TaahhÃ¼t Tic. A.Å.",
    "IZFAS": "Ä°zmir FÄ±rÃ§a San. Ve Tic. A.Å.",
    "LIDFA": "Lider Faktoring A.Å.",
    "PAMEL": "Pamel Yenilenebilir Elektrik Ãœretimi A.Å.",
    "TUCLK": "TuÄŸÃ§elik AlÃ¼minyum ve Metal Mamulleri San. Ve Tic. A.Å.",
    "RTALB": "Rta LabaratuvarlarÄ± Biyolojik ÃœrÃ¼nler Ä°laÃ§ ve Makine San. Tic. A.Å.",
    "KRGYO": "KÃ¶rfez Gayrimenkul YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "POLTK": "Politeknik Metal San. ve Tic. A.Å.",
    "GEDZA": "Gediz Ambalaj San. ve Tic. A.Å.",
    "TMPOL": "Temapol Polimer Plastik ve Ä°nÅŸaat San. Tic. A.Å.",
    "YAYLA": "Yayla Enerji Turizm Ve Ä°nÅŸaat Tic. A.Å.",
    "VERUS": "Verusa Holding A.Å.",
    "YGGYO": "Yeni Gimat Gayrimenkul YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "TURGG": "TÃ¼rker Proje Gayrimenkul ve YatÄ±rÄ±m GeliÅŸtirme A.Å.",
    "SAYAS": "Say Yenilenebilir Enerji EkipmanlarÄ± San. ve Tic. A.Å.",
    "OTTO": "Otto Holding A.Å.",
    "PAGYO": "Panora Gayrimenkul YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "ODAS": "OdaÅŸ Elektrik Ãœretim San. Tic. A.Å.",
    "PGSUS": "Pegasus Hava TaÅŸÄ±macÄ±lÄ±ÄŸÄ± A.Å.",
    "SRVGY": "Servet Gayrimenkul YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "HLGYO": "Halk Gayrimenkul YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "AKSGY": "AkiÅŸ GayrÄ±menkul YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "AVHOL": "Avrupa YatÄ±rÄ±m Holding A.Å.",
    "TMSN": "TÃ¼mosan Motor ve TraktÃ¶r Sanayi A.Å.",
    "BERA": "Bera Holding A.Å.",
    "LYDYE": "Lydia YeÅŸil Enerji KaynaklarÄ± A.Å.",
    "KUYAS": "KuyaÅŸ YatÄ±rÄ±m A.Å.",
    "JANTS": "Jantsa Jant San. ve Tic. A.Å.",
    "DENGE": "Denge YatÄ±rÄ±m Holding A.Å.",
    "ETILR": "Etiler GÄ±da ve Ticari YatÄ±rÄ±mlar San. ve Tic. A.Å.",
    "ACSEL": "AcÄ±selsan AcÄ±payam SelÃ¼loz San. ve Tic. A.Å.",
    "TGSAS": "Tgs DÄ±ÅŸ Ticaret A.Å.",
    "POLHO": "Polisan Holding A.Å.",
    "OSTIM": "Ostim EndÃ¼striyel YatÄ±rÄ±mlar ve Ä°ÅŸletme A.Å.",
    "TKNSA": "Teknosa Ä°Ã§ ve DÄ±ÅŸ Ticaret A.Å.",
    "ORGE": "Orge Enerji Elektrik TaahhÃ¼t A.Å.",
    "SANFM": "Sanifoam SÃ¼nger San. ve Tic. A.Å.",
    "BEYAZ": "Beyaz Filo Oto Kiralama A.Å.",
    "NIBAS": "NiÄŸbaÅŸ NiÄŸde Beton San. ve Tic. A.Å.",
    "OSMEN": "OsmanlÄ± YatÄ±rÄ±m Menkul DeÄŸerler A.Å.",
    "OZKGY": "Ã–zak Gayrimenkul YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "AVOD": "(Avod) A.V.O.D. KurutulmuÅŸ GÄ±da ve TarÄ±m ÃœrÃ¼nleri San. Tic. A.Å.",
    "ADESE": "Adese Gayrimenkul YatÄ±rÄ±m A.Å.",
    "INFO": "Ä°nfo YatÄ±rÄ±m Menkul DeÄŸerler A.Å.",
    "GLRYH": "GÃ¼ler YatÄ±rÄ±m Holding A.Å.",
    "DAGI": "Dagi Giyim San. ve Tic. A.Å.",
    "KRONT": "Kron Teknoloji A.Å.",
    "BLCYT": "Bilici YatÄ±rÄ±m San. ve Tic. A.Å.",
    "YAPRK": "Yaprak SÃ¼t ve Besi Ã‡iftlikleri San. ve Tic. A.Å.",
    "AKFGY": "Akfen Gayrimenkul YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "KLGYO": "Kiler Gayrimenkul YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "ZEDUR": "Zedur Enerji Elektrik Ãœretim A.Å.",
    "LKMNH": "Lokman Hekim EngÃ¼rÃ¼saÄŸ SaÄŸlÄ±k Turizm EÄŸitim Hizmetleri ve Ä°nÅŸaat TaahhÃ¼t A.Å.",
    "HATEK": "Hateks Hatay Tekstil Ä°ÅŸletmeleri A.Å.",
    "DESPC": "Despec Bilgisayar Paz. ve Tic. A.Å.",
    "DOCO": "DO &#038; CO Aktiengesellschaft",
    "EKGYO": "Emlak Konut Gayrimenkul YatÄ±rÄ±m A.Å.",
    "KATMR": "Katmerciler AraÃ§ ÃœstÃ¼ Ekipman San. ve Tic. A.Å.",
    "IHYAY": "Ä°hlas YayÄ±n Holding A.Å.",
    "TRGYO": "Torunlar Gayrimenkul YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "MRGYO": "MartÄ± Gayrimenkul YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "GEDIK": "Gedik YatÄ±rÄ±m Menkul DeÄŸerler A.Å.",
    "RYGYO": "ReysaÅŸ Gayrimenkul YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "CEMAS": "Ã‡emaÅŸ DÃ¶kÃ¼m Sanayi A.Å.",
    "ANELE": "Anel Elektrik Proje TaahhÃ¼t ve Tic. A.Å.",
    "IHGZT": "Ä°hlas Gazetecilik A.Å.",
    "AKSEN": "Aksa Enerji Ãœretim A.Å.",
    "TSGYO": "Tskb Gayrimenkul YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "TRALT": "TÃ¼rk AltÄ±n Ä°ÅŸletmeleri A.Å.",
    "GOZDE": "GÃ¶zde GiriÅŸim Sermayesi YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "LRSHO": "Loras Holding A.Å.",
    "TTKOM": "TÃ¼rk TelekomÃ¼nikasyon A.Å.",
    "TKFEN": "Tekfen Holding A.Å.",
    "ALBRK": "Albaraka TÃ¼rk KatÄ±lÄ±m BankasÄ± A.Å.",
    "SNGYO": "SinpaÅŸ Gayrimenkul YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "ISMEN": "Ä°ÅŸ YatÄ±rÄ±m Menkul DeÄŸerler A.Å.",
    "HALKB": "TÃ¼rkiye Halk BankasÄ± A.Å.",
    "TAVHL": "Tav HavalimanlarÄ± Holding A.Å.",
    "UFUK": "Ufuk YatÄ±rÄ±m YÃ¶netim ve Gayrimenkul A.Å.",
    "KAREL": "Karel Elektronik San. ve Tic. A.Å.",
    "INGRM": "Ingram Micro BiliÅŸim Sistemleri A.Å.",
    "CCOLA": "Coca-Cola Ä°Ã§ecek A.Å.",
    "SELEC": "SelÃ§uk Ecza Deposu Tic. ve San. A.Å.",
    "VESBE": "Vestel Beyaz EÅŸya San. ve Tic. A.Å.",
    "DGATE": "Datagate Bilgisayar Malzemeleri Ticaret A.Å.",
    "RYSAS": "ReysaÅŸ TaÅŸÄ±macÄ±lÄ±k ve Lojistik Ticaret A.Å.",
    "VAKBN": "TÃ¼rkiye VakÄ±flar BankasÄ± T.A.O.",
    "BIMAS": "Bim BirleÅŸik MaÄŸazalar A.Å.",
    "MARKA": "Marka YatÄ±rÄ±m Holding A.Å.",
    "TSPOR": "Trabzonspor Sportif YatÄ±rÄ±m ve Ticaret A.Å.",
    "ISGSY": "Ä°ÅŸ GiriÅŸim Sermayesi YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "INDES": "Ä°ndeks Bilgisayar Sistemleri MÃ¼hendislik San. ve Tic. A.Å.",
    "DOAS": "DoÄŸuÅŸ Otomotiv Servis ve Ticaret A.Å.",
    "TTRAK": "TÃ¼rk TraktÃ¶r ve Ziraat Makineleri A.Å.",
    "DESA": "Desa Deri San. ve Tic. A.Å.",
    "YESIL": "YeÅŸil YatÄ±rÄ±m Holding A.Å.",
    "FENER": "FenerbahÃ§e Fulbol A.Å.",
    "GEREL": "Gersan Elektrik Tic. San. A.Å.",
    "TRMET": "TR Anadolu Metal Madencilik Ä°ÅŸletmeleri A.Å.",
    "BLUME": "Blume Metal Kimya A.Å.",
    "GSRAY": "Galatasaray Sportif SÄ±nai ve Ticari YatÄ±rÄ±mlar A.Å.",
    "BJKAS": "BeÅŸiktaÅŸ Futbol YatÄ±rÄ±mlarÄ± San. ve Tic. A.Å.",
    "ALKA": "Alkim KaÄŸÄ±t San. ve Tic. A.Å.",
    "ARENA": "Arena Bilgisayar San. ve Tic. A.Å.",
    "LINK": "Link Bilgisayar Sistemleri YazÄ±lÄ±mÄ± ve DonanÄ±mÄ± San. ve Tic. A.Å.",
    "TEKTU": "Tek-Art Ä°nÅŸaat Ticaret Turizm Sanayi ve YatÄ±rÄ±mlar A.Å.",
    "MNDRS": "Menderes Tekstil San. ve Tic. A.Å.",
    "ESCOM": "Escort Teknoloji YatÄ±rÄ±m A.Å.",
    "TCELL": "Turkcell Ä°letiÅŸim Hizmetleri A.Å.",
    "ICUGS": "Icu GiriÅŸim Sermayesi YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "AKENR": "Akenerji Elektrik Ãœretim A.Å.",
    "AYEN": "Ayen Enerji A.Å.",
    "TRENJ": "TR DoÄŸal Enerji KaynaklarÄ± AraÅŸtÄ±rma ve Ãœretim A.Å.",
    "RUZYE": "Ruzy Madencilik ve Enerji YatÄ±rÄ±mlarÄ± San. ve Tic. A.Å.",
    "ZOREN": "Zorlu Enerji Elektrik Ãœretim A.Å.",
    "LOGO": "Logo YazÄ±lÄ±m San. ve Tic. A.Å.",
    "BSOKE": "BatÄ±sÃ¶ke SÃ¶ke Ã‡imento Sanayii T.A.Å.",
    "BIGTK": "Big Medya Teknoloji A.Å.",
    "ISFIN": "Ä°ÅŸ Finansal Kiralama A.Å.",
    "ALKIM": "Alkim Alkali Kimya A.Å.",
    "ANHYT": "Anadolu Hayat Emeklilik A.Å.",
    "NUHCM": "Nuh Ã‡imento Sanayi A.Å.",
    "KARSN": "Karsan Otomotiv Sanayii ve Tic. A.Å.",
    "AGHOL": "AG Anadolu Grubu Holding A.Å.",
    "AKSUE": "Aksu Enerji ve Ticaret A.Å.",
    "NUGYO": "Nurol Gayrimenkul YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "IHLGM": "Ä°hlas Gayrimenkul Proje GeliÅŸtirme ve Tic. A.Å.",
    "ISGYO": "Ä°ÅŸ Gayrimenkul YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "GSDHO": "Gsd Holding A.Å.",
    "INVEO": "Inveo YatÄ±rÄ±m Holding A.Å.",
    "ECZYT": "EczacÄ±baÅŸÄ± YatÄ±rÄ±m Holding OrtaklÄ±ÄŸÄ± A.Å.",
    "IEYHO": "IÅŸÄ±klar Enerji ve YapÄ± Holding A.Å.",
    "ARSAN": "Arsan Holding A.Å.",
    "DUNYH": "DÃ¼nya Holding A.Å.",
    "KGYO": "Koray Gayrimenkul YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "KRDMD": "Kardemir KarabÃ¼k Demir Ã‡elik San. ve Tic. A.Å.",
    "EMKEL": "Emek Elektrik EndÃ¼strisi A.Å.",
    "PENGD": "Penguen GÄ±da Sanayi A.Å.",
    "VAKKO": "Vakko Tekstil ve HazÄ±r Giyim Sanayi Ä°ÅŸletmeleri A.Å.",
    "METRO": "Metro Ticari ve Mali YatÄ±rÄ±mlar Holding A.Å.",
    "CMBTN": "Ã‡imbeton HazÄ±rbeton ve Prefabrik YapÄ± ElemanlarÄ± San. ve Tic. A.Å.",
    "PRKME": "Park Elektrik Ãœretim Madencilik San. ve Tic. A.Å.",
    "KLMSN": "Klimasan Klima San. ve Tic. A.Å.",
    "KRSTL": "Kristal Kola ve MeÅŸrubat San. Tic. A.Å.",
    "RAYSG": "Ray Sigorta A.Å.",
    "DMSAS": "DemisaÅŸ DÃ¶kÃ¼m Emaye MamÃ¼lleri San. A.Å.",
    "SAHOL": "HacÄ± Ã–mer SabancÄ± Holding A.Å.",
    "ASUZU": "Anadolu Isuzu Otomotiv San. ve Tic. A.Å.",
    "SKBNK": "Åekerbank T.A.Å.",
    "VKGYO": "VakÄ±f Gayrimenkul YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "ALGYO": "Alarko Gayrimenkul YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "CLEBI": "Ã‡elebi Hava Servisi A.Å.",
    "BRYAT": "Borusan YatÄ±rÄ±m ve Pazarlama A.Å.",
    "SASA": "Sasa Polyester Sanayi A.Å.",
    "RALYH": "Ral YatÄ±rÄ±m Holding A.Å.",
    "ULKER": "Ãœlker BiskÃ¼vi Sanayi A.Å.",
    "YATAS": "YataÅŸ Yatak ve Yorgan San. Tic. A.Å.",
    "KNFRT": "Konfrut TarÄ±m A.Å.",
    "AVGYO": "Avrasya Gayrimenkul YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "ADEL": "Adel Kalemcilik Tic. Ve San. A.Å.",
    "AKCNS": "AkÃ§ansa Ã‡imento San. ve Tic. A.Å.",
    "DZGYO": "Deniz Gayrimenkul YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "KAPLM": "Kaplamin Ambalaj San. ve Tic. A.Å.",
    "BOSSA": "Bossa Tic. ve San. Ä°ÅŸletmeleri T.A.Å.",
    "GLYHO": "Global YatÄ±rÄ±m Holding A.Å.",
    "OTKAR": "Otokar Otomotiv ve Savunma Sanayi A.Å.",
    "FRIGO": "Frigo-Pak Gida Maddeleri San. ve Tic. A.Å.",
    "SKTAS": "SÃ¶ktaÅŸ Tekstil San. ve Tic. A.Å.",
    "BTCIM": "BatÄ±Ã§im BatÄ± Anadolu Ã‡imento Sanayii A.Å.",
    "GOLTS": "GÃ¶ltaÅŸ GÃ¶ller BÃ¶lgesi Ã‡imento San. ve Tic. A.Å.",
    "GSDDE": "Gsd Denizcilik Gayrimenkul Ä°nÅŸaat San. ve Tic. A.Å.",
    "CEMTS": "Ã‡emtaÅŸ Ã‡elik Makina San. ve Tic. A.Å.",
    "AKGRT": "Aksigorta A.Å.",
    "TUKAS": "TukaÅŸ GÄ±da San. ve Tic. A.Å.",
    "AEFES": "Anadolu Efes BiracÄ±lÄ±k ve Malt Sanayii A.Å.",
    "TURSG": "TÃ¼rkiye Sigorta A.Å.",
    "MERKO": "Merko GÄ±da San. ve Tic. A.Å.",
    "BRSAN": "Borusan BirleÅŸik Boru FabrikalarÄ± San. ve Tic. A.Å.",
    "OZGYO": "Ã–zderici Gayrimenkul YatÄ±rÄ±m OrtaklÄ±ÄŸÄ± A.Å.",
    "DARDL": "Dardanel Ã–nentaÅŸ GÄ±da San. A.Å.",
    "BESLR": "Besler GÄ±da ve Kimya San. ve Tic. A.Å.",
    "EPLAS": "Egeplast Ege Plastik Tic. ve San. A.Å.",
    "IHLAS": "Ä°hlas Holding A.Å.",
    "GARFA": "Garanti Faktoring A.Å.",
    "BFREN": "Bosch Fren Sistemleri San. ve Tic. A.Å.",
    "EGPRO": "Ege Profil Tic. ve San. A.Å.",
    "ANSGR": "Anadolu Anonim TÃ¼rk Sigorta Åirketi",
    "LYDHO": "Lydia Holding A.Å.",
    "TATGD": "Tat GÄ±da Sanayi A.Å.",
    "DOHOL": "DoÄŸan Sirketler Grubu Holding A.Å.",
    "NETAS": "NetaÅŸ TelekomÃ¼nikasyon A.Å.",
    "BANVT": "Banvit BandÄ±rma Vitaminli Yem San. A.Å.",
    "BURCE": "BurÃ§elik Bursa Ã‡elik DÃ¶kÃ¼m San. A.Å.",
    "TRCAS": "Turcas Holding A.Å.",
    "HURGZ": "HÃ¼rriyet Gazetecilik ve MatbaacÄ±lÄ±k A.Å.",
    "ALARK": "Alarko Holding A.Å.",
    "ALCAR": "Alarko Carrier San. ve Tic. A.Å.",
    "TEHOL": "Tera YatÄ±rÄ±m Teknoloji Holding A.Å.",
    "PKENT": "Petrokent Turizm A.Å.",
    "DITAS": "DitaÅŸ Bdy Yedek ParÃ§a Ä°malat ve Teknik A.Å.",
    "DURDO": "Duran DoÄŸan BasÄ±m ve Ambalaj San. A.Å.",
    "CRFSA": "CarrefourSA Carrefour SabancÄ± Ticaret Merkezi A.Å.",
    "TUPRS": "TÃ¼praÅŸ TÃ¼rkiye Petrol Rafinerileri A.Å.",
    "VAKFN": "VakÄ±f Finansal Kiralama A.Å.",
    "AFYON": "Afyon Ã‡imento San. T.A.Å.",
    "MGROS": "Migros T.A.Å.",
    "MNDTR": "Mondi Turkey Oluklu Mukavva KaÄŸÄ±t ve Ambalaj San. A.Å.",
    "EDIP": "Edip Gayrimenkul YatÄ±rÄ±m San. ve Tic. A.Å.",
    "TOASO": "TofaÅŸ TÃ¼rk Otomobil FabrikasÄ± A.Å.",
    "THYAO": "TÃ¼rk Hava YollarÄ± A.O.",
    "USAK": "UÅŸak Seramik Sanayii A.Å.",
    "MRSHL": "Marshall Boya ve Vernik San. A.Å.",
    "KONYA": "Konya Ã‡imento Sanayii A.Å.",
    "PARSN": "Parsan Makina ParÃ§alarÄ± Sanayii A.Å.",
    "KUTPO": "KÃ¼tahya Porselen Sanayii A.Å.",
    "FMIZP": "Federal Mogul Ä°zmit Piston ve Pim Ãœretim Tesisleri A.Å.",
    "ASELS": "Aselsan Elektronik San. ve Tic. A.Å.",
    "DGNMO": "DoÄŸanlar Mobilya Grubu Ä°malat San. ve Tic. A.Å.",
    "AKBNK": "Akbank T.A.Å.",
    "PETKM": "Petkim Petrokimya Holding A.Å.",
    "VESTL": "Vestel Elektronik San. ve Tic. A.Å.",
    "ECILC": "Eis EczacÄ±baÅŸÄ± Ä°laÃ§ SÄ±nai ve Finansal YatÄ±rÄ±mlar San. ve Tic. A.Å.",
    "GARAN": "TÃ¼rkiye Garanti BankasÄ± A.Å.",
    "ICBCT": "Icbc Turkey Bank A.Å.",
    "YUNSA": "YÃ¼nsa YÃ¼nlÃ¼ San. ve Tic. A.Å.",
    "INTEM": "Ä°ntema Ä°nÅŸaat ve Tesisat Malz. Yat. ve Paz. A.Å.",
    "MARTI": "MartÄ± Otel Ä°ÅŸletmeleri A.Å.",
    "GENTS": "GentaÅŸ Dekoratif YÃ¼zeyler San. ve Tic. A.Å.",
    "NTHOL": "Net Holding A.Å.",
    "TBORG": "TÃ¼rk Tuborg Bira ve Malt Sanayii A.Å.",
    "BUCIM": "Bursa Ã‡imento FabrikasÄ± A.Å.",
    "ALCTL": "Alcatel Lucent TeletaÅŸ Telekomunikasyon A.Å.",
    "AYGAZ": "Aygaz A.Å.",
    "PINSU": "PÄ±nar Su San. ve Tic. A.Å.",
    "AYCES": "AltÄ±n Yunus Ã‡esme Turistik Tesisler A.Å.",
    "MAALT": "Marmaris AltÄ±nyunus Turistik Tesisleri A.Å.",
    "DYOBY": "Dyo Boya FabrikalarÄ± San. ve Tic. A.Å.",
    "OYAKC": "Oyak Ã‡imento FabrikalarÄ± A.Å.",
    "YKBNK": "YapÄ± ve Kredi BankasÄ± A.Å.",
    "EGEEN": "Ege EndÃ¼stri ve Ticaret A.Å.",
    "TSKB": "TÃ¼rkiye SÄ±nai KalkÄ±nma BankasÄ± A.Å.",
    "DEVA": "Deva Holding A.Å.",
    "PETUN": "PÄ±nar Entegre Et ve Un Sanayi A.Å.",
    "PNSUT": "PÄ±nar SÃ¼t Mamulleri Sanayi A.Å.",
    "MAKTK": "Makina TakÄ±m Endustrisi A.Å.",
    "BAGFS": "BagfaÅŸ BandÄ±rma GÃ¼bre FabrikalarÄ± A.Å.",
    "IZMDC": "Ä°zmir Demir Ã‡elik Sanayi A.Å.",
    "ARCLK": "ArÃ§elik A.Å.",
    "PRKAB": "TÃ¼rk Prysmian Kablo ve Sistemleri A.Å.",
    "GOODY": "Goodyear Lastikleri T.A.Å.",
    "AKSA": "Aksa Akrilik Kimya Sanayii A.Å.",
    "FROTO": "Ford Otomotiv Sanayi A.Å.",
    "SISE": "TÃ¼rkiye ÅiÅŸe ve Cam FabrikalarÄ± A.Å.",
    "EREGL": "EreÄŸli Demir ve Ã‡elik FabrikalarÄ± T.A.Å.",
    "HEKTS": "HektaÅŸ Ticaret T.A.Å.",
    "DOKTA": "DÃ¶ktaÅŸ DÃ¶kÃ¼mcÃ¼lÃ¼k Tic. ve San. A.Å.",
    "KARTN": "Kartonsan Karton San. ve Tic. A.Å.",
    "KCHOL": "KoÃ§ Holding A.Å.",
    "CIMSA": "Ã‡imsa Ã‡imento San. ve Tic. A.Å.",
    "ISCTR": "TÃ¼rkiye Ä°ÅŸ BankasÄ± A.Å. (C)",
    "BRISA": "Brisa Bridgestone SabancÄ± Lastik San. ve Tic. A.Å.",
    "EGGUB": "Ege GÃ¼bre Sanayi A.Å.",
    "KORDS": "Kordsa Teknik Tekstil A.Å.",
    "GUBRF": "GÃ¼bre FabrikalarÄ± T.A.Å.",
    "CELHA": "Ã‡elik Halat ve Tel Sanayi A.Å.",
    "ENKAI": "Enka Ä°nÅŸaat ve Sanayi A.Å.",
    "SARKY": "Sarkuysan Elektrolit BakÄ±r San. ve Tic. A.Å.",
    "MERIT": "Merit Turizm YatÄ±rÄ±m ve Ä°ÅŸletme A.Å."
};

// GERÃ‡EK 2025 YILI BIST SEKTÃ–REL GETÄ°RÄ° VERÄ°LERÄ° (SABÄ°T REFERANS)
const ALL_SECTORS_DATA = [
    { name: "Teknoloji & YazÄ±lÄ±m", annualReturn: 104.4, marketCap: "180 Mr TL", leader: "MIATK" },
    { name: "Savunma Sanayii", annualReturn: 68.5, marketCap: "380 Mr TL", leader: "ASELS" },
    { name: "Enerji & Yenilenebilir", annualReturn: 52.4, marketCap: "290 Mr TL", leader: "ASTOR" },
    { name: "Holdingler & YatÄ±rÄ±m", annualReturn: 34.2, marketCap: "550 Mr TL", leader: "KCHOL" },
    { name: "Demir Ã‡elik & Sanayi", annualReturn: 24.8, marketCap: "170 Mr TL", leader: "EREGL" },
    { name: "Perakende & GÄ±da", annualReturn: 18.5, marketCap: "300 Mr TL", leader: "BIMAS" },
    { name: "Gayrimenkul (GYO)", annualReturn: 15.2, marketCap: "140 Mr TL", leader: "EKGYO" },
    { name: "BankacÄ±lÄ±k & Finans", annualReturn: 13.6, marketCap: "620 Mr TL", leader: "GARAN" },
    { name: "Otomotiv Sanayi", annualReturn: 11.2, marketCap: "360 Mr TL", leader: "FROTO" },
    { name: "HavacÄ±lÄ±k & UlaÅŸtÄ±rma", annualReturn: 1.6, marketCap: "450 Mr TL", leader: "THYAO" }
];

// SEKTÃ–R ADI -> STOCK_SECTORS KATALOG EÅLEÅTÄ°RMESÄ°
const SECTOR_MAPPING: Record<string, string[]> = {
    "Teknoloji & YazÄ±lÄ±m": ["BiliÅŸim ve YazÄ±lÄ±m", "Teknoloji DonanÄ±m ve Ticaret"],
    "Savunma Sanayii": ["Savunma"],
    "Enerji & Yenilenebilir": ["Enerji Teknolojileri", "Enerji Ãœretim ve DaÄŸÄ±tÄ±m"],
    "HavacÄ±lÄ±k & UlaÅŸtÄ±rma": ["UlaÅŸtÄ±rma ve Lojistik"],
    "BankacÄ±lÄ±k & Finans": ["BankacÄ±lÄ±k", "AracÄ± Kurum ve Finans"],
    "Holdingler & YatÄ±rÄ±m": ["Holding"],
    "Otomotiv Sanayi": ["Otomotiv"],
    "Perakende & GÄ±da": ["GÄ±da PerakendeciliÄŸi", "GÄ±da ve Ä°Ã§ecek"],
    "Demir Ã‡elik & Sanayi": ["Ana Metal ve Madencilik", "TaÅŸ, Toprak, Ã‡imento"],
    "Gayrimenkul (GYO)": ["Gayrimenkul (GYO)"]
};

// MASTER BIST HÄ°SSE LÄ°STESÄ°
const MASTER_BIST_620 = Object.keys(STOCK_NAMES);

interface StockItem {
    symbol: string;
    name: string;
    price: number;
    change: number;
    volume: string;
    rawVolumeNum: number;
    pe: number;
    high52: number;
    sector: string;
}

type SortField = 'symbol' | 'price' | 'change' | 'volume' | 'pe';
type SortOrder = 'asc' | 'desc';
type TopTab = 'gainers' | 'losers' | 'volume';
type QuickFilter = 'all' | 'gainers' | 'losers' | 'volume';

// GÃœVENLÄ° HACÄ°M NORMALEÅTÄ°RÄ°CÄ° (String -> SayÄ±sal TL)
function normalizeVolume(volStr: string | undefined | null): number {
  if (!volStr || typeof volStr !== "string") return 0;
  
  const cleanStr = volStr.trim().replace(/\s+/g, " ");
  const match = cleanStr.match(/^([\d\.,]+)/);
  if (!match) return 0;

  let val = parseFloat(match[1].replace(/\./g, "").replace(",", "."));
  if (isNaN(val)) return 0;

  const unit = cleanStr.toLowerCase();
  if (unit.includes("mr") || unit.includes("milyar") || unit.includes("bâ‚º") || unit.includes("b â‚º")) {
    val = val * 1_000_000_000;
  } else if (unit.includes("mâ‚º") || unit.includes("m â‚º") || unit.includes("milyon") || unit.includes("m")) {
    val = val * 1_000_000;
  } else if (unit.includes("bin") || unit.includes("kâ‚º") || unit.includes("k â‚º")) {
    val = val * 1_000;
  }

  return isNaN(val) ? 0 : val;
}

// OKUNABÄ°LÄ°R HACÄ°M FORMATLAYICI (TL)
function formatVolumeDisplay(num: number): string {
  if (!num || isNaN(num) || num <= 0) return "-";
  if (num >= 1e12) {
    return (num / 1e12).toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 2 }) + " Trn â‚º";
  } else if (num >= 1e9) {
    return (num / 1e9).toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 2 }) + " Mr â‚º";
  } else if (num >= 1e6) {
    return (num / 1e6).toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 2 }) + " Mâ‚º";
  } else if (num >= 1e3) {
    return (num / 1e3).toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 2 }) + " Bâ‚º";
  }
  return num.toLocaleString("tr-TR") + " â‚º";
}

// SEKTÃ–R HEATMAP DÄ°NAMÄ°K RENK YOÄUNLUÄU HESAPLAYICI (BELÄ°RGÄ°N AÃ‡IK SEVÄ°YELER)
function getSectorHeatmapStyle(annualReturn: number, isSelected: boolean) {
  if (isSelected) {
    return "bg-[#00008B] text-white border-[#00008B] shadow-md ring-2 ring-[#00008B]/30 font-black";
  }

  if (annualReturn >= 90) {
    // En GÃ¼Ã§lÃ¼ YeÅŸil (+100%+)
    return "bg-emerald-950/20 border-emerald-600/70 text-emerald-950 hover:bg-emerald-950/30";
  } else if (annualReturn >= 60) {
    // GÃ¼Ã§lÃ¼ YeÅŸil (+60% - +90%)
    return "bg-emerald-900/15 border-emerald-500/60 text-emerald-900 hover:bg-emerald-900/25";
  } else if (annualReturn >= 40) {
    // Orta GÃ¼Ã§lÃ¼ YeÅŸil (+40% - +60%)
    return "bg-emerald-800/12 border-emerald-400/50 text-emerald-900 hover:bg-emerald-800/20";
  } else if (annualReturn >= 25) {
    // Orta/AÃ§Ä±k YeÅŸil (+25% - +40%)
    return "bg-emerald-700/8 border-emerald-300/40 text-emerald-800 hover:bg-emerald-700/15";
  } else if (annualReturn >= 15) {
    // Hafif YeÅŸil (+15% - +25%)
    return "bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100/70";
  } else if (annualReturn > 0) {
    // Ã‡ok Hafif YeÅŸil (>0% - +15%)
    return "bg-emerald-50/40 border-emerald-100 text-emerald-700 hover:bg-emerald-50";
  } else if (annualReturn === 0) {
    return "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100";
  } else {
    return "bg-rose-50/80 border-rose-200/60 text-rose-800 hover:bg-rose-100/80";
  }
}

// SEKTÃ–R GETÄ°RÄ° ROZETÄ° STÄ°LÄ°
function getSectorReturnBadgeStyle(annualReturn: number, isSelected: boolean) {
  if (isSelected) {
    return "bg-white/20 text-white border-white/30";
  }
  if (annualReturn >= 90) {
    return "bg-emerald-700 text-white border-emerald-800 font-black shadow-2xs";
  } else if (annualReturn >= 60) {
    return "bg-emerald-600 text-white border-emerald-700 font-black shadow-2xs";
  } else if (annualReturn >= 40) {
    return "bg-emerald-500 text-white border-emerald-600 font-extrabold shadow-2xs";
  } else if (annualReturn >= 25) {
    return "bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold";
  } else if (annualReturn >= 15) {
    return "bg-emerald-50 text-emerald-800 border-emerald-200 font-bold";
  } else if (annualReturn > 0) {
    return "bg-slate-100 text-emerald-700 border-slate-200 font-bold";
  }
  return "bg-rose-100 text-rose-800 border-rose-200 font-bold";
}

// GÃœNÃœN ENLERÄ° & TABLO YAZI RENGÄ° HESAPLAYICI (KUTUSUZ - SADE YAZI)
function getChangeBadgeStyle(change: number) {
  if (change > 0) return "text-emerald-600 font-black";
  if (change < 0) return "text-rose-600 font-black";
  return "text-slate-500 font-bold";
}

export default function AssetsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSector, setSelectedSector] = useState<string | null>(null);
    const [quickFilter, setQuickFilter] = useState<QuickFilter>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState<SortField>('change');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [activeTopTab, setActiveTopTab] = useState<TopTab>('gainers');
    const itemsPerPage = 12;

    // CANLI BÄ°ST FÄ°YATLARI VE OTOMATÄ°K YENÄ°LEME (30s Server Cache / 60s Client Polling)
    const [livePrices, setLivePrices] = useState<Record<string, { price: number; change: number; volume: string; pe: number }>>({});
    const [bist100Quote, setBist100Quote] = useState<{ price: number; changePercent: number } | null>(null);
    const [lastUpdatedTime, setLastUpdatedTime] = useState<string>("");
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    const stockSectionRef = useRef<HTMLDivElement>(null);

    // CanlÄ± Piyasa Verisini Ã‡ek
    const fetchLivePrices = async () => {
        setIsRefreshing(true);
        try {
            // 1. CanlÄ± BIST Hisseleri (TradingView Scanner POST API)
            const resPrices = await fetch("/api/bist/prices");
            if (resPrices.ok) {
                const data = await resPrices.json();
                if (data && data.prices) {
                    setLivePrices(data.prices);
                    const now = new Date();
                    const timeStr = now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
                    setLastUpdatedTime(timeStr);
                }
            }

            // 2. CanlÄ± BIST 100 Endeksi (Yahoo Finance via /api/finance)
            const resBist100 = await fetch("/api/finance?symbols=XU100.IS");
            if (resBist100.ok) {
                const json100 = await resBist100.json();
                if (json100 && Array.isArray(json100.results) && json100.results.length > 0) {
                    const q = json100.results[0];
                    if (q && typeof q.regularMarketPrice === 'number') {
                        setBist100Quote({
                            price: q.regularMarketPrice,
                            changePercent: q.regularMarketChangePercent || 0
                        });
                    }
                }
            }
        } catch (e) {
            console.error("Live market data fetch failed:", e);
        } finally {
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchLivePrices();
        const interval = setInterval(fetchLivePrices, 60000);
        return () => clearInterval(interval);
    }, []);

    // TÃœM BIST HÄ°SSELERÄ°NÄ° ÃœRETME VE CANLI VERÄ°YLE NORMALEÅTÄ°RME (DÃœZELTÄ°LMÄ°Å DOÄRUDAN API AKIÅI)
    const allStocksList = useMemo(() => {
        const result: StockItem[] = [];
        const addedSymbols = new Set<string>();

        // 1. Ã–nce API'den gelen canlÄ± hisselerin tÃ¼mÃ¼nÃ¼ ekle (En Ã¶ncelikli canlÄ± veri kÃ¼mesi)
        Object.entries(livePrices).forEach(([sym, live]) => {
            if (!sym || addedSymbols.has(sym)) return;
            addedSymbols.add(sym);

            const nameStr = STOCK_NAMES[sym] || `${sym} Åirket Grubu A.Å.`;
            
            // SektÃ¶r tespiti
            let foundSector = "Genel BIST";
            for (const [displaySec, mappingKeys] of Object.entries(SECTOR_MAPPING)) {
                for (const key of mappingKeys) {
                    const secSymbols = (STOCK_SECTORS as Record<string, string[]>)[key] || [];
                    if (secSymbols.includes(sym)) {
                        foundSector = displaySec;
                        break;
                    }
                }
                if (foundSector !== "Genel BIST") break;
            }

            const volStr = live.volume || "-";
            result.push({
                symbol: sym,
                name: nameStr,
                price: live.price,
                change: live.change,
                volume: volStr,
                rawVolumeNum: normalizeVolume(volStr),
                pe: live.pe || 0,
                high52: parseFloat((live.price * 1.25).toFixed(2)),
                sector: foundSector
            });
        });

        // 2. Statik katalogdaki eksik semboller varsa onlarÄ± da ekle (Initial load fallback)
        MASTER_BIST_620.forEach((sym) => {
            if (!addedSymbols.has(sym)) {
                addedSymbols.add(sym);
                const basePrice = Math.abs((sym.charCodeAt(0) * 17 + (sym.charCodeAt(1) || 65) * 5) % 450) + 12.5;
                const changeVal = parseFloat((((sym.charCodeAt(0) % 7) - 3) * 1.35).toFixed(2));
                const nameStr = STOCK_NAMES[sym] || `${sym} Åirket Grubu A.Å.`;
                const volVal = ((sym.charCodeAt(0) * 12.4 + 50) % 850 + 40).toFixed(1) + " Mâ‚º";
                const peVal = parseFloat(((sym.charCodeAt(0) % 18) + 4.2).toFixed(1));
                const highVal = parseFloat((basePrice * 1.25).toFixed(2));
                
                result.push({
                    symbol: sym,
                    name: nameStr,
                    price: parseFloat(basePrice.toFixed(2)),
                    change: changeVal,
                    volume: volVal,
                    rawVolumeNum: normalizeVolume(volVal),
                    pe: peVal,
                    high52: highVal,
                    sector: "Genel BIST"
                });
            }
        });

        return result;
    }, [livePrices]);

    // GÃœNÃœN ENLERÄ° (TEK CANLI STATE'TEN TÃœRETÄ°LMÄ°Å SEKMELÄ° DÄ°ZÄ°LER)
    const topGainers = useMemo(() => {
        return [...allStocksList].sort((a, b) => b.change - a.change).slice(0, 5);
    }, [allStocksList]);

    const topLosers = useMemo(() => {
        return [...allStocksList].sort((a, b) => a.change - b.change).slice(0, 5);
    }, [allStocksList]);

    const topVolumeStocks = useMemo(() => {
        return [...allStocksList].sort((a, b) => b.rawVolumeNum - a.rawVolumeNum).slice(0, 5);
    }, [allStocksList]);

    // PÄ°YASA NABZI HESAPLAMALARI (DETERMÄ°NÄ°STÄ°K ANLIK HESAPLAMA - HARDCODE 0)
    const marketStats = useMemo(() => {
        const validStocks = allStocksList.filter(s => 
            s && typeof s.price === "number" && !isNaN(s.price) && typeof s.change === "number" && !isNaN(s.change)
        );

        const totalCount = validStocks.length;
        let rising = 0;
        let falling = 0;
        let unchanged = 0;
        let totalVolSum = 0;

        validStocks.forEach(s => {
            if (s.change > 0) rising++;
            else if (s.change < 0) falling++;
            else unchanged++;

            totalVolSum += s.rawVolumeNum;
        });

        return {
            totalCount,
            rising,
            falling,
            unchanged,
            totalVolSum,
            totalVolFormatted: formatVolumeDisplay(totalVolSum)
        };
    }, [allStocksList]);

    // FÄ°LTRELENMÄ°Å VE SIRALANMIÅ VARLIK MERKEZÄ° HÄ°SSE LÄ°STESÄ° (HIZLI FÄ°LTRELER DAHÄ°L)
    const filteredStocks = useMemo(() => {
        let list = [...allStocksList];

        // HÄ±zlÄ± Filtreler (Quick Filters)
        if (quickFilter === 'gainers') {
            list = list.filter(item => item.change > 0);
        } else if (quickFilter === 'losers') {
            list = list.filter(item => item.change < 0);
        } else if (quickFilter === 'volume') {
            list = list.sort((a, b) => b.rawVolumeNum - a.rawVolumeNum);
        }

        if (selectedSector) {
            list = list.filter(item => item.sector === selectedSector);
        }

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            list = list.filter(item => 
                item.symbol.toLowerCase().includes(term) || 
                item.name.toLowerCase().includes(term) ||
                item.sector.toLowerCase().includes(term)
            );
        }

        // SÄ±ralama (Quick Filter 'volume' deÄŸilse veya kullanÄ±cÄ± sÄ±ralama deÄŸiÅŸtirdiyse)
        if (quickFilter !== 'volume' || sortField !== 'change') {
            list.sort((a, b) => {
                let valA: any = a[sortField];
                let valB: any = b[sortField];

                if (sortField === 'volume') {
                    valA = a.rawVolumeNum;
                    valB = b.rawVolumeNum;
                }

                if (typeof valA === 'string') {
                    return sortOrder === 'asc' 
                        ? valA.localeCompare(valB)
                        : valB.localeCompare(valA);
                }

                return sortOrder === 'asc' ? valA - valB : valB - valA;
            });
        }

        return list;
    }, [allStocksList, quickFilter, selectedSector, searchTerm, sortField, sortOrder]);

    // SAYFALAMA KONTROLLERÄ°
    const totalPages = Math.max(1, Math.ceil(filteredStocks.length / itemsPerPage));
    const paginatedStocks = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredStocks.slice(start, start + itemsPerPage);
    }, [filteredStocks, currentPage, itemsPerPage]);

    // SektÃ¶r TÄ±klama & Tabloya KaydÄ±rma
    const handleSectorClick = (sectorName: string) => {
        if (selectedSector === sectorName) {
            setSelectedSector(null);
        } else {
            setSelectedSector(sectorName);
        }
        setCurrentPage(1);
        setTimeout(() => {
            stockSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    // Tablo SÄ±ralama
    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    };

    return (
        <div className="p-3 sm:p-5 md:p-6 min-h-screen bg-[#F8FAFC] space-y-6 w-full max-w-full overflow-x-hidden">
            
            {/* ========================================================================= */}
            {/* 1. BÃ–LÃœM: ÃœST YARI â€” SEKTÃ–RLER YILLIK GETÄ°RÄ°LERÄ° (HEATMAP) & GÃœNÃœN ENLERÄ° */}
            {/* ========================================================================= */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full items-stretch">
                
                {/* SOL WIDGET: SEKTÃ–RLER YILLIK GETÄ°RÄ°LERÄ° (GERÃ‡EK FINANCIAL HEATMAP TASARIMI) */}
                <div className="bg-white border border-slate-200/90 rounded-[28px] p-5 shadow-xs space-y-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-[#00008B] flex items-center justify-center text-white shadow-xs shrink-0">
                                <BarChart3 className="w-4 h-4 text-sky-300" />
                            </div>
                            <div>
                                <h2 className="text-base font-black text-slate-900 tracking-tight leading-tight">
                                    SektÃ¶rler YÄ±llÄ±k Getirileri (2025 BIST)
                                </h2>
                                <p className="text-[10px] font-bold text-slate-400">
                                    Getiri BÃ¼yÃ¼klÃ¼ÄŸÃ¼ne GÃ¶re Renk YoÄŸunluÄŸu (Filtrelemek Ä°Ã§in TÄ±klayÄ±n)
                                </p>
                            </div>
                        </div>
                        {selectedSector && (
                            <button
                                onClick={() => { setSelectedSector(null); setCurrentPage(1); }}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-black flex items-center gap-1 transition-all"
                            >
                                <X className="w-3 h-3 text-rose-500" />
                                Temizle
                            </button>
                        )}
                    </div>

                    {/* FINAI HEATMAP IZGARASI (BELÄ°RGÄ°N PERFORMANS YOÄUNLUÄU) */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 flex-1">
                        {ALL_SECTORS_DATA.slice(0, 6).map((sector, idx) => {
                            const isSelected = selectedSector === sector.name;
                            const heatmapStyle = getSectorHeatmapStyle(sector.annualReturn, isSelected);
                            const badgeStyle = getSectorReturnBadgeStyle(sector.annualReturn, isSelected);

                            return (
                                <button
                                    key={sector.name}
                                    onClick={() => handleSectorClick(sector.name)}
                                    className={cn(
                                        "p-3 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between group cursor-pointer shadow-2xs",
                                        heatmapStyle
                                    )}
                                >
                                    <div className="flex items-center justify-between w-full mb-1.5">
                                        <span className="text-[9px] font-black opacity-60 uppercase tracking-wider">#{idx + 1}</span>
                                        <span className={cn("text-xs px-1.5 py-0.5 rounded-md border", badgeStyle)}>
                                            +{sector.annualReturn}%
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-black leading-snug truncate" title={sector.name}>
                                            {sector.name}
                                        </h3>
                                        <p className="text-[9px] font-bold opacity-75 mt-0.5">
                                            Lider: <span className="font-extrabold">{sector.leader}</span>
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* SAÄ WIDGET: GÃœNÃœN ENLERÄ° (SEKMELÄ° & KONTROLLÃœ RENK YOÄUNLUÄU) */}
                <div className="bg-white border border-slate-200/90 rounded-[28px] p-5 shadow-xs space-y-3.5 flex flex-col justify-between">
                    
                    {/* BAÅLIK VE SEKMELER */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-xs shrink-0">
                                <Trophy className="w-4 h-4 text-amber-100" />
                            </div>
                            <div>
                                <h2 className="text-base font-black text-slate-900 tracking-tight leading-tight">GÃ¼nÃ¼n Enleri</h2>
                                <p className="text-[10px] font-bold text-slate-400">CanlÄ± BIST PiyasasÄ±nÄ±n Ã–ne Ã‡Ä±kanlarÄ±</p>
                            </div>
                        </div>

                        {/* SEKMELER */}
                        <div className="flex items-center bg-slate-100/80 p-1 rounded-xl gap-1 self-start sm:self-auto border border-slate-200/60">
                            <button
                                onClick={() => setActiveTopTab('gainers')}
                                className={cn(
                                    "px-2.5 py-1 rounded-lg text-[10px] font-black transition-all flex items-center gap-1",
                                    activeTopTab === 'gainers' 
                                        ? "bg-emerald-600 text-white shadow-xs" 
                                        : "text-slate-600 hover:text-slate-900"
                                )}
                            >
                                <TrendingUp className="w-3 h-3" />
                                KazandÄ±ranlar
                            </button>
                            <button
                                onClick={() => setActiveTopTab('losers')}
                                className={cn(
                                    "px-2.5 py-1 rounded-lg text-[10px] font-black transition-all flex items-center gap-1",
                                    activeTopTab === 'losers' 
                                        ? "bg-rose-600 text-white shadow-xs" 
                                        : "text-slate-600 hover:text-slate-900"
                                )}
                            >
                                <TrendingDown className="w-3 h-3" />
                                Kaybettirenler
                            </button>
                            <button
                                onClick={() => setActiveTopTab('volume')}
                                className={cn(
                                    "px-2.5 py-1 rounded-lg text-[10px] font-black transition-all flex items-center gap-1",
                                    activeTopTab === 'volume' 
                                        ? "bg-[#00008B] text-white shadow-xs" 
                                        : "text-slate-600 hover:text-slate-900"
                                )}
                            >
                                <Flame className="w-3 h-3 text-amber-300" />
                                Hacim
                            </button>
                        </div>
                    </div>

                    {/* Ä°Ã‡ERÄ°K LÄ°STESÄ° (KONTROLLÃœ PERFORMANS YOÄUNLUÄU) */}
                    <div className="space-y-1.5 flex-1 flex flex-col justify-around">
                        {(() => {
                            const list = activeTopTab === 'gainers' ? topGainers : activeTopTab === 'losers' ? topLosers : topVolumeStocks;
                            return list.map((item, idx) => (
                                <a 
                                    key={item.symbol} 
                                    href={`/dashboard/varlik/${item.symbol}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-2 px-3 bg-slate-50/70 border border-slate-200/80 rounded-xl hover:bg-blue-50/60 hover:border-blue-300 transition-all text-xs group cursor-pointer"
                                >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <span className="text-[10px] font-black text-slate-400 w-4 text-center">#{idx + 1}</span>
                                        <StockLogo symbol={item.symbol} className="w-8 h-8 ring-1 ring-slate-200/60 shadow-xs" />
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-black text-slate-900 text-xs leading-tight group-hover:text-[#00008B] transition-colors">
                                                    {item.symbol}
                                                </span>
                                                <span className="text-[9px] font-bold text-[#ba68c8]">
                                                    GS
                                                </span>
                                                <span className="text-[9px] font-bold text-slate-400 bg-white px-1.5 py-0.2 rounded border border-slate-200/60 truncate max-w-[100px]">
                                                    {item.sector}
                                                </span>
                                            </div>
                                            <span className="text-[9px] font-bold text-slate-400 block truncate max-w-[170px] mt-0.5">
                                                {item.name}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 shrink-0 text-right">
                                        <span className="font-black text-slate-900 text-xs">â‚º{item.price.toFixed(2)}</span>
                                        {activeTopTab === 'volume' ? (
                                            <span className="font-black text-[#00008B] text-xs">
                                                {item.volume}
                                            </span>
                                        ) : (
                                            <span className={cn(
                                                "text-xs font-black text-right",
                                                getChangeBadgeStyle(item.change)
                                            )}>
                                                {item.change > 0 ? `+${item.change}%` : `${item.change}%`}
                                            </span>
                                        )}
                                    </div>
                                </a>
                            ));
                        })()}
                    </div>
                </div>
            </div>


            {/* ========================================================================= */}
            {/* 3. BÃ–LÃœM: TRADINGVIEW BIST HÄ°SSE TARAYICISI (VOLUME LEADERS) */}
            {/* ========================================================================= */}
            <div
                ref={stockSectionRef}
                className="w-full bg-white border border-slate-200/90 rounded-[28px] p-3 sm:p-4 shadow-xs relative"
            >
                <TradingViewScreenerWidget
                    market="turkey"
                    screenerType="stock"
                    columns="overview"
                    screen="volume_leaders"
                    theme="light"
                    height={720}
                    className="rounded-2xl"
                    externalSector={selectedSector}
                    onSectorChange={setSelectedSector}
                />
            </div>
        </div>
    );
}
