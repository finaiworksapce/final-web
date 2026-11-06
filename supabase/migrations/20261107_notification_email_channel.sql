-- Independent daily summary email preference, enabled for existing and new users.
ALTER TABLE public.notification_preferences
ADD COLUMN IF NOT EXISTS daily_morning_summary_email BOOLEAN NOT NULL DEFAULT true;

-- Store per-channel delivery outcomes without changing the existing history API.
ALTER TABLE public.notification_logs
ADD COLUMN IF NOT EXISTS channel TEXT NOT NULL DEFAULT 'web_push';

CREATE INDEX IF NOT EXISTS idx_notification_logs_user_channel_sent
ON public.notification_logs(user_id, channel, sent_at DESC);
