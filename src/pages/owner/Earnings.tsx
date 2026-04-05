import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { IndianRupee, TrendingUp, Calendar, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface EarningData {
  month: string;
  amount: number;
}

const Earnings = () => {
  const { user } = useAuth();
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [thisMonth, setThisMonth] = useState(0);
  const [chartData, setChartData] = useState<EarningData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: buses } = await supabase.from('buses').select('id').eq('owner_id', user.id);
      if (!buses?.length) { setLoading(false); return; }

      const { data: bookings } = await supabase
        .from('bookings')
        .select('total_price, booking_date, status')
        .in('bus_id', buses.map(b => b.id))
        .in('status', ['confirmed', 'completed']);

      if (!bookings) { setLoading(false); return; }

      const total = bookings.reduce((s, b) => s + (Number(b.total_price) || 0), 0);
      const now = new Date();
      const monthTotal = bookings
        .filter(b => {
          const d = new Date(b.booking_date);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        })
        .reduce((s, b) => s + (Number(b.total_price) || 0), 0);

      // Group by month for chart
      const monthMap: Record<string, number> = {};
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      // Show last 6 months
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
        monthMap[key] = 0;
      }
      bookings.forEach(b => {
        const d = new Date(b.booking_date);
        const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
        if (key in monthMap) monthMap[key] += Number(b.total_price) || 0;
      });

      setTotalEarnings(total);
      setThisMonth(monthTotal);
      setChartData(Object.entries(monthMap).map(([month, amount]) => ({ month, amount })));
      setLoading(false);
    };
    load();
  }, [user]);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-heading font-bold text-foreground">Earnings</h1>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { icon: IndianRupee, label: 'Total Earnings', value: `₹${totalEarnings.toLocaleString()}`, color: 'text-green-600', bg: 'bg-green-500/10' },
          { icon: Calendar, label: 'This Month', value: `₹${thisMonth.toLocaleString()}`, color: 'text-primary', bg: 'bg-primary/10' },
          { icon: TrendingUp, label: 'Avg per Booking', value: `₹${chartData.reduce((s, d) => s + d.amount, 0) ? Math.round(totalEarnings / Math.max(1, chartData.reduce((s, d) => s + (d.amount > 0 ? 1 : 0), 0))).toLocaleString() : '0'}`, color: 'text-accent', bg: 'bg-accent/10' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card>
              <CardContent className="p-6">
                <div className={`w-10 h-10 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center mb-3`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-heading font-bold text-foreground mt-1">{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Revenue (Last 6 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.75rem',
                  }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-muted-foreground">No earnings data yet</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Earnings;
