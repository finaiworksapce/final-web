import { NextRequest, NextResponse } from 'next/server';
import { getNotificationUser, getNotificationsAdmin } from '@/lib/notifications-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const user = await getNotificationUser(request);
        if (!user) {
            return NextResponse.json({ success: false, error: 'Yetkisiz erişim.' }, { status: 401 });
        }

        const { data, error } = await getNotificationsAdmin()
            .from('notification_preferences')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

        if (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        const defaults = {
            user_id: user.id,
            min_30_before: false,
            min_10_before: true,
            on_release: true,
            on_update: true,
            on_revision: true,
            daily_morning_summary: true,
            daily_morning_summary_email: true
        };

        return NextResponse.json({ success: true, preferences: data || defaults });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const user = await getNotificationUser(request);
        if (!user) {
            return NextResponse.json({ success: false, error: 'Yetkisiz erişim.' }, { status: 401 });
        }

        const body = await request.json();
        const { min_30_before, min_10_before, on_release, on_update, on_revision, daily_morning_summary, daily_morning_summary_email } = body;

        const { data: current } = await getNotificationsAdmin()
            .from('notification_preferences')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

        const payload = {
            user_id: user.id,
            min_30_before: typeof min_30_before === 'boolean' ? min_30_before : current?.min_30_before ?? false,
            min_10_before: typeof min_10_before === 'boolean' ? min_10_before : current?.min_10_before ?? true,
            on_release: typeof on_release === 'boolean' ? on_release : current?.on_release ?? true,
            on_update: typeof on_update === 'boolean' ? on_update : current?.on_update ?? true,
            on_revision: typeof on_revision === 'boolean' ? on_revision : current?.on_revision ?? true,
            daily_morning_summary: typeof daily_morning_summary === 'boolean' ? daily_morning_summary : current?.daily_morning_summary ?? true,
            daily_morning_summary_email: typeof daily_morning_summary_email === 'boolean' ? daily_morning_summary_email : current?.daily_morning_summary_email ?? true,
            updated_at: new Date().toISOString()
        };

        const { data, error } = await getNotificationsAdmin()
            .from('notification_preferences')
            .upsert(payload, { onConflict: 'user_id' })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, preferences: data });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}
