import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, ArrowLeft, Users, Shield, Calendar, LogOut } from 'lucide-react';
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';

interface AuthEvent {
  id: string;
  user_id: string;
  event_type: 'signup' | 'signin';
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role: string | null;
  created_at: string;
}

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [events, setEvents] = useState<AuthEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;

    const checkAdmin = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error || !data || data.role !== 'admin') {
        setError('This page is only for admins.');
        setLoading(false);
        return;
      }

      setIsAdmin(true);
      fetchEvents();
    };

    const fetchEvents = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('auth_events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Auth events fetch error:', error);
        setError('Could not load activity log.');
        toast({ title: 'Error', description: 'Could not load activity log.' });
      } else {
        setEvents((data as AuthEvent[]) || []);
      }
      setLoading(false);
    };

    checkAdmin();
  }, [user, toast]);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <Link
              to="/dashboard"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to dashboard
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground flex items-center gap-2">
                <Shield className="w-7 h-7 text-accent" />
                Admin Activity Log
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                See every sign-up and sign-in on NapOnWheels.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-4 py-2 rounded-xl">
              <Users className="w-4 h-4" />
              {events.length} events
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {!error && (
            <div className="bg-card border border-border rounded-2xl shadow-elevated overflow-hidden">
              {events.length === 0 ? (
                <div className="p-10 text-center text-muted-foreground text-sm">
                  <Calendar className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  No activity yet. New sign-ups and sign-ins will appear here.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 border-b border-border">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold text-foreground">Event</th>
                        <th className="text-left px-4 py-3 font-semibold text-foreground">Name</th>
                        <th className="text-left px-4 py-3 font-semibold text-foreground">Email</th>
                        <th className="text-left px-4 py-3 font-semibold text-foreground">Phone</th>
                        <th className="text-left px-4 py-3 font-semibold text-foreground">Role</th>
                        <th className="text-left px-4 py-3 font-semibold text-foreground">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {events.map((event) => (
                        <tr key={event.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                event.event_type === 'signup'
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              }`}
                            >
                              {event.event_type === 'signup' ? 'Sign Up' : 'Sign In'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-foreground font-medium">
                            {event.full_name || '-'}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{event.email || '-'}</td>
                          <td className="px-4 py-3 text-muted-foreground">{event.phone || '-'}</td>
                          <td className="px-4 py-3 text-muted-foreground capitalize">{event.role || '-'}</td>
                          <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                            {formatDate(event.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Admin;
