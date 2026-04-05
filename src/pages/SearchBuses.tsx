import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import {
  Bus, MapPin, IndianRupee, Sparkles, ShieldCheck, Search, Filter,
  Loader2, Calendar, Star
} from 'lucide-react';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from '@/components/ui/dialog';

interface ApprovedBus {
  id: string;
  bus_name: string;
  bus_type: string;
  city: string;
  address: string;
  price_per_hour: number;
  night_package_price: number;
  total_berths: number;
  amenities: string[];
  time_slot_start: string;
  time_slot_end: string;
  available_days: string[];
  secure_parking: boolean;
  status: string;
}

const busTypeLabels: Record<string, string> = {
  ac_sleeper: 'AC Sleeper',
  non_ac: 'Non-AC',
  luxury: 'Luxury',
};

const SearchBuses = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [buses, setBuses] = useState<ApprovedBus[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState('');
  const [selectedBus, setSelectedBus] = useState<ApprovedBus | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [berthType, setBerthType] = useState('lower');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('buses')
        .select('*')
        .eq('status', 'approved')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      setBuses((data as ApprovedBus[]) || []);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = searchCity
    ? buses.filter(b => b.city.toLowerCase().includes(searchCity.toLowerCase()))
    : buses;

  const handleBook = async () => {
    if (!user) {
      toast({ title: 'Please sign in', description: 'You need to be signed in to book', variant: 'destructive' });
      return;
    }
    if (!bookingDate || !selectedBus) return;
    setBookingLoading(true);

    try {
      // Get user profile for name/phone
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, phone')
        .eq('user_id', user.id)
        .single();

      const { error } = await supabase.from('bookings').insert({
        bus_id: selectedBus.id,
        customer_id: user.id,
        booking_date: bookingDate,
        check_in: selectedBus.time_slot_start,
        check_out: selectedBus.time_slot_end,
        berth_type: berthType,
        total_price: selectedBus.night_package_price || selectedBus.price_per_hour * 10,
        customer_name: profile?.full_name || '',
        customer_phone: profile?.phone || '',
        status: 'pending',
      });

      if (error) throw error;
      toast({ title: 'Booking submitted!', description: 'The bus owner will confirm your booking shortly.' });
      setSelectedBus(null);
      setBookingDate('');
    } catch (err: any) {
      toast({ title: 'Booking failed', description: err.message, variant: 'destructive' });
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-heading font-bold text-foreground">Find Sleeper Buses</h1>
            <p className="text-muted-foreground mt-1">Browse verified sleep spaces near you</p>
          </motion.div>

          {/* Search */}
          <div className="flex gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Search by city..."
                value={searchCity}
                onChange={e => setSearchCity(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <Bus className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="text-xl font-heading font-semibold text-foreground mb-2">No buses available</h2>
              <p className="text-muted-foreground">
                {searchCity ? `No sleeper buses found in "${searchCity}"` : 'Check back soon for new listings'}
              </p>
            </motion.div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((bus, i) => (
                <motion.div key={bus.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="hover:shadow-elevated transition-shadow cursor-pointer group" onClick={() => setSelectedBus(bus)}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                          <Bus className="w-6 h-6" />
                        </div>
                        {bus.secure_parking && (
                          <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-500/10 px-2 py-1 rounded-full">
                            <ShieldCheck className="w-3 h-3" /> Verified
                          </span>
                        )}
                      </div>
                      <h3 className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors">{bus.bus_name}</h3>
                      <p className="text-xs text-muted-foreground capitalize mt-0.5">{busTypeLabels[bus.bus_type] || bus.bus_type} • {bus.total_berths} berths</p>

                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                        <MapPin className="w-3.5 h-3.5" /> {bus.city}
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {(bus.amenities as string[])?.slice(0, 4).map(a => (
                          <span key={a} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{a}</span>
                        ))}
                        {(bus.amenities as string[])?.length > 4 && (
                          <span className="text-xs text-primary font-medium">+{(bus.amenities as string[]).length - 4}</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                        <div className="flex items-center gap-1 text-foreground font-heading font-bold">
                          <IndianRupee className="w-4 h-4" />
                          ₹{bus.price_per_hour}<span className="text-xs font-normal text-muted-foreground">/hr</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{bus.time_slot_start} - {bus.time_slot_end}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={!!selectedBus} onOpenChange={() => setSelectedBus(null)}>
        <DialogContent className="max-w-md">
          {selectedBus && (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading">{selectedBus.bus_name}</DialogTitle>
                <DialogDescription>{busTypeLabels[selectedBus.bus_type]} • {selectedBus.city}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {(selectedBus.amenities as string[])?.map(a => (
                    <span key={a} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />{a}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 bg-muted rounded-xl">
                    <p className="text-muted-foreground text-xs">Hourly</p>
                    <p className="font-bold text-foreground">₹{selectedBus.price_per_hour}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-xl">
                    <p className="text-muted-foreground text-xs">Night Package</p>
                    <p className="font-bold text-foreground">₹{selectedBus.night_package_price || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Select Date</label>
                  <Input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Berth Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['lower', 'upper'].map(t => (
                      <button key={t} onClick={() => setBerthType(t)}
                        className={`p-2.5 rounded-xl border-2 text-sm font-semibold capitalize transition-all ${berthType === t ? 'border-primary bg-primary/5 text-foreground' : 'border-border text-muted-foreground'}`}>
                        {t} Berth
                      </button>
                    ))}
                  </div>
                </div>

                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleBook} disabled={!bookingDate || bookingLoading}>
                  {bookingLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-1" /> Booking...</> : 'Book Now'}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SearchBuses;
