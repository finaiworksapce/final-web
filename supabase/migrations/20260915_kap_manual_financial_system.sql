-- ==============================================================================
-- FİNAİ MANUEL KAP FİNANSAL RAPOR / BİLANÇO SİSTEMİ — FAZ 1 DDL MİGRATİON
-- Migration: 20260915_kap_manual_financial_system.sql
-- ==============================================================================

BEGIN;

-- ==============================================================================
-- 1. KONTROLLÜ TİP / ENUM TANIMLARI
-- ==============================================================================

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'financial_statement_type') THEN
        CREATE TYPE public.financial_statement_type AS ENUM (
            'BALANCE_SHEET',
            'INCOME_STATEMENT',
            'COMPREHENSIVE_INCOME',
            'CASH_FLOW',
            'EQUITY_CHANGES',
            'OTHER'
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'financial_period_nature') THEN
        CREATE TYPE public.financial_period_nature AS ENUM (
            'POINT_IN_TIME',
            'DISCRETE_QUARTER',
            'CUMULATIVE_INTERIM',
            'ANNUAL',
            'COMPARATIVE',
            'UNKNOWN'
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'financial_report_type') THEN
        CREATE TYPE public.financial_report_type AS ENUM (
            'ANNUAL',
            'INTERIM',
            'SPECIAL'
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'financial_audit_status') THEN
        CREATE TYPE public.financial_audit_status AS ENUM (
            'AUDITED',
            'LIMITED_REVIEW',
            'UNAUDITED'
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'financial_verification_status') THEN
        CREATE TYPE public.financial_verification_status AS ENUM (
            'PENDING',
            'VERIFIED',
            'WARNING',
            'REJECTED'
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'financial_mapping_method') THEN
        CREATE TYPE public.financial_mapping_method AS ENUM (
            'MANUAL',
            'RULE',
            'AI',
            'VERIFIED',
            'UNKNOWN'
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'financial_audit_event_type') THEN
        CREATE TYPE public.financial_audit_event_type AS ENUM (
            'PDF_RECEIVED',
            'HASH_CHECKED',
            'REPORT_CREATED',
            'TABLE_EXTRACTED',
            'COLUMN_DETECTED',
            'ROW_EXTRACTED',
            'VALUE_EXTRACTED',
            'ITEM_MAPPED',
            'VALIDATION_STARTED',
            'VALIDATION_FAILED',
            'VALIDATION_PASSED',
            'SNAPSHOT_CREATED',
            'RESTATEMENT_CREATED',
            'QUARANTINED',
            'GENERAL_AUDIT'
        );
    END IF;
END $$;

-- ==============================================================================
-- 2. FINANCIAL REPORTS (Master Rapor Kimliği & Versiyonlama)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.financial_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_slug VARCHAR(128) NOT NULL UNIQUE,
    symbol VARCHAR(16) NOT NULL REFERENCES public.symbol_mappings(finai_symbol) ON DELETE RESTRICT,
    finai_symbol VARCHAR(16) NOT NULL REFERENCES public.symbol_mappings(finai_symbol) ON DELETE RESTRICT,
    company_name VARCHAR(255) NOT NULL,
    
    -- Dönem ve Zaman Semantiği
    fiscal_year INT NOT NULL,
    fiscal_quarter INT NOT NULL, -- 1, 2, 3, 4
    reporting_period_start DATE NOT NULL,
    reporting_period_end DATE NOT NULL,
    report_date DATE NOT NULL,
    publication_date DATE,
    
    -- Yapısal Özellikler
    consolidation_type VARCHAR(32) NOT NULL DEFAULT 'CONSOLIDATED', -- 'CONSOLIDATED' | 'STANDALONE'
    statement_currency VARCHAR(16) NOT NULL DEFAULT 'TRY',
    currency VARCHAR(16) NOT NULL DEFAULT 'TRY',
    default_scale VARCHAR(16) NOT NULL DEFAULT 'MILLION',           -- 'EXACT' | 'THOUSAND' | 'MILLION' | 'BILLION'
    scale_multiplier NUMERIC(16, 4) NOT NULL DEFAULT 1000000.0000,
    report_type VARCHAR(32) NOT NULL DEFAULT 'INTERIM',             -- 'ANNUAL' | 'INTERIM' | 'SPECIAL'
    audit_status VARCHAR(32) NOT NULL DEFAULT 'LIMITED_REVIEW',     -- 'AUDITED' | 'LIMITED_REVIEW' | 'UNAUDITED'
    source VARCHAR(64) NOT NULL DEFAULT 'KAP_MANUAL',
    
    -- Dosya ve Parmak İzi (Provenance)
    source_document_name VARCHAR(255) NOT NULL,
    source_document_hash_sha256 VARCHAR(64) NOT NULL,
    storage_bucket VARCHAR(64) NOT NULL DEFAULT 'financial-reports',
    storage_path TEXT NOT NULL,
    
    -- Restatement & Versiyon Yönetimi
    version INT NOT NULL DEFAULT 1,
    is_current BOOLEAN NOT NULL DEFAULT TRUE,
    is_restatement BOOLEAN NOT NULL DEFAULT FALSE,
    supersedes_report_id UUID REFERENCES public.financial_reports(id) ON DELETE SET NULL,
    verification_status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    verification_notes TEXT,
    uploaded_by VARCHAR(64) DEFAULT 'MANUAL_ADMIN',
    metadata JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_fin_reports_period UNIQUE (
        symbol, fiscal_year, fiscal_quarter, consolidation_type, report_type, version
    ),
    CONSTRAINT uq_fin_reports_hash UNIQUE (source_document_hash_sha256)
);

CREATE INDEX IF NOT EXISTS idx_fin_reports_lookup 
ON public.financial_reports (symbol, fiscal_year DESC, fiscal_quarter DESC, is_current);

CREATE INDEX IF NOT EXISTS idx_fin_reports_status 
ON public.financial_reports (verification_status, is_current);

-- ==============================================================================
-- 3. FINANCIAL REPORT TABLES (PDF İçi Tablo Metadata Katmanı)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.financial_report_tables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES public.financial_reports(id) ON DELETE CASCADE,
    statement_type VARCHAR(32) NOT NULL,
    table_name VARCHAR(255) NOT NULL,
    table_order INT NOT NULL DEFAULT 1,
    table_identifier VARCHAR(64) NOT NULL, -- Örn: TAB_BS_1, TAB_IS_1
    page_start INT NOT NULL,
    page_end INT NOT NULL,
    currency VARCHAR(16) DEFAULT 'TRY',
    scale_multiplier NUMERIC(16, 4) DEFAULT 1000000.0000,
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_report_table_order UNIQUE (report_id, table_order),
    CONSTRAINT uq_report_table_identifier UNIQUE (report_id, table_identifier)
);

