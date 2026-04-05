import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Bus, PlusCircle, MapPin, IndianRupee, Loader2, Pause, Play, Trash2, Edit } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface BusRecord {
  id: string;
  bus_name: string;
  bus_type: string;
  city: string;
  price_per_hour: number;
  status: string;
  is_active: boolean;
  total_berths: number;
  amenities: string[];
  registration_number: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-600',
  approved: 'bg-green-500/10 text-green-600',
  rejected: 'bg-destructive/10 text-destructive',
};

const MyBuses = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [buses, setBuses] = useState<BusRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBuses = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('buses')
      .select('id, bus_name, bus_type, city, price_per_hour, status, is_active, total_berths, amenities, registration_number')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });
    setBuses((data as BusRecord[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchBuses(); }, [user]);

  const toggleActive = async (busId: string, current: boolean) => {
    await supabase.from('buses').update({ is_active: !current }).eq('id', busId);
    toast({ title: !current ? 'Bus activated' : 'Bus paused' });
    fetchBuses();
  };

  const deleteBus = async (busId: string) => {
    if (!confirm('Delete this bus listing permanently?')) return;
    await supabase.from('buses').delete().eq('id', busId);
    toast({ title: 'Bus deleted' });
    fetchBuses();
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-bold text-foreground">My Buses</h1>
        <Link to="/owner/register">
          <Button><PlusCircle className="w-4 h-4 mr-1" /> Add Bus</Button>
        </Link>
      </div>

      {buses.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
          <Bus className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-xl font-heading font-semibold text-foreground mb-2">No buses added yet</h2>
          <p className="text-muted-foreground mb-6">Start earning by listing your first sleeper bus</p>
          <Link to="/owner/register">
            <Button><PlusCircle className="w-4 h-4 mr-1" /> Register Your Bus</Button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid gap-4">
          {buses.map((bus, i) => (
            <motion.div key={bus.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="hover:shadow-elevated transition-shadow">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Bus className="w-7 h-7" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-heading font-semibold text-foreground truncate">{bus.bus_name}</h3>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full capitalize ${statusColors[bus.status] || ''}`}>{bus.status}</span>
                        {bus.status === 'approved' && !bus.is_active && (
                          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-muted text-muted-foreground">Paused</span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{bus.city || 'No city'}</span>
                        <span className="flex items-center gap-1"><IndianRupee className="w-3.5 h-3.5" />₹{bus.price_per_hour}/hr</span>
                        <span>{bus.total_berths} berths</span>
                        <span className="uppercase text-xs">{bus.registration_number}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {bus.status === 'approved' && (
                        <Button variant="outline" size="sm" onClick={() => toggleActive(bus.id, bus.is_active)}>
                          {bus.is_active ? <><Pause className="w-3.5 h-3.5 mr-1" /> Pause</> : <><Play className="w-3.5 h-3.5 mr-1" /> Resume</>}
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => deleteBus(bus.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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

export default MyBuses;
