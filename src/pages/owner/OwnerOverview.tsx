import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bus, Calendar, IndianRupee, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const OwnerOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ buses: 0, bookings: 0, earnings: 0, upcoming: 0 });
  const [profile, setProfile] = useState<{ full_name: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [busRes, bookRes, profileRes] = await Promise.all([
        supabase.from('buses').select('id', { count: 'exact' }).eq('owner_id', user.id),
        supabase.from('bookings').select('id, total_price, booking_date, bus_id').in(
          'bus_id',
          (await supabase.from('buses').select('id').eq('owner_id', user.id)).data?.map(b => b.id) || []
        ),
        supabase.from('profiles').select('full_name').eq('user_id', user.id).single(),
      ]);

      const bookings = bookRes.data || [];
      const earnings = bookings.reduce((sum, b) => sum + (Number(b.total_price) || 0), 0);
      const upcoming = bookings.filter(b => new Date(b.booking_date) >= new Date()).length;

      setStats({
        buses: busRes.count || 0,
        bookings: bookings.length,
        earnings,
        upcoming,
      });
      if (profileRes.data) setProfile(profileRes.data);
    };
    load();
  }, [user]);

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Owner';

  const cards = [
    { icon: Bus, title: 'Active Buses', value: stats.buses, color: 'text-primary', bg: 'bg-primary/10' },
    { icon: Calendar, title: 'Total Bookings', value: stats.bookings, color: 'text-accent', bg: 'bg-accent/10' },
    { icon: IndianRupee, title: 'Total Earnings', value: `₹${stats.earnings.toLocaleString()}`, color: 'text-green-600', bg: 'bg-green-500/10' },
    { icon: TrendingUp, title: 'Upcoming', value: stats.upcoming, color: 'text-glow', bg: 'bg-glow/10' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-heading font-bold text-foreground">
          Welcome, <span className="gradient-text">{displayName}</span> 👋
        </h1>
        <p className="text-muted-foreground mt-1">Here's your business overview</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="hover:shadow-elevated transition-shadow">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-xl ${card.bg} ${card.color} flex items-center justify-center mb-4`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className="text-2xl font-heading font-bold text-foreground mt-1">{card.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Link to="/owner/register">
          <Card className="hover:shadow-elevated transition-shadow cursor-pointer group border-dashed border-2">
            <CardContent className="p-6 text-center">
              <Bus className="w-10 h-10 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-heading font-semibold text-foreground">Register a New Bus</h3>
              <p className="text-sm text-muted-foreground mt-1">Start earning from your sleeper bus</p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/owner/buses">
          <Card className="hover:shadow-elevated transition-shadow cursor-pointer group">
            <CardContent className="p-6 text-center">
              <Calendar className="w-10 h-10 text-accent mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-heading font-semibold text-foreground">Manage My Buses</h3>
              <p className="text-sm text-muted-foreground mt-1">Edit listings, update availability</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default OwnerOverview;