CREATE INDEX IF NOT EXISTS idx_fin_report_tables_report 
ON public.financial_report_tables (report_id, statement_type);

-- ==============================================================================
-- 4. FINANCIAL REPORT COLUMNS (Tablolardaki Dönem Kolonları)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.financial_report_columns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_id UUID NOT NULL REFERENCES public.financial_report_tables(id) ON DELETE CASCADE,
    column_order INT NOT NULL,
    column_label VARCHAR(255) NOT NULL,       -- Örn: "1 Nisan - 30 Haziran 2026"
    raw_header_text VARCHAR(255) NOT NULL,    -- PDF'deki ham başlık
    period_start DATE,                        -- Bilanço için NULL olabilir
    period_end DATE NOT NULL,                 -- 2026-06-30 veya 2025-12-31
    duration_months INT NOT NULL DEFAULT 0,   -- 0: Bilanço, 3: 3A Çeyrek, 6: 6A Kümülatif, 12: 12A Yıllık
    period_type VARCHAR(32) NOT NULL DEFAULT 'POINT_IN_TIME',   -- 'POINT_IN_TIME' | 'DISCRETE_QUARTER' | 'CUMULATIVE_INTERIM' | 'ANNUAL' | 'COMPARATIVE'
    period_nature VARCHAR(32) NOT NULL DEFAULT 'POINT_IN_TIME', -- Alias / Tam eşdeğer alan
    is_comparative BOOLEAN NOT NULL DEFAULT FALSE,
    fiscal_year INT NOT NULL,
    fiscal_quarter INT NOT NULL,
    currency VARCHAR(16) NOT NULL DEFAULT 'TRY',
    scale VARCHAR(16) NOT NULL DEFAULT 'MILLION',
    scale_multiplier NUMERIC(16, 4) NOT NULL DEFAULT 1000000.0000,
    is_primary_target_period BOOLEAN NOT NULL DEFAULT TRUE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_table_column_order UNIQUE (table_id, column_order)
);

CREATE INDEX IF NOT EXISTS idx_fin_report_cols_table 
ON public.financial_report_columns (table_id, column_order);

CREATE INDEX IF NOT EXISTS idx_fin_report_cols_period 
ON public.financial_report_columns (period_end, period_type, duration_months);

-- ==============================================================================
-- 5. FINANCIAL ITEMS CATALOG (FinAi Standart Hesap Planı Sözlüğü)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.financial_items_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_code VARCHAR(64) NOT NULL,
    statement_type VARCHAR(32) NOT NULL,
    canonical_name VARCHAR(255) NOT NULL,
    name_tr VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    parent_item_id UUID REFERENCES public.financial_items_catalog(id) ON DELETE SET NULL,
    sign_convention INT NOT NULL DEFAULT 1,      -- +1: Pozitif bakiye, -1: Gider/azalış
    unit_type VARCHAR(16) NOT NULL DEFAULT 'CURRENCY', -- 'CURRENCY' | 'SHARES' | 'RATIO' | 'PERCENT'
    is_mandatory_summary BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INT NOT NULL DEFAULT 100,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_catalog_statement_item_code UNIQUE (statement_type, item_code)
);

CREATE INDEX IF NOT EXISTS idx_catalog_statement_category 
ON public.financial_items_catalog (statement_type, category, display_order);

-- ==============================================================================
-- 6. FINANCIAL ITEM MAPPINGS (PDF Metin Eşleme Sözlüğü)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.financial_item_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    statement_type VARCHAR(32) NOT NULL,
    raw_label VARCHAR(255) NOT NULL,
    normalized_label VARCHAR(255) NOT NULL,
    canonical_item_id UUID NOT NULL REFERENCES public.financial_items_catalog(id) ON DELETE CASCADE,
    confidence NUMERIC(5, 2) NOT NULL DEFAULT 1.00,
    mapping_method VARCHAR(32) NOT NULL DEFAULT 'RULE', -- 'MANUAL' | 'RULE' | 'AI' | 'VERIFIED' | 'UNKNOWN'
    notes TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_mapping_label_statement UNIQUE (statement_type, normalized_label)
);

CREATE INDEX IF NOT EXISTS idx_mappings_lookup 
ON public.financial_item_mappings (statement_type, normalized_label);

-- ==============================================================================
-- 7. RAW DATA LAYER: FINANCIAL REPORT RAW ROWS & RAW VALUES
-- (2 Kademeli Mimari: Her satır ve her kolon değeri bağımsız, %100 kayıpsız arşiv)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.financial_report_raw_rows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES public.financial_reports(id) ON DELETE CASCADE,
    table_id UUID NOT NULL REFERENCES public.financial_report_tables(id) ON DELETE CASCADE,
    row_order INT NOT NULL,
    row_identifier VARCHAR(64) NOT NULL,
    raw_label VARCHAR(255) NOT NULL,
    normalized_label VARCHAR(255) NOT NULL,
    footnote_ref VARCHAR(32),
    pdf_page_number INT NOT NULL,
    indent_level INT NOT NULL DEFAULT 0,
    is_subtotal BOOLEAN NOT NULL DEFAULT FALSE,
    canonical_item_id UUID REFERENCES public.financial_items_catalog(id) ON DELETE SET NULL,
    mapping_status VARCHAR(32) NOT NULL DEFAULT 'UNMAPPED', -- 'MAPPED' | 'UNMAPPED' | 'AMBIGUOUS' | 'IGNORED'
    extraction_metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_raw_row_table_order UNIQUE (table_id, row_order)
);

CREATE INDEX IF NOT EXISTS idx_raw_rows_table 
ON public.financial_report_raw_rows (table_id, row_order);

CREATE INDEX IF NOT EXISTS idx_raw_rows_canonical 
ON public.financial_report_raw_rows (canonical_item_id);

CREATE TABLE IF NOT EXISTS public.financial_report_raw_values (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    row_id UUID NOT NULL REFERENCES public.financial_report_raw_rows(id) ON DELETE CASCADE,
    column_id UUID NOT NULL REFERENCES public.financial_report_columns(id) ON DELETE CASCADE,
    raw_text_value VARCHAR(64) NOT NULL,
    is_dash_or_zero BOOLEAN NOT NULL DEFAULT FALSE,
    is_empty_or_null BOOLEAN NOT NULL DEFAULT FALSE,
    parsed_numeric_value NUMERIC(24, 4),
    scaled_numeric_value NUMERIC(24, 4),
    currency VARCHAR(16) NOT NULL DEFAULT 'TRY',
    scale VARCHAR(16) NOT NULL DEFAULT 'MILLION',
    scale_multiplier NUMERIC(16, 4) NOT NULL DEFAULT 1000000.0000,
    sign_applied INT NOT NULL DEFAULT 1,
    footnote_override VARCHAR(32),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_raw_val_row_col UNIQUE (row_id, column_id)
);

