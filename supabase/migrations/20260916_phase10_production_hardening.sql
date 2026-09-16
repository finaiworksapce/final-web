-- ==============================================================================
-- FİNAİ MANUEL KAP FİNANSAL RAPOR SİSTEMİ — FAZ 10 PRODUCTION HARDENING MIGRATION
-- Migration: 20260916_phase10_production_hardening.sql
-- ==============================================================================

BEGIN;

-- 1. Tek Aktif Versiyon Kısıtı (At most 1 current report per symbol & logical period)
CREATE UNIQUE INDEX IF NOT EXISTS uq_fin_reports_single_current 
ON public.financial_reports (symbol, fiscal_year, fiscal_quarter, consolidation_type, report_type) 
WHERE (is_current = true);

-- 2. Tek Aktif Snapshot Kısıtı (At most 1 current snapshot per canonical item & period)
CREATE UNIQUE INDEX IF NOT EXISTS uq_snapshots_single_current 
ON public.financial_statement_snapshots (symbol, fiscal_year, fiscal_quarter, statement_type, canonical_item_code, period_type, duration_months) 
WHERE (is_current = true);

-- 3. Performans İndeksleri (Raw data & query performance optimization)
CREATE INDEX IF NOT EXISTS idx_raw_rows_report 
ON public.financial_report_raw_rows (report_id);

CREATE INDEX IF NOT EXISTS idx_raw_values_col_row 
ON public.financial_report_raw_values (column_id, row_id);

CREATE INDEX IF NOT EXISTS idx_snapshots_report_provenance 
ON public.financial_statement_snapshots (report_id, is_current);

COMMIT;
