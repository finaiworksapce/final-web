-- ==============================================================================
-- FİNAİ MANUEL KAP FİNANSAL RAPOR SİSTEMİ — FAZ 7 LEGACY BACKUP MİGRATION
-- Migration: 20260916_phase7_legacy_backup.sql
-- ==============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS public.legacy_financial_statement_periods_backup (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol VARCHAR(32) NOT NULL,
    company_name VARCHAR(255),
    period_type VARCHAR(16) NOT NULL,
    period_start DATE,
    period_end DATE NOT NULL,
    fiscal_year INT NOT NULL,
    fiscal_quarter INT NOT NULL,
    report_date DATE,
    
    statement_type VARCHAR(32) NOT NULL DEFAULT 'CONSOLIDATED',
    consolidation_type VARCHAR(32) NOT NULL DEFAULT 'CONSOLIDATED',
    
    currency VARCHAR(16) NOT NULL DEFAULT 'TRY',
    source_currency VARCHAR(16) NOT NULL DEFAULT 'TRY',
    reported_currency VARCHAR(16),
    unit VARCHAR(16) DEFAULT 'EXACT',
    
    source VARCHAR(64) NOT NULL,
    source_url TEXT,
    
    validation_status VARCHAR(16) NOT NULL DEFAULT 'VALID',
    quality_score INT DEFAULT 100,
    is_restated BOOLEAN DEFAULT FALSE,
    is_current BOOLEAN DEFAULT TRUE,
    version INT DEFAULT 1,
    
    revenue NUMERIC(24, 4),
    cost_of_revenue NUMERIC(24, 4),
    gross_profit NUMERIC(24, 4),
    operating_income NUMERIC(24, 4),
    ebitda NUMERIC(24, 4),
    pretax_income NUMERIC(24, 4),
    tax_expense NUMERIC(24, 4),
    net_income NUMERIC(24, 4),
    net_income_to_parent NUMERIC(24, 4),
    
    cash_and_equivalents NUMERIC(24, 4),
    total_current_assets NUMERIC(24, 4),
    total_assets NUMERIC(24, 4),
    current_liabilities NUMERIC(24, 4),
    total_liabilities NUMERIC(24, 4),
    total_equity NUMERIC(24, 4),
    parent_equity NUMERIC(24, 4),
    financial_debt NUMERIC(24, 4),
    net_debt NUMERIC(24, 4),
    
    operating_cash_flow NUMERIC(24, 4),
    investing_cash_flow NUMERIC(24, 4),
    financing_cash_flow NUMERIC(24, 4),
    capital_expenditures NUMERIC(24, 4),
    free_cash_flow NUMERIC(24, 4),
    dividends_paid NUMERIC(24, 4),
    net_change_in_cash NUMERIC(24, 4),
    
    weighted_average_shares NUMERIC(20, 2),
    diluted_weighted_average_shares NUMERIC(20, 2),
    total_shares NUMERIC(20, 2),
    circulating_shares NUMERIC(20, 2),
    free_float_shares NUMERIC(20, 2),
    eps NUMERIC(16, 4),
    diluted_eps NUMERIC(16, 4),
    bvps NUMERIC(16, 4),
    paid_in_capital NUMERIC(24, 4),
    
    income_statement_details JSONB,
    balance_sheet_details JSONB,
    cash_flow_details JSONB,
    per_share_details JSONB,
    
    fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_legacy_fsp_backup_symbol ON public.legacy_financial_statement_periods_backup (symbol, period_end DESC);

COMMIT;