CREATE INDEX IF NOT EXISTS idx_raw_values_row ON public.financial_report_raw_values (row_id);
CREATE INDEX IF NOT EXISTS idx_raw_values_col ON public.financial_report_raw_values (column_id);

-- Düz Sorgulama Görünümü (Unified View)
CREATE OR REPLACE VIEW public.financial_report_raw_items AS
SELECT
    v.id AS value_id,
    r.id AS row_id,
    r.report_id,
    r.table_id,
    v.column_id,
    r.row_order,
    c.column_order,
    t.statement_type,
    r.raw_label,
    r.normalized_label,
    c.column_label,
    c.period_type,
    c.period_nature,
    c.period_start,
    c.period_end,
    c.duration_months,
    v.raw_text_value,
    v.is_dash_or_zero,
    v.is_empty_or_null,
    v.parsed_numeric_value,
    v.scaled_numeric_value,
    v.currency,
    v.scale,
    v.scale_multiplier,
    COALESCE(v.footnote_override, r.footnote_ref) AS footnote_ref,
    r.pdf_page_number,
    r.indent_level,
    r.is_subtotal,
    r.canonical_item_id,
    cat.item_code AS canonical_item_code,
    r.mapping_status,
    r.created_at
FROM public.financial_report_raw_rows r
JOIN public.financial_report_raw_values v ON r.id = v.row_id
JOIN public.financial_report_columns c ON v.column_id = c.id
JOIN public.financial_report_tables t ON r.table_id = t.id
LEFT JOIN public.financial_items_catalog cat ON r.canonical_item_id = cat.id;

-- ==============================================================================
-- 8. FINANCIAL STATEMENT SNAPSHOTS (Varlık Sayfası, Rasyo & AI İçin Normalize Matris)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.financial_statement_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES public.financial_reports(id) ON DELETE CASCADE,
    symbol VARCHAR(16) NOT NULL REFERENCES public.symbol_mappings(finai_symbol),
    finai_symbol VARCHAR(16) NOT NULL REFERENCES public.symbol_mappings(finai_symbol),
    canonical_item_code VARCHAR(64) NOT NULL,
    canonical_item_id UUID REFERENCES public.financial_items_catalog(id) ON DELETE SET NULL,
    statement_type VARCHAR(32) NOT NULL,
    
    fiscal_year INT NOT NULL,
    fiscal_quarter INT NOT NULL,
    period_start DATE,
    period_end DATE NOT NULL,
    duration_months INT NOT NULL,
    period_type VARCHAR(32) NOT NULL,
    
    value NUMERIC(24, 4) NOT NULL,
    raw_value NUMERIC(24, 4),
    raw_text_value VARCHAR(64),
    currency VARCHAR(16) NOT NULL DEFAULT 'TRY',
    scale VARCHAR(16) NOT NULL DEFAULT 'MILLION',
    scale_multiplier NUMERIC(16, 4) NOT NULL DEFAULT 1000000.0000,
    
    source_raw_value_id UUID REFERENCES public.financial_report_raw_values(id) ON DELETE SET NULL,
    source_page INT,
    is_current BOOLEAN NOT NULL DEFAULT TRUE,
    version INT NOT NULL DEFAULT 1,
    verification_status VARCHAR(32) NOT NULL DEFAULT 'VERIFIED',
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_snapshots_item_period UNIQUE (
        symbol, fiscal_year, fiscal_quarter, statement_type, canonical_item_code, period_type, duration_months, version
    )
);

CREATE INDEX IF NOT EXISTS idx_snapshots_query 
ON public.financial_statement_snapshots (symbol, statement_type, period_end DESC, is_current);

CREATE INDEX IF NOT EXISTS idx_snapshots_item 
ON public.financial_statement_snapshots (symbol, canonical_item_code, fiscal_year DESC, fiscal_quarter DESC);

-- ==============================================================================
-- 9. FINANCIAL REPORT AUDIT LOGS (Doğrulama ve İşlem Tarihçesi)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.financial_report_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES public.financial_reports(id) ON DELETE CASCADE,
    symbol VARCHAR(16),
    event_type VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'INFO', -- 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_report 
ON public.financial_report_audit_logs (report_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_event 
ON public.financial_report_audit_logs (symbol, event_type, created_at DESC);

-- ==============================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLİTİKALARI
-- ==============================================================================

ALTER TABLE public.financial_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_report_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_report_columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_items_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_item_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_report_raw_rows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_report_raw_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_statement_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_report_audit_logs ENABLE ROW LEVEL SECURITY;

-- Okuma Politikaları:
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'financial_reports' AND policyname = 'Public read verified current reports') THEN
        CREATE POLICY "Public read verified current reports" ON public.financial_reports 
        FOR SELECT USING (is_current = true AND verification_status != 'REJECTED');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'financial_report_tables' AND policyname = 'Public read report tables') THEN
        CREATE POLICY "Public read report tables" ON public.financial_report_tables FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'financial_report_columns' AND policyname = 'Public read report columns') THEN
        CREATE POLICY "Public read report columns" ON public.financial_report_columns FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'financial_items_catalog' AND policyname = 'Public read items catalog') THEN
        CREATE POLICY "Public read items catalog" ON public.financial_items_catalog FOR SELECT USING (is_active = true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'financial_item_mappings' AND policyname = 'Public read item mappings') THEN
        CREATE POLICY "Public read item mappings" ON public.financial_item_mappings FOR SELECT USING (is_active = true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'financial_report_raw_rows' AND policyname = 'Public read raw rows') THEN
        CREATE POLICY "Public read raw rows" ON public.financial_report_raw_rows FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'financial_report_raw_values' AND policyname = 'Public read raw values') THEN
        CREATE POLICY "Public read raw values" ON public.financial_report_raw_values FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'financial_statement_snapshots' AND policyname = 'Public read verified snapshots') THEN
        CREATE POLICY "Public read verified snapshots" ON public.financial_statement_snapshots 
        FOR SELECT USING (is_current = true AND verification_status != 'REJECTED');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'financial_report_audit_logs' AND policyname = 'Public read audit logs') THEN
        CREATE POLICY "Public read audit logs" ON public.financial_report_audit_logs FOR SELECT USING (true);
    END IF;
END $$;

