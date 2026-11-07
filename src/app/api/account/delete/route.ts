import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
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
        console.log(`[Account Delete] Starting deletion for user ${userId} (${user.email || 'no-email'})...`);

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
                    console.warn(`[Account Delete] Notice while cleaning table ${table}:`, error.message);
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

        // 3. Delete user from Supabase Auth
        const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(userId);
        if (deleteAuthError) {
            console.error('[Account Delete] Supabase Auth deleteUser error:', deleteAuthError);
            return NextResponse.json(
                { success: false, error: 'Hesap auth kaydı silinirken bir hata oluştu: ' + deleteAuthError.message },
                { status: 500 }
            );
        }

        console.log(`[Account Delete] Successfully deleted user account and all data: ${userId}`);

        return NextResponse.json({
            success: true,
            message: 'Hesabınız ve tüm verileriniz kalıcı olarak başarıyla silindi.'
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
