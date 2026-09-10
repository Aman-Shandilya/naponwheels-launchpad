import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const logAuthEvent = async (
  userId: string,
  eventType: 'signup' | 'signin',
  metadata: { full_name?: string; email?: string; phone?: string; role?: string }
) => {
  try {
    await (supabase.rpc as any)('log_auth_event', {
      p_user_id: userId,
      p_event_type: eventType,
      p_full_name: metadata.full_name || null,
      p_email: metadata.email || null,
      p_phone: metadata.phone || null,
      p_role: metadata.role || null,
    });
  } catch (err) {
    console.error('Auth event log error:', err);
  }
};

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (session) {
          const meta = session.user.user_metadata || {};
          await logAuthEvent(session.user.id, 'signin', {
            full_name: meta.full_name || '',
            email: session.user.email || '',
            phone: meta.phone || '',
            role: meta.role || '',
          });
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/auth', { replace: true });
        }
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setError(err.message || 'Verification failed');
        setTimeout(() => navigate('/auth', { replace: true }), 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-destructive text-lg font-semibold mb-2">Verification failed</p>
          <p className="text-muted-foreground text-sm">{error}</p>
          <p className="text-muted-foreground text-xs mt-2">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
        <p className="text-muted-foreground">Verifying your email...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