-- Backend / Service Role Full Access:
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'financial_reports' AND policyname = 'Service full access financial_reports') THEN
        CREATE POLICY "Service full access financial_reports" ON public.financial_reports FOR ALL USING (auth.role() = 'service_role' OR auth.role() IS NULL);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'financial_report_tables' AND policyname = 'Service full access financial_report_tables') THEN
        CREATE POLICY "Service full access financial_report_tables" ON public.financial_report_tables FOR ALL USING (auth.role() = 'service_role' OR auth.role() IS NULL);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'financial_report_columns' AND policyname = 'Service full access financial_report_columns') THEN
        CREATE POLICY "Service full access financial_report_columns" ON public.financial_report_columns FOR ALL USING (auth.role() = 'service_role' OR auth.role() IS NULL);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'financial_items_catalog' AND policyname = 'Service full access financial_items_catalog') THEN
        CREATE POLICY "Service full access financial_items_catalog" ON public.financial_items_catalog FOR ALL USING (auth.role() = 'service_role' OR auth.role() IS NULL);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'financial_item_mappings' AND policyname = 'Service full access financial_item_mappings') THEN
        CREATE POLICY "Service full access financial_item_mappings" ON public.financial_item_mappings FOR ALL USING (auth.role() = 'service_role' OR auth.role() IS NULL);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'financial_report_raw_rows' AND policyname = 'Service full access financial_report_raw_rows') THEN
        CREATE POLICY "Service full access financial_report_raw_rows" ON public.financial_report_raw_rows FOR ALL USING (auth.role() = 'service_role' OR auth.role() IS NULL);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'financial_report_raw_values' AND policyname = 'Service full access financial_report_raw_values') THEN
        CREATE POLICY "Service full access financial_report_raw_values" ON public.financial_report_raw_values FOR ALL USING (auth.role() = 'service_role' OR auth.role() IS NULL);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'financial_statement_snapshots' AND policyname = 'Service full access financial_statement_snapshots') THEN
        CREATE POLICY "Service full access financial_statement_snapshots" ON public.financial_statement_snapshots FOR ALL USING (auth.role() = 'service_role' OR auth.role() IS NULL);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'financial_report_audit_logs' AND policyname = 'Service full access financial_report_audit_logs') THEN
        CREATE POLICY "Service full access financial_report_audit_logs" ON public.financial_report_audit_logs FOR ALL USING (auth.role() = 'service_role' OR auth.role() IS NULL);
    END IF;
END $$;

-- ==============================================================================
-- 11. BAŞLANGIÇ ÇEKİRDEK HESAP PLANI (SEED DATA: financial_items_catalog)
-- ==============================================================================

INSERT INTO public.financial_items_catalog 
(statement_type, item_code, canonical_name, name_tr, name_en, category, sign_convention, unit_type, is_mandatory_summary, display_order, description)
VALUES
-- BİLANÇO (BALANCE SHEET) — AKTİF (VARLIKLAR)
('BALANCE_SHEET', 'TOTAL_ASSETS', 'Total Assets', 'Toplam Varlıklar', 'Total Assets', 'ASSETS_TOTAL', 1, 'CURRENCY', true, 1000, 'Dönen ve duran varlıkların toplamı'),
('BALANCE_SHEET', 'CURRENT_ASSETS', 'Current Assets', 'Dönen Varlıklar', 'Current Assets', 'CURRENT_ASSETS', 1, 'CURRENCY', true, 1100, 'Bir yıl içinde paraya çevrilmesi beklenen varlıklar'),
('BALANCE_SHEET', 'CASH_AND_EQUIVALENTS', 'Cash and Cash Equivalents', 'Nakit ve Nakit Benzerleri', 'Cash and Cash Equivalents', 'CURRENT_ASSETS', 1, 'CURRENCY', true, 1110, 'Kasa, banka ve likit hazır değerler'),
('BALANCE_SHEET', 'FINANCIAL_INVESTMENTS_SHORT_TERM', 'Short-Term Financial Investments', 'Finansal Yatırımlar (Kısa Vadeli)', 'Financial Investments', 'CURRENT_ASSETS', 1, 'CURRENCY', false, 1120, 'Kısa vadeli menkul kıymetler'),
('BALANCE_SHEET', 'TRADE_RECEIVABLES', 'Trade Receivables', 'Ticari Alacaklar', 'Trade Receivables', 'CURRENT_ASSETS', 1, 'CURRENCY', true, 1130, 'Müşterilerden olan ticari alacaklar'),
('BALANCE_SHEET', 'OTHER_RECEIVABLES_SHORT_TERM', 'Other Receivables (Short-Term)', 'Diğer Alacaklar (Kısa Vadeli)', 'Other Receivables', 'CURRENT_ASSETS', 1, 'CURRENCY', false, 1140, 'Ticari olmayan kısa vadeli alacaklar'),
('BALANCE_SHEET', 'INVENTORIES', 'Inventories', 'Stoklar', 'Inventories', 'CURRENT_ASSETS', 1, 'CURRENCY', true, 1150, 'İlk madde, malzeme, yarı mamul ve ticari mallar'),
('BALANCE_SHEET', 'PREPAID_EXPENSES_SHORT_TERM', 'Prepaid Expenses (Short-Term)', 'Peşin Ödenmiş Giderler (Kısa Vadeli)', 'Prepaid Expenses', 'CURRENT_ASSETS', 1, 'CURRENCY', false, 1160, 'Gelecek aylara ait giderler'),
('BALANCE_SHEET', 'OTHER_CURRENT_ASSETS', 'Other Current Assets', 'Diğer Dönen Varlıklar', 'Other Current Assets', 'CURRENT_ASSETS', 1, 'CURRENCY', false, 1170, 'Diğer kısa vadeli varlıklar'),

