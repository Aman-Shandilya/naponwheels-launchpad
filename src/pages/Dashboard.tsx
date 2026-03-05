import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Bus, Calendar, DollarSign, PlusCircle, User, MapPin, ArrowLeft, LogOut } from 'lucide-react';
import Header from '@/components/Header';

interface Profile {
  full_name: string;
  phone: string;
  role: 'customer' | 'bus_owner';
}

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      try {
        let { data, error } = await supabase
          .from('profiles')
          .select('full_name, phone, role')
          .eq('user_id', user.id)
          .single();

        // If no profile exists, create one for this user
        if (error && error.code === 'PGRST116') {
          const meta = user.user_metadata || {};
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
              user_id: user.id,
              full_name: meta.full_name || user.email?.split('@')[0] || '',
              phone: meta.phone || '',
              role: (meta.role as 'customer' | 'bus_owner') || 'customer',
            })
            .select('full_name, phone, role')
            .single();

          if (insertError) {
            console.error('Profile create error:', insertError);
            setError('Could not create profile');
          } else {
            data = newProfile;
          }
        } else if (error) {
          console.error('Profile fetch error:', error);
          setError('Could not load profile');
        }

        if (data) {
          setProfile(data as Profile);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('Something went wrong');
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, [user]);

  if (authLoading || loadingProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 pb-12 px-4 flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-destructive text-lg font-semibold mb-2">{error || 'Profile not found'}</p>
          <p className="text-muted-foreground text-sm mb-4">Please try signing out and back in.</p>
          <Link to="/" className="text-sm text-accent hover:underline">← Back to home</Link>
        </div>
      </div>
    );
  }

  const displayName = profile.full_name || user.email?.split('@')[0] || 'User';
  const isOwner = profile.role === 'bus_owner';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back to home */}
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
            Welcome, <span className="gradient-text">{displayName}</span> 👋
          </h1>
          <p className="text-muted-foreground mt-2">
            {isOwner ? 'Manage your buses and track earnings' : 'Find and book sleeper buses for your next trip'}
          </p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground font-bold text-xl flex items-center justify-center">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">{displayName}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              {profile.phone && <p className="text-sm text-muted-foreground">{profile.phone}</p>}
              <span className="inline-block mt-1 px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                {isOwner ? 'Bus Owner' : 'Customer'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Cards */}
        {isOwner ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <DashCard
              icon={<Bus className="w-6 h-6" />}
              title="My Buses"
              desc="0 buses listed"
              action="Add Bus"
              delay={0.2}
            />
            <DashCard
              icon={<DollarSign className="w-6 h-6" />}
              title="Earnings"
              desc="₹0 this month"
              action="View Details"
              delay={0.3}
            />
            <DashCard
              icon={<Calendar className="w-6 h-6" />}
              title="Bookings"
              desc="0 upcoming"
              action="View All"
              delay={0.4}
            />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <DashCard
              icon={<MapPin className="w-6 h-6" />}
              title="Find Buses"
              desc="Search sleeper buses near you"
              action="Search Now"
              delay={0.2}
            />
            <DashCard
              icon={<Calendar className="w-6 h-6" />}
              title="My Bookings"
              desc="0 upcoming trips"
              action="View All"
              delay={0.3}
            />
            <DashCard
              icon={<User className="w-6 h-6" />}
              title="Profile"
              desc="Manage your account"
              action="Edit Profile"
              delay={0.4}
            />
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

const DashCard = ({
  icon,
  title,
  desc,
  action,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  action: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-card p-6 hover:shadow-elevated transition-shadow cursor-pointer group"
  >
    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
      {icon}
    </div>
    <h3 className="text-lg font-heading font-semibold text-foreground mb-1">{title}</h3>
    <p className="text-sm text-muted-foreground mb-4">{desc}</p>
    <span className="text-sm font-semibold text-accent hover:underline">{action} →</span>
  </motion.div>
);

export default Dashboard;
