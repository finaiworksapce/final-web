/**
 * Hisse sayfaları için editoryal SEO izin listesi.
 * Bir sembol ancak şirket kimliği ve sayfada anlamlı, doğrulanabilir içerik
 * bulunduğu kontrol edildikten sonra buraya eklenmelidir.
 */
export const SEO_PUBLIC_STOCK_SYMBOLS = [
  'AKBNK', 'ASELS', 'ASTOR', 'BIMAS', 'BIGEN', 'EREGL', 'FROTO', 'GARAN',
  'HEKTS', 'ISCTR', 'KCHOL', 'KARSN', 'MGROS', 'MIATK', 'PGSUS', 'SAHOL',
  'SASA', 'SISE', 'SOKM', 'TCELL', 'THYAO', 'TKFEN', 'TOASO', 'TTRAK',
  'TTKOM', 'TUPRS', 'YKBNK',
] as const;

export const SEO_PUBLIC_STOCK_SYMBOL_SET = new Set<string>(SEO_PUBLIC_STOCK_SYMBOLS);