('BALANCE_SHEET', 'NON_CURRENT_ASSETS', 'Non-Current Assets', 'Duran Varlıklar', 'Non-Current Assets', 'NON_CURRENT_ASSETS', 1, 'CURRENCY', true, 1200, 'Bir yıldan uzun vadeli varlıklar'),
('BALANCE_SHEET', 'FINANCIAL_INVESTMENTS_LONG_TERM', 'Long-Term Financial Investments', 'Finansal Yatırımlar (Uzun Vadeli)', 'Long-Term Financial Investments', 'NON_CURRENT_ASSETS', 1, 'CURRENCY', false, 1210, 'İştirakler ve uzun vadeli menkul kıymetler'),
('BALANCE_SHEET', 'TRADE_RECEIVABLES_LONG_TERM', 'Trade Receivables (Long-Term)', 'Ticari Alacaklar (Uzun Vadeli)', 'Long-Term Trade Receivables', 'NON_CURRENT_ASSETS', 1, 'CURRENCY', false, 1220, 'Vadesi bir yılı aşan ticari alacaklar'),
('BALANCE_SHEET', 'PROPERTY_PLANT_EQUIPMENT', 'Property, Plant and Equipment', 'Maddi Duran Varlıklar', 'Property, Plant and Equipment', 'NON_CURRENT_ASSETS', 1, 'CURRENCY', true, 1230, 'Arazi, arsa, binalar, tesisler, uçaklar/taşıtlar ve makineler'),
('BALANCE_SHEET', 'RIGHT_OF_USE_ASSETS', 'Right-of-Use Assets', 'Kullanım Hakkı Varlıkları', 'Right-of-Use Assets', 'NON_CURRENT_ASSETS', 1, 'CURRENCY', false, 1240, 'TFRS 16 kapsamındaki kiralama varlıkları'),
('BALANCE_SHEET', 'INTANGIBLE_ASSETS', 'Intangible Assets', 'Maddi Olmayan Duran Varlıklar', 'Intangible Assets', 'NON_CURRENT_ASSETS', 1, 'CURRENCY', false, 1250, 'Haklar, şerefiye ve yazılımlar'),
('BALANCE_SHEET', 'DEFERRED_TAX_ASSETS', 'Deferred Tax Assets', 'Ertelenmiş Vergi Varlığı', 'Deferred Tax Assets', 'NON_CURRENT_ASSETS', 1, 'CURRENCY', false, 1260, 'Gelecekte mahsup edilecek vergi varlığı'),
('BALANCE_SHEET', 'OTHER_NON_CURRENT_ASSETS', 'Other Non-Current Assets', 'Diğer Duran Varlıklar', 'Other Non-Current Assets', 'NON_CURRENT_ASSETS', 1, 'CURRENCY', false, 1270, 'Diğer uzun vadeli varlıklar'),

-- BİLANÇO — PASİF (YÜKÜMLÜLÜKLER & ÖZKAYNAKLAR)
('BALANCE_SHEET', 'TOTAL_LIABILITIES', 'Total Liabilities', 'Toplam Yükümlülükler', 'Total Liabilities', 'LIABILITIES_TOTAL', 1, 'CURRENCY', true, 2000, 'Kısa ve uzun vadeli borçların toplamı'),
('BALANCE_SHEET', 'SHORT_TERM_LIABILITIES', 'Current Liabilities', 'Kısa Vadeli Yükümlülükler', 'Current Liabilities', 'CURRENT_LIABILITIES', 1, 'CURRENCY', true, 2100, 'Bir yıl içinde ödenecek borçlar'),
('BALANCE_SHEET', 'SHORT_TERM_BORROWINGS', 'Short-Term Financial Borrowings', 'Kısa Vadeli Borçlanmalar', 'Short-Term Borrowings', 'CURRENT_LIABILITIES', 1, 'CURRENCY', true, 2110, 'Kısa vadeli banka kredileri ve finansal borçlar'),
('BALANCE_SHEET', 'SHORT_TERM_PORTION_LONG_TERM_BORROWINGS', 'Current Portion of Long-Term Borrowings', 'Uzun Vadeli Borçların Kısa Vadeli Kısımları', 'Current Portion of Long-Term Debt', 'CURRENT_LIABILITIES', 1, 'CURRENCY', true, 2120, 'Uzun vadeli kredilerin 1 yıl içindeki anapara geri ödemeleri'),
('BALANCE_SHEET', 'TRADE_PAYABLES', 'Trade Payables', 'Ticari Borçlar', 'Trade Payables', 'CURRENT_LIABILITIES', 1, 'CURRENCY', true, 2130, 'Tedarikçilere olan ticari borçlar'),
('BALANCE_SHEET', 'EMPLOYEE_BENEFIT_PAYABLES', 'Payables for Employee Benefits', 'Çalışanlara Sağlanan Faydalara Ait Borçlar', 'Employee Benefit Payables', 'CURRENT_LIABILITIES', 1, 'CURRENCY', false, 2140, 'Personele ödenecek ücret ve primler'),
('BALANCE_SHEET', 'OTHER_PAYABLES_SHORT_TERM', 'Other Payables (Short-Term)', 'Diğer Borçlar (Kısa Vadeli)', 'Other Payables', 'CURRENT_LIABILITIES', 1, 'CURRENCY', false, 2150, 'Ticari olmayan diğer kısa vadeli borçlar'),
('BALANCE_SHEET', 'DEFERRED_INCOME_SHORT_TERM', 'Deferred Income (Short-Term)', 'Ertelenmiş Gelirler (Kısa Vadeli)', 'Deferred Income', 'CURRENT_LIABILITIES', 1, 'CURRENCY', false, 2160, 'Gelecek aylara ait peşin tahsil edilen gelirler'),
('BALANCE_SHEET', 'CURRENT_TAX_LIABILITIES', 'Current Tax Liabilities', 'Dönem Kârı Vergi Yükümlülüğü', 'Current Tax Liabilities', 'CURRENT_LIABILITIES', 1, 'CURRENCY', false, 2170, 'Ödenecek kurumlar vergisi borcu'),
('BALANCE_SHEET', 'SHORT_TERM_PROVISIONS', 'Short-Term Provisions', 'Kısa Vadeli Karşılıklar', 'Short-Term Provisions', 'CURRENT_LIABILITIES', 1, 'CURRENCY', false, 2180, 'Dava ve kıdem tazminatı kısa vadeli karşılıkları'),

('BALANCE_SHEET', 'LONG_TERM_LIABILITIES', 'Non-Current Liabilities', 'Uzun Vadeli Yükümlülükler', 'Non-Current Liabilities', 'NON_CURRENT_LIABILITIES', 1, 'CURRENCY', true, 2200, 'Vadesi bir yılı aşan borçlar'),
('BALANCE_SHEET', 'LONG_TERM_BORROWINGS', 'Long-Term Financial Borrowings', 'Uzun Vadeli Borçlanmalar', 'Long-Term Borrowings', 'NON_CURRENT_LIABILITIES', 1, 'CURRENCY', true, 2210, 'Uzun vadeli banka kredileri, tahviller ve finansal kiralamalar'),
('BALANCE_SHEET', 'TRADE_PAYABLES_LONG_TERM', 'Trade Payables (Long-Term)', 'Ticari Borçlar (Uzun Vadeli)', 'Long-Term Trade Payables', 'NON_CURRENT_LIABILITIES', 1, 'CURRENCY', false, 2220, 'Uzun vadeli ticari borçlar'),
('BALANCE_SHEET', 'OTHER_PAYABLES_LONG_TERM', 'Other Payables (Long-Term)', 'Diğer Borçlar (Uzun Vadeli)', 'Other Long-Term Payables', 'NON_CURRENT_LIABILITIES', 1, 'CURRENCY', false, 2230, 'Diğer uzun vadeli borçlar'),
('BALANCE_SHEET', 'LONG_TERM_PROVISIONS', 'Long-Term Provisions', 'Uzun Vadeli Karşılıklar', 'Long-Term Provisions', 'NON_CURRENT_LIABILITIES', 1, 'CURRENCY', false, 2240, 'Kıdem tazminatı vb. uzun vadeli karşılıklar'),
('BALANCE_SHEET', 'DEFERRED_TAX_LIABILITIES', 'Deferred Tax Liabilities', 'Ertelenmiş Vergi Yükümlülüğü', 'Deferred Tax Liabilities', 'NON_CURRENT_LIABILITIES', 1, 'CURRENCY', false, 2250, 'Gelecekte ödenecek ertelenmiş vergi borcu'),

