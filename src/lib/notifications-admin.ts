import { NextRequest } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/financial-reports/admin-client';

export function getNotificationsAdmin() {
    return getSupabaseAdminClient();
}

export async function getNotificationUser(request: NextRequest) {
    const header = request.headers.get('authorization');
    const token = header?.match(/^Bearer\s+(.+)$/i)?.[1];
    if (!token) return null;

    const { data: { user }, error } = await getNotificationsAdmin().auth.getUser(token);
    return error ? null : user;
}

export function isAuthorizedCron(request: NextRequest) {
    const secret = process.env.CRON_SECRET;
    const authHeader = request.headers.get('authorization');
    const hasSecret = Boolean(secret && authHeader === `Bearer ${secret}`);
    const isVercelCron = request.headers.get('x-vercel-cron') === '1';
    return hasSecret || isVercelCron;
}
