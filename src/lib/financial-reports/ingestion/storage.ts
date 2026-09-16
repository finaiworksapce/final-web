/**
 * FinAi KAP System — Supabase Storage PDF Ingestion
 * Uploads raw PDF documents to the private "financial-reports" storage bucket.
 * Deterministic path structure prevents duplication.
 */

import { getSupabaseAdminClient } from '../admin-client';
import { calculateSha256 } from '../parser/pdf-extractor';

export interface StorageUploadResult {
  bucket: string;
  path: string;
  fileHashSha256: string;
  isExisting: boolean;
}

export const STORAGE_BUCKET_NAME = 'financial-reports';

/**
 * Computes deterministic storage path
 */
export function buildStoragePath(
  symbol: string,
  fiscalYear: number,
  fiscalQuarter: number,
  fileHashSha256: string
): string {
  const shortHash = fileHashSha256.slice(0, 12);
  const cleanSymbol = symbol.toUpperCase().replace(/[^A-Z0-9_]/g, '');
  return `reports/${cleanSymbol}/${fiscalYear}/Q${fiscalQuarter}/${cleanSymbol}_${fiscalYear}_Q${fiscalQuarter}_${shortHash}.pdf`;
}

/**
 * Uploads PDF buffer to private financial-reports bucket in an idempotent manner
 */
export async function uploadPdfToStorage(
  pdfBuffer: Buffer,
  symbol: string,
  fiscalYear: number,
  fiscalQuarter: number,
  optionsSha256?: string
): Promise<StorageUploadResult> {
  const sbAdmin = getSupabaseAdminClient();
  const fileHashSha256 = optionsSha256 || calculateSha256(pdfBuffer);
  const targetPath = buildStoragePath(symbol, fiscalYear, fiscalQuarter, fileHashSha256);

  // 1. Check if file already exists in storage
  const { data: listData, error: listError } = await sbAdmin.storage
    .from(STORAGE_BUCKET_NAME)
    .list(`reports/${symbol.toUpperCase()}/${fiscalYear}/Q${fiscalQuarter}`);

  if (!listError && listData) {
    const fileNameOnly = targetPath.split('/').pop();
    const existingFile = listData.find((f) => f.name === fileNameOnly);
    if (existingFile) {
      return {
        bucket: STORAGE_BUCKET_NAME,
        path: targetPath,
        fileHashSha256,
        isExisting: true,
      };
    }
  }

  // 2. Upload PDF file
  const { error: uploadError } = await sbAdmin.storage
    .from(STORAGE_BUCKET_NAME)
    .upload(targetPath, pdfBuffer, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Supabase Storage PDF yükleme hatası [${targetPath}]: ${uploadError.message}`);
  }

  return {
    bucket: STORAGE_BUCKET_NAME,
    path: targetPath,
    fileHashSha256,
    isExisting: false,
  };
}