('BALANCE_SHEET', 'TOTAL_EQUITY', 'Total Equity', 'Toplam Özkaynaklar', 'Total Equity', 'EQUITY', 1, 'CURRENCY', true, 3000, 'Şirket ortaklarına ait net varlık tutarı'),
('BALANCE_SHEET', 'EQUITY_PARENT', 'Equity Attributable to Owners of Parent', 'Ana Ortaklığa Ait Özkaynaklar', 'Equity to Parent', 'EQUITY', 1, 'CURRENCY', true, 3100, 'Ana şirketin pay sahiplerine ait özkaynak payı'),
('BALANCE_SHEET', 'PAID_IN_CAPITAL', 'Paid-in Capital', 'Ödenmiş Sermaye', 'Paid-in Capital', 'EQUITY', 1, 'CURRENCY', true, 3110, 'Şirketin nominal tescilli sermayesi'),
('BALANCE_SHEET', 'CAPITAL_ADJUSTMENT_DIFFERENCES', 'Capital Adjustment Differences', 'Sermaye Düzeltme Farkları', 'Capital Adjustments', 'EQUITY', 1, 'CURRENCY', false, 3120, 'Enflasyon muhasebesi sermaye düzeltme farkları'),
('BALANCE_SHEET', 'SHARE_PREMIUMS', 'Share Premiums', 'Hisse Senedi İhraç Primleri', 'Share Premiums', 'EQUITY', 1, 'CURRENCY', false, 3130, 'Nominal değerin üzerinde ihraç edilen hisse primleri'),
('BALANCE_SHEET', 'OTHER_COMPREHENSIVE_INCOME_ACCUMULATED', 'Accumulated Other Comprehensive Income', 'Diğer Kapsamlı Gelir/Giderler', 'Other Comprehensive Income', 'EQUITY', 1, 'CURRENCY', false, 3140, 'Yeniden değerleme ve aktüeryal kâr/zarar fonları'),
('BALANCE_SHEET', 'RESTRICTED_RESERVES', 'Restricted Reserves', 'Kârdan Ayrılan Kısıtlanmış Yedekler', 'Restricted Reserves', 'EQUITY', 1, 'CURRENCY', false, 3150, 'Yasal ve statü yedekleri'),
('BALANCE_SHEET', 'RETAINED_EARNINGS', 'Retained Earnings', 'Geçmiş Yıllar Kârları/Zararları', 'Retained Earnings', 'EQUITY', 1, 'CURRENCY', true, 3160, 'Geçmiş dönemlerden biriken dağıtılmamış kârlar'),
('BALANCE_SHEET', 'NET_INCOME_PERIOD', 'Net Profit/Loss for the Period', 'Dönem Net Kârı/Zararı (Bilanço)', 'Net Income for Period', 'EQUITY', 1, 'CURRENCY', true, 3170, 'Cari dönemin özkaynaklara aktarılan net kârı'),
('BALANCE_SHEET', 'NON_CONTROLLING_INTERESTS', 'Non-Controlling Interests', 'Kontrol Gücü Olmayan Paylar', 'Non-Controlling Interests', 'EQUITY', 1, 'CURRENCY', true, 3200, 'Bağlı ortaklıklardaki azınlık payları'),

