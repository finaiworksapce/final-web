-- FinAi Economic Calendar Events Persistent Storage Migration
-- Table for saving/updating live scraped and released macro economic data

CREATE TABLE IF NOT EXISTS public.economic_calendar_events (
    id TEXT PRIMARY KEY,
    source_id TEXT,
    event_date DATE NOT NULL,
    event_time TEXT NOT NULL,
    country_code TEXT NOT NULL,
    flag TEXT,
    event_name TEXT NOT NULL,
    impact_level TEXT NOT NULL DEFAULT 'medium',
    previous_value TEXT,
    forecast_value TEXT,
    actual_value TEXT,
    is_released BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    last_checked_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_economic_calendar_date ON public.economic_calendar_events(event_date);
CREATE INDEX IF NOT EXISTS idx_economic_calendar_released ON public.economic_calendar_events(is_released);
CREATE INDEX IF NOT EXISTS idx_economic_calendar_name ON public.economic_calendar_events(event_name);

-- RLS Policies: Allow public read, service role full access
ALTER TABLE public.economic_calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to economic calendar events"
    ON public.economic_calendar_events FOR SELECT
    USING (true);

CREATE POLICY "Allow service role full access to economic calendar events"
    ON public.economic_calendar_events FOR ALL
    USING (auth.role() = 'service_role');
