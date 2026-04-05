import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Check, X, Loader2, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Booking {
  id: string;
  booking_date: string;
  check_in: string;
  check_out: string;
  berth_type: string;
  total_price: number;
  status: string;
  customer_name: string;
  customer_phone: string;
  bus_id: string;
  bus_name?: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-600',
  confirmed: 'bg-green-500/10 text-green-600',
  rejected: 'bg-destructive/10 text-destructive',
  completed: 'bg-primary/10 text-primary',
  cancelled: 'bg-muted text-muted-foreground',
};

const BookingManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    if (!user) return;
    // Get owner's bus IDs
    const { data: buses } = await supabase.from('buses').select('id, bus_name').eq('owner_id', user.id);
    if (!buses?.length) { setLoading(false); return; }

    const busMap = Object.fromEntries(buses.map(b => [b.id, b.bus_name]));
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .in('bus_id', buses.map(b => b.id))
      .order('booking_date', { ascending: false });

    setBookings((data || []).map(b => ({ ...b, bus_name: busMap[b.bus_id] })) as Booking[]);
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, [user]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('bookings').update({ status }).eq('id', id);
    toast({ title: `Booking ${status}` });
    fetchBookings();
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-heading font-bold text-foreground">Booking Management</h1>

      {bookings.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
          <Calendar className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-xl font-heading font-semibold text-foreground mb-2">No bookings yet</h2>
          <p className="text-muted-foreground">Bookings will appear here when customers book your buses</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking, i) => (
            <motion.div key={booking.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card>
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-foreground">{booking.bus_name || 'Bus'}</h3>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full capitalize ${statusColors[booking.status]}`}>{booking.status}</span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{booking.booking_date}</span>
                        <span>{booking.check_in} - {booking.check_out}</span>
                        <span className="capitalize">{booking.berth_type} berth</span>
                        <span className="font-semibold text-foreground">₹{booking.total_price}</span>
                      </div>
                      {(booking.customer_name || booking.customer_phone) && (
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                          <User className="w-3.5 h-3.5" />
                          {booking.customer_name} {booking.customer_phone && `• ${booking.customer_phone}`}
                        </div>
                      )}
                    </div>
                    {booking.status === 'pending' && (
                      <div className="flex items-center gap-2 shrink-0">
                        <Button size="sm" onClick={() => updateStatus(booking.id, 'confirmed')} className="bg-green-600 hover:bg-green-700 text-white">
                          <Check className="w-3.5 h-3.5 mr-1" /> Accept
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => updateStatus(booking.id, 'rejected')} className="border-destructive text-destructive hover:bg-destructive/10">
                          <X className="w-3.5 h-3.5 mr-1" /> Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