-- GELİR TABLOSU (INCOME STATEMENT)
('INCOME_STATEMENT', 'REVENUE', 'Revenue', 'Satış Gelirleri (Hasılat)', 'Revenue', 'OPERATING_REVENUE', 1, 'CURRENCY', true, 4000, 'Ana faaliyetlerden elde edilen satış hasılatı'),
('INCOME_STATEMENT', 'COST_OF_REVENUE', 'Cost of Sales', 'Satışların Maliyeti', 'Cost of Sales', 'OPERATING_COST', -1, 'CURRENCY', true, 4100, 'Satılan mal ve hizmetlerin üretim maliyeti'),
('INCOME_STATEMENT', 'GROSS_PROFIT', 'Gross Profit', 'Brüt Kâr / (Zarar)', 'Gross Profit', 'GROSS_PROFIT', 1, 'CURRENCY', true, 4200, 'Satış Gelirleri - Satışların Maliyeti'),
('INCOME_STATEMENT', 'MARKETING_EXPENSES', 'General Administrative and Marketing Expenses', 'Pazarlama, Satış ve Dağıtım Giderleri', 'Marketing Expenses', 'OPERATING_EXPENSES', -1, 'CURRENCY', false, 4310, 'Satış ve pazarlama harcamaları'),
('INCOME_STATEMENT', 'GENERAL_ADMIN_EXPENSES', 'General Administrative Expenses', 'Genel Yönetim Giderleri', 'General Administrative Expenses', 'OPERATING_EXPENSES', -1, 'CURRENCY', false, 4320, 'Yönetim ve merkez ofis giderleri'),
('INCOME_STATEMENT', 'RD_EXPENSES', 'Research and Development Expenses', 'Araştırma ve Geliştirme Giderleri', 'R&D Expenses', 'OPERATING_EXPENSES', -1, 'CURRENCY', false, 4330, 'Ar-Ge harcamaları'),
('INCOME_STATEMENT', 'OTHER_OPERATING_INCOME', 'Other Operating Income', 'Esas Faaliyetlerden Diğer Gelirler', 'Other Operating Income', 'OTHER_OPERATING', 1, 'CURRENCY', false, 4340, 'Vade farkı, kur farkı vb. esas faaliyet gelirleri'),
('INCOME_STATEMENT', 'OTHER_OPERATING_EXPENSES', 'Other Operating Expenses', 'Esas Faaliyetlerden Diğer Giderler', 'Other Operating Expenses', 'OTHER_OPERATING', -1, 'CURRENCY', false, 4350, 'Esas faaliyetlere ilişkin diğer giderler'),
('INCOME_STATEMENT', 'OPERATING_PROFIT', 'Operating Profit (EBIT)', 'Faaliyet Kârı / (Zararı)', 'Operating Profit', 'OPERATING_PROFIT', 1, 'CURRENCY', true, 4400, 'Brüt Kâr - Faaliyet Giderleri'),
('INCOME_STATEMENT', 'EBITDA', 'EBITDA', 'FAVÖK', 'EBITDA', 'CORE_METRIC', 1, 'CURRENCY', true, 4450, 'Faiz, Amortisman ve Vergi Öncesi Kâr'),
('INCOME_STATEMENT', 'INVESTMENT_ACTIVITY_INCOME', 'Income from Investing Activities', 'Yatırım Faaliyetlerinden Gelirler', 'Investing Income', 'INVESTING_RESULTS', 1, 'CURRENCY', false, 4510, 'Duran varlık satış kârı ve iştirak temettü gelirleri'),
('INCOME_STATEMENT', 'INVESTMENT_ACTIVITY_EXPENSE', 'Expenses from Investing Activities', 'Yatırım Faaliyetlerinden Giderler', 'Investing Expense', 'INVESTING_RESULTS', -1, 'CURRENCY', false, 4520, 'Yatırım faaliyetlerinden doğan zararlar'),
('INCOME_STATEMENT', 'FINANCIAL_INCOME', 'Financial Income', 'Finansman Gelirleri', 'Financial Income', 'FINANCIAL_RESULTS', 1, 'CURRENCY', false, 4610, 'Mevduat faizi ve kur kârları'),
('INCOME_STATEMENT', 'FINANCIAL_EXPENSE', 'Financial Expenses', 'Finansman Giderleri', 'Financial Expenses', 'FINANCIAL_RESULTS', -1, 'CURRENCY', false, 4620, 'Kredi faiz giderleri ve kur zararları'),
('INCOME_STATEMENT', 'PRETAX_INCOME', 'Profit Before Tax', 'Sürdürülen Faaliyetler Vergi Öncesi Kârı', 'Pre-Tax Income', 'PRETAX_PROFIT', 1, 'CURRENCY', true, 4700, 'Vergi matrahı öncesi dönem kârı'),
('INCOME_STATEMENT', 'TAX_EXPENSE', 'Tax Expense / Benefit', 'Dönem Vergi Gideri / (Geliri)', 'Tax Expense', 'TAXATION', -1, 'CURRENCY', true, 4800, 'Dönem kurumlar vergisi ve ertelenmiş vergi toplamı'),
('INCOME_STATEMENT', 'NET_INCOME', 'Net Profit / Loss for the Period', 'Dönem Net Kârı / (Zararı)', 'Net Income', 'NET_PROFIT', 1, 'CURRENCY', true, 4900, 'Vergi Sonrası Nihai Dönem Net Kârı'),
('INCOME_STATEMENT', 'NET_INCOME_PARENT', 'Net Profit Attributable to Parent Owners', 'Ana Ortaklık Payları Net Dönem Kârı', 'Net Income to Parent', 'NET_PROFIT', 1, 'CURRENCY', true, 4910, 'Ana şirketin payına düşen net dönem kârı'),
('INCOME_STATEMENT', 'NON_CONTROLLING_INCOME', 'Net Profit Attributable to Non-Controlling', 'Kontrol Gücü Olmayan Paylar Kârı', 'Non-Controlling Income', 'NET_PROFIT', 1, 'CURRENCY', false, 4920, 'Azınlık payına düşen net kâr/zarar'),
('INCOME_STATEMENT', 'EPS_BASIC', 'Basic Earnings Per Share', 'Hisse Başına Kazanç (Temel)', 'Basic EPS', 'PER_SHARE', 1, 'RATIO', true, 4950, 'Hisse başına net kâr tutarı (TL)'),
('INCOME_STATEMENT', 'EPS_DILUTED', 'Diluted Earnings Per Share', 'Hisse Başına Kazanç (Seyreltilmiş)', 'Diluted EPS', 'PER_SHARE', 1, 'RATIO', false, 4960, 'Seyreltilmiş hisse başına kazanç (TL)'),

-- NAKİT AKIŞ TABLOSU (CASH FLOW STATEMENT)
('CASH_FLOW', 'OPERATING_CASH_FLOW', 'Cash Flows from Operating Activities', 'İşletme Faaliyetlerinden Nakit Akışları', 'Operating Cash Flow', 'CASH_OPERATING', 1, 'CURRENCY', true, 5000, 'İşletme faaliyetlerinden yaratılan net nakit'),
('CASH_FLOW', 'WORKING_CAPITAL_CHANGES', 'Changes in Working Capital', 'İşletme Sermayesindeki Değişimler', 'Working Capital Changes', 'CASH_OPERATING', 1, 'CURRENCY', false, 5100, 'Alacak, stok ve borçlardaki nakit etkisi'),
('CASH_FLOW', 'CAPITAL_EXPENDITURES', 'Capital Expenditures (CapEx)', 'Maddi ve Maddi Olmayan Duran Varlık Alımları', 'Capital Expenditures', 'CASH_INVESTING', -1, 'CURRENCY', true, 5210, 'Tesis, makine ve uçak yatırımları için ödenen nakit'),
('CASH_FLOW', 'INVESTING_CASH_FLOW', 'Cash Flows from Investing Activities', 'Yatırım Faaliyetlerinden Nakit Akışları', 'Investing Cash Flow', 'CASH_INVESTING', 1, 'CURRENCY', true, 5200, 'Yatırım amaçlı nakit giriş ve çıkışları'),
('CASH_FLOW', 'FINANCING_CASH_FLOW', 'Cash Flows from Financing Activities', 'Finansman Faaliyetlerinden Nakit Akışları', 'Financing Cash Flow', 'CASH_FINANCING', 1, 'CURRENCY', true, 5300, 'Kredi kullanımı, geri ödemeleri ve sermaye işlemleri'),
('CASH_FLOW', 'DIVIDENDS_PAID', 'Dividends Paid', 'Ödenen Temettüler', 'Dividends Paid', 'CASH_FINANCING', -1, 'CURRENCY', true, 5310, 'Ortaklara nakden dağıtılan kâr payı'),
('CASH_FLOW', 'NET_CHANGE_IN_CASH', 'Net Increase / Decrease in Cash and Equivalents', 'Nakit ve Nakit Benzerlerindeki Net Değişim', 'Net Change in Cash', 'CASH_TOTAL', 1, 'CURRENCY', true, 5400, 'Dönem içindeki hazır değer net nakit değişimi'),
('CASH_FLOW', 'FREE_CASH_FLOW', 'Free Cash Flow', 'Serbest Nakit Akışı', 'Free Cash Flow', 'CORE_METRIC', 1, 'CURRENCY', true, 5500, 'İşletme Nakit Akışı - CapEx')
ON CONFLICT (statement_type, item_code) DO NOTHING;

-- ==============================================================================
-- 12. BAŞLANGIÇ EŞLEME KURALLARI (SEED DATA: financial_item_mappings)
-- ==============================================================================

INSERT INTO public.financial_item_mappings 
(statement_type, raw_label, normalized_label, canonical_item_id, confidence, mapping_method)
SELECT 
    'INCOME_STATEMENT',
    s.raw_label,
    s.normalized_label,
    c.id,
    1.00,
    'RULE'
