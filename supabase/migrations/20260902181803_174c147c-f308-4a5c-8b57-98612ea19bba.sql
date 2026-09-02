CREATE TABLE public.auth_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('signup', 'signin')),
  full_name TEXT,
  email TEXT,
  phone TEXT,
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT, SELECT ON public.auth_events TO authenticated;
GRANT ALL ON public.auth_events TO service_role;

ALTER TABLE public.auth_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can log their own auth events"
ON public.auth_events FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all auth events"
ON public.auth_events FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'));

UPDATE public.profiles SET role = 'admin' WHERE user_id = 'ea7fcb93-0c84-4feb-947c-68c39def0688';