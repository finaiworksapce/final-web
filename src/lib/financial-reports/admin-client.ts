/**
 * FinAi KAP System — Server-Side Supabase Admin Client
 * Trusted server-side operations using SUPABASE_SERVICE_ROLE_KEY.
 * Never exposes service role key to client bundles or log outputs.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Ensures .env.local environment variables are loaded when running in Node.js scripts
 */
export function ensureEnvLoaded() {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return;
  }

  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const k = trimmed.slice(0, eqIdx).trim();
        const v = trimmed.slice(eqIdx + 1).trim();
        if (!process.env[k]) {
          process.env[k] = v;
        }
      }
    }
  }
}

let cachedAdminClient: SupabaseClient | null = null;

export function getSupabaseAdminClient(): SupabaseClient {
  if (cachedAdminClient) return cachedAdminClient;

  ensureEnvLoaded();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error('Supabase URL or SUPABASE_SERVICE_ROLE_KEY environment variable is missing.');
  }

  cachedAdminClient = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return cachedAdminClient;
}
