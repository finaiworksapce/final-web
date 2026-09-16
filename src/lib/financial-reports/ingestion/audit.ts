/**
 * FinAi KAP System — Ingestion Audit Logger
 * Logs ingestion state transitions and events to financial_report_audit_logs.
 */

import { getSupabaseAdminClient } from '../admin-client';
import type { FinancialAuditEventType } from '../../../types/kap-financials';

export async function logAuditEvent(
  eventType: FinancialAuditEventType | string,
  status: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR',
  message: string,
  options?: {
    reportId?: string | null;
    symbol?: string | null;
    metadata?: Record<string, any>;
  }
): Promise<void> {
  try {
    const sbAdmin = getSupabaseAdminClient();
    await sbAdmin.from('financial_report_audit_logs').insert({
      report_id: options?.reportId || null,
      symbol: options?.symbol || null,
      event_type: eventType,
      status,
      message,
      metadata: options?.metadata || {},
    });
  } catch (err: any) {
    console.error('Audit log insert error:', err.message || err);
  }
}
