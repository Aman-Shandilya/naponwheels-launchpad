import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';

const Auth = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [forgotPassword, setForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (forgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth`,
        });
        if (error) throw error;
        setMessage('Check your email for a password reset link.');
        setForgotPassword(false);
      } else if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        setMessage('Check your email for a confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </button>

        <div className="bg-card rounded-2xl shadow-elevated p-8 border border-border/50">
          <h1 className="text-2xl font-heading font-bold text-foreground mb-1">
            {forgotPassword ? 'Reset password' : mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            {forgotPassword
              ? "Enter your email and we'll send you a link to reset your password."
              : mode === 'signin'
                ? 'Sign in to your NapOnWheels account'
                : 'Join NapOnWheels today'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                maxLength={255}
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                placeholder="you@email.com"
              />
            </div>
            {!forgotPassword && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  maxLength={128}
                  className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  placeholder="••••••••"
                />
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => { setForgotPassword(true); setError(''); setMessage(''); }}
                    className="mt-1.5 text-sm text-accent font-semibold hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
            )}

            {error && <p className="text-destructive text-sm">{error}</p>}
            {message && <p className="text-accent text-sm">{message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-accent text-accent-foreground font-heading font-bold rounded-xl hover:bg-accent/90 transition-all shadow-accent-glow disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {forgotPassword ? 'Sending...' : mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                forgotPassword ? 'Send reset link' : mode === 'signin' ? 'Sign In' : 'Sign Up'
              )}
            </button>
          </form>

          <p className="text-sm text-muted-foreground text-center mt-6">
            {forgotPassword ? (
              <>
                Remember your password?{' '}
                <button
                  onClick={() => { setForgotPassword(false); setError(''); setMessage(''); }}
                  className="text-accent font-semibold hover:underline"
                >
                  Back to sign in
                </button>
              </>
            ) : (
              <>
                {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button
                  onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); setMessage(''); }}
                  className="text-accent font-semibold hover:underline"
                >
                  {mode === 'signin' ? 'Sign Up' : 'Sign In'}
                </button>
              </>
            )}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
