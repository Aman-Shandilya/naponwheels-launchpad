
-- Create buses table
CREATE TABLE public.buses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  bus_name text NOT NULL,
  operator_name text DEFAULT '',
  bus_type text NOT NULL DEFAULT 'ac_sleeper',
  total_berths int NOT NULL DEFAULT 12,
  registration_number text NOT NULL,
  business_type text NOT NULL DEFAULT 'individual',
  address text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  landmark text DEFAULT '',
  parking_location text DEFAULT '',
  price_per_hour numeric NOT NULL DEFAULT 0,
  night_package_price numeric DEFAULT 0,
  weekend_price numeric DEFAULT 0,
  discount_enabled boolean DEFAULT false,
  amenities jsonb DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'pending',
  secure_parking boolean DEFAULT false,
  available_days jsonb DEFAULT '[]'::jsonb,
  time_slot_start text DEFAULT '20:00',
  time_slot_end text DEFAULT '08:00',
  recurring_availability boolean DEFAULT true,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create unique index on registration_number
CREATE UNIQUE INDEX buses_registration_number_unique ON public.buses (registration_number);

-- Create bus_documents table
CREATE TABLE public.bus_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bus_id uuid NOT NULL REFERENCES public.buses(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  file_path text NOT NULL,
  file_name text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bus_id uuid NOT NULL REFERENCES public.buses(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL,
  booking_date date NOT NULL,
  check_in text NOT NULL DEFAULT '20:00',
  check_out text NOT NULL DEFAULT '08:00',
  berth_type text DEFAULT 'lower',
  total_price numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  customer_name text DEFAULT '',
  customer_phone text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bus_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Buses RLS: owners can manage their own buses
CREATE POLICY "Owners can insert their buses" ON public.buses FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can update their buses" ON public.buses FOR UPDATE TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Owners can delete their buses" ON public.buses FOR DELETE TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Anyone can view approved buses" ON public.buses FOR SELECT USING (status = 'approved' OR auth.uid() = owner_id);

-- Bus documents RLS
CREATE POLICY "Owners can manage bus documents" ON public.bus_documents FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.buses WHERE buses.id = bus_documents.bus_id AND buses.owner_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.buses WHERE buses.id = bus_documents.bus_id AND buses.owner_id = auth.uid())
);
CREATE POLICY "Anyone can view docs of approved buses" ON public.bus_documents FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.buses WHERE buses.id = bus_documents.bus_id AND buses.status = 'approved')
);

-- Bookings RLS
CREATE POLICY "Customers can create bookings" ON public.bookings FOR INSERT TO authenticated WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Customers can view their bookings" ON public.bookings FOR SELECT TO authenticated USING (auth.uid() = customer_id);
CREATE POLICY "Owners can view bookings for their buses" ON public.bookings FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.buses WHERE buses.id = bookings.bus_id AND buses.owner_id = auth.uid())
);
CREATE POLICY "Owners can update booking status" ON public.bookings FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.buses WHERE buses.id = bookings.bus_id AND buses.owner_id = auth.uid())
);

-- Updated_at triggers
CREATE TRIGGER update_buses_updated_at BEFORE UPDATE ON public.buses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Storage bucket for bus documents
INSERT INTO storage.buckets (id, name, public) VALUES ('bus-documents', 'bus-documents', true);

-- Storage RLS
CREATE POLICY "Authenticated users can upload bus documents" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'bus-documents');
CREATE POLICY "Anyone can view bus documents" ON storage.objects FOR SELECT USING (bucket_id = 'bus-documents');
CREATE POLICY "Owners can delete their bus documents" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'bus-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Enable realtime for bookings
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
