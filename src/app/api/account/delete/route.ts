import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xbffacqaumgearqhajmg.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhiZmZhY3FhdW1nZWFycWhham1nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDQ5Mzc1OSwiZXhwIjoyMDg2MDY5NzU5fQ.Xa_czw4WUNrMi6jkWF510any7Ves0VmvS5UjMJ34vhc';

const supabaseAdmin = createClient(
    SUPABASE_URL,
    SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } }
);

export const dynamic = 'force-dynamic';

async function getUserFromRequest(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return null;

    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (!token) return null;

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) {
        console.error('[Account Delete] Token verification failed:', error?.message);
        return null;
    }

    return user;
}

async function handleDeleteAccount(request: NextRequest) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Oturum süresi dolmuş veya yetkisiz erişim. Lütfen tekrar giriş yapınız.' },
                { status: 401 }
            );
        }

        const userId = user.id;
        console.log(`[Account Delete] Deleting user ${userId} (${user.email || 'no-email'})...`);

        // 1. Clean up user-related records across application tables safely
        const tablesToClean = [
            'user_portfolios',
            'portfolio_history',
            'user_transactions',
            'portfolio_transactions',
            'push_subscriptions',
            'notification_preferences',
            'followed_indicators',
            'notification_logs',
            'analysis_snapshots'
        ];

        for (const table of tablesToClean) {
            try {
                const { error } = await supabaseAdmin.from(table).delete().eq('user_id', userId);
                if (error) {
                    console.warn(`[Account Delete] Table cleanup note (${table}):`, error.message);
                }
            } catch (err: any) {
                console.warn(`[Account Delete] Exception on table ${table}:`, err?.message || err);
            }
        }

        // 2. Clean profiles table where id = userId
        try {
            await supabaseAdmin.from('profiles').delete().eq('id', userId);
        } catch (err: any) {
            console.warn('[Account Delete] Exception on profiles table:', err?.message || err);
        }

        // 3. Delete user from Supabase Auth permanently
        const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(userId);
        if (deleteAuthError) {
            console.error('[Account Delete] Supabase Auth deleteUser error:', deleteAuthError);
            return NextResponse.json(
                { success: false, error: 'Hesap auth kaydı silinirken hata: ' + deleteAuthError.message },
                { status: 500 }
            );
        }

        console.log(`[Account Delete] Successfully permanently deleted user account: ${userId}`);

        return NextResponse.json({
            success: true,
            message: 'Hesabınız ve tüm verileriniz Supabase veritabanından kalıcı olarak silindi.'
        });
    } catch (error: any) {
        console.error('[Account Delete] Unexpected error:', error);
        return NextResponse.json(
            { success: false, error: error?.message || 'Beklenmeyen bir sunucu hatası oluştu.' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    return handleDeleteAccount(request);
}

export async function DELETE(request: NextRequest) {
    return handleDeleteAccount(request);
}
