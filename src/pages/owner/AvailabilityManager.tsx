import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Clock, Bus, Loader2, Power } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface BusAvailability {
  id: string;
  bus_name: string;
  is_active: boolean;
  available_days: string[];
  time_slot_start: string;
  time_slot_end: string;
  recurring_availability: boolean;
  status: string;
}

const AvailabilityManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [buses, setBuses] = useState<BusAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const fetchBuses = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('buses')
      .select('id, bus_name, is_active, available_days, time_slot_start, time_slot_end, recurring_availability, status')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });
    setBuses((data as BusAvailability[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchBuses(); }, [user]);

  const toggleActive = async (busId: string, current: boolean) => {
    await supabase.from('buses').update({ is_active: !current }).eq('id', busId);
    fetchBuses();
    toast({ title: !current ? 'Bus activated' : 'Bus deactivated' });
  };

  const updateAvailability = async (busId: string, updates: Partial<BusAvailability>) => {
    setSaving(busId);
    await supabase.from('buses').update(updates).eq('id', busId);
    setSaving(null);
    toast({ title: 'Availability updated' });
    fetchBuses();
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-heading font-bold text-foreground">Availability Manager</h1>

      {buses.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
          <Clock className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-xl font-heading font-semibold text-foreground mb-2">No buses to manage</h2>
          <p className="text-muted-foreground">Register a bus first to manage its availability</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {buses.map((bus) => (
            <motion.div key={bus.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bus className="w-5 h-5 text-primary" />
                      <h3 className="font-heading font-semibold text-foreground">{bus.bus_name}</h3>
                      <span className={`text-xs font-semibold capitalize px-2 py-0.5 rounded-full ${bus.status === 'approved' ? 'bg-green-500/10 text-green-600' : 'bg-yellow-500/10 text-yellow-600'}`}>{bus.status}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleActive(bus.id, bus.is_active)}
                      className={bus.is_active ? '' : 'opacity-60'}
                    >
                      <Power className="w-3.5 h-3.5 mr-1" />
                      {bus.is_active ? 'Active' : 'Inactive'}
                    </Button>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Available Days</p>
                    <div className="flex flex-wrap gap-2">
                      {DAYS.map(d => {
                        const selected = (bus.available_days as string[])?.includes(d);
                        return (
                          <button key={d} type="button"
                            onClick={() => {
                              const newDays = selected
                                ? (bus.available_days as string[]).filter(x => x !== d)
                                : [...(bus.available_days as string[] || []), d];
                              updateAvailability(bus.id, { available_days: newDays } as any);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                            {d.slice(0, 3)}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Check-in</label>
                      <Input type="time" value={bus.time_slot_start}
                        onChange={e => updateAvailability(bus.id, { time_slot_start: e.target.value } as any)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Check-out</label>
                      <Input type="time" value={bus.time_slot_end}
                        onChange={e => updateAvailability(bus.id, { time_slot_end: e.target.value } as any)} />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={bus.recurring_availability}
                      onCheckedChange={v => updateAvailability(bus.id, { recurring_availability: !!v } as any)} />
                    <span className="text-sm text-foreground">Recurring weekly</span>
                  </label>

                  {saving === bus.id && <p className="text-xs text-primary">Saving...</p>}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailabilityManager;
