-- Agent 19: Assessment flow orchestration — signals, notifications, answer extensions

-- operational_signals
CREATE TABLE IF NOT EXISTS public.operational_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  source_platform TEXT NOT NULL CHECK (source_platform IN ('slack', 'teams')),
  source_user_id TEXT NOT NULL,
  source_workspace_id TEXT NOT NULL,
  raw_message TEXT NOT NULL,
  clarification_conversation JSONB,
  extracted_signal JSONB NOT NULL,
  signal_confidence DECIMAL(3,2),
  controls_mapped JSONB,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'dismissed')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  confirmed_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_os_org_status_created
  ON public.operational_signals(organization_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_os_org_pending
  ON public.operational_signals(organization_id) WHERE status = 'pending';

ALTER TABLE public.operational_signals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Org members read operational signals" ON public.operational_signals;
CREATE POLICY "Org members read operational signals"
  ON public.operational_signals FOR SELECT
  USING (organization_id IN (SELECT org_id FROM public.users WHERE id = auth.uid()));

-- signal_notifications
CREATE TABLE IF NOT EXISTS public.signal_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  signal_id UUID REFERENCES public.operational_signals(id) ON DELETE SET NULL,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('signal_captured', 'confidence_drop', 'propagation_update')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  frameworks_affected JSONB,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sn_user_read_created
  ON public.signal_notifications(user_id, read, created_at DESC);

ALTER TABLE public.signal_notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own signal notifications" ON public.signal_notifications;
CREATE POLICY "Users read own signal notifications"
  ON public.signal_notifications FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users update own signal notifications" ON public.signal_notifications;
CREATE POLICY "Users update own signal notifications"
  ON public.signal_notifications FOR UPDATE
  USING (user_id = auth.uid());

-- notification_preferences (Agent 19 signal digest)
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_signal_digest BOOLEAN DEFAULT TRUE,
  email_digest_frequency TEXT CHECK (email_digest_frequency IN ('immediate', 'daily', 'weekly')) DEFAULT 'daily',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own notification preferences" ON public.notification_preferences;
CREATE POLICY "Users manage own notification preferences"
  ON public.notification_preferences FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- assessment_answers extensions
ALTER TABLE public.assessment_answers
  ADD COLUMN IF NOT EXISTS confidence_weight DECIMAL(3,2) DEFAULT 1.0,
  ADD COLUMN IF NOT EXISTS signal_id UUID REFERENCES public.operational_signals(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS intentional_divergence BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS divergence_note TEXT;

ALTER TABLE public.assessment_answers
  DROP CONSTRAINT IF EXISTS assessment_answers_source_check;
ALTER TABLE public.assessment_answers
  ADD CONSTRAINT assessment_answers_source_check
  CHECK (source IN ('form', 'cypher', 'signal'));