FROM (
    VALUES 
    ('Hasılat', 'hasılat', 'REVENUE'),
    ('Satış Gelirleri', 'satış gelirleri', 'REVENUE'),
    ('Satışların Maliyeti', 'satışların maliyeti', 'COST_OF_REVENUE'),
    ('Satışların Maliyeti (-)', 'satışların maliyeti (-)', 'COST_OF_REVENUE'),
    ('Brüt Kâr (Zarar)', 'brüt kâr (zarar)', 'GROSS_PROFIT'),
    ('Brüt Kar (Zarar)', 'brüt kar (zarar)', 'GROSS_PROFIT'),
    ('Esas Faaliyet Kârı (Zararı)', 'esas faaliyet kârı (zararı)', 'OPERATING_PROFIT'),
    ('Esas Faaliyet Karı (Zararı)', 'esas faaliyet karı (zararı)', 'OPERATING_PROFIT'),
    ('Faaliyet Kârı (Zararı)', 'faaliyet kârı (zararı)', 'OPERATING_PROFIT'),
    ('Dönem Kârı (Zararı)', 'dönem kârı (zararı)', 'NET_INCOME'),
    ('Dönem Net Kârı (Zararı)', 'dönem net kârı (zararı)', 'NET_INCOME'),
    ('Dönem Net Karı (Zararı)', 'dönem net karı (zararı)', 'NET_INCOME'),
    ('Ana Ortaklık Payları', 'ana ortaklık payları', 'NET_INCOME_PARENT'),
    ('Pay Başına Kazanç', 'pay başına kazanç', 'EPS_BASIC'),
    ('Hisse Başına Kazanç', 'hisse başına kazanç', 'EPS_BASIC')
) AS s(raw_label, normalized_label, item_code)
JOIN public.financial_items_catalog c ON c.statement_type = 'INCOME_STATEMENT' AND c.item_code = s.item_code
ON CONFLICT (statement_type, normalized_label) DO NOTHING;

INSERT INTO public.financial_item_mappings 
(statement_type, raw_label, normalized_label, canonical_item_id, confidence, mapping_method)
SELECT 
    'BALANCE_SHEET',
    s.raw_label,
    s.normalized_label,
    c.id,
    1.00,
    'RULE'
FROM (
    VALUES 
    ('TOPLAM VARLIKLAR', 'toplam varlıklar', 'TOTAL_ASSETS'),
    ('DÖNEN VARLIKLAR', 'dönen varlıklar', 'CURRENT_ASSETS'),
    ('DURAN VARLIKLAR', 'duran varlıklar', 'NON_CURRENT_ASSETS'),
    ('Nakit ve Nakit Benzerleri', 'nakit ve nakit benzerleri', 'CASH_AND_EQUIVALENTS'),
    ('Ticari Alacaklar', 'ticari alacaklar', 'TRADE_RECEIVABLES'),
    ('Stoklar', 'stoklar', 'INVENTORIES'),
    ('Maddi Duran Varlıklar', 'maddi duran varlıklar', 'PROPERTY_PLANT_EQUIPMENT'),
    ('Kullanım Hakkı Varlıkları', 'kullanım hakkı varlıkları', 'RIGHT_OF_USE_ASSETS'),
    ('TOPLAM YÜKÜMLÜLÜKLER', 'toplam yükümlülükler', 'TOTAL_LIABILITIES'),
    ('KISA VADELİ YÜKÜMLÜLÜKLER', 'kısa vadeli yükümlülükler', 'SHORT_TERM_LIABILITIES'),
    ('Kısa Vadeli Borçlanmalar', 'kısa vadeli borçlanmalar', 'SHORT_TERM_BORROWINGS'),
    ('Ticari Borçlar', 'ticari borçlar', 'TRADE_PAYABLES'),
    ('UZUN VADELİ YÜKÜMLÜLÜKLER', 'uzun vadeli yükümlülükler', 'LONG_TERM_LIABILITIES'),
    ('Uzun Vadeli Borçlanmalar', 'uzun vadeli borçlanmalar', 'LONG_TERM_BORROWINGS'),
    ('ÖZKAYNAKLAR', 'özkaynaklar', 'TOTAL_EQUITY'),
    ('TOPLAM ÖZKAYNAKLAR', 'toplam özkaynaklar', 'TOTAL_EQUITY'),
    ('Ana Ortaklığa Ait Özkaynaklar', 'ana ortaklığa ait özkaynaklar', 'EQUITY_PARENT'),
    ('Ödenmiş Sermaye', 'ödenmiş sermaye', 'PAID_IN_CAPITAL'),
    ('Geçmiş Yıllar Kârları/Zararları', 'geçmiş yıllar kârları/zararları', 'RETAINED_EARNINGS'),
    ('Dönem Net Kârı/Zararı', 'dönem net kârı/zararı', 'NET_INCOME_PERIOD')
) AS s(raw_label, normalized_label, item_code)
JOIN public.financial_items_catalog c ON c.statement_type = 'BALANCE_SHEET' AND c.item_code = s.item_code
ON CONFLICT (statement_type, normalized_label) DO NOTHING;

INSERT INTO public.financial_item_mappings 
(statement_type, raw_label, normalized_label, canonical_item_id, confidence, mapping_method)
SELECT 
    'CASH_FLOW',
    s.raw_label,
    s.normalized_label,
    c.id,
    1.00,
    'RULE'
FROM (
    VALUES 
    ('İşletme Faaliyetlerinden Nakit Akışları', 'işletme faaliyetlerinden nakit akışları', 'OPERATING_CASH_FLOW'),
    ('Yatırım Faaliyetlerinden Nakit Akışları', 'yatırım faaliyetlerinden nakit akışları', 'INVESTING_CASH_FLOW'),
    ('Finansman Faaliyetlerinden Nakit Akışları', 'finansman faaliyetlerinden nakit akışları', 'FINANCING_CASH_FLOW'),
    ('Maddi ve Maddi Olmayan Duran Varlık Alımları', 'maddi ve maddi olmayan duran varlık alımları', 'CAPITAL_EXPENDITURES'),
    ('Ödenen Temettüler', 'ödenen temettüler', 'DIVIDENDS_PAID'),
    ('Nakit ve Nakit Benzerlerindeki Net Artış (Azalış)', 'nakit ve nakit benzerlerindeki net artış (azalış)', 'NET_CHANGE_IN_CASH')
) AS s(raw_label, normalized_label, item_code)
JOIN public.financial_items_catalog c ON c.statement_type = 'CASH_FLOW' AND c.item_code = s.item_code
ON CONFLICT (statement_type, normalized_label) DO NOTHING;

COMMIT;
