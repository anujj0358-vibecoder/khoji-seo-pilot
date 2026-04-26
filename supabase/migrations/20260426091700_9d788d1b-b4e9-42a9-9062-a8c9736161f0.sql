
CREATE TABLE public.researches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'brief_generated',
  brief JSONB,
  article TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_researches_user_id ON public.researches(user_id);
CREATE INDEX idx_researches_created_at ON public.researches(created_at DESC);

ALTER TABLE public.researches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own researches"
  ON public.researches FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own researches"
  ON public.researches FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own researches"
  ON public.researches FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own researches"
  ON public.researches FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER set_updated_at_researches
  BEFORE UPDATE ON public.researches
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
