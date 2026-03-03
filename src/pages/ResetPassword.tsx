import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Eye, EyeOff, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const passwordRules = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One number', test: (p: string) => /\d/.test(p) },
  { label: 'One special character', test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes('type=recovery')) {
      navigate('/auth');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    for (const rule of passwordRules) {
      if (!rule.test(password)) {
        setError(`Password: ${rule.label.toLowerCase()}`);
        return;
      }
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      toast({ title: 'Password updated!', description: 'You can now sign in with your new password.' });
      setTimeout(() => navigate('/auth'), 2000);
    }
    setLoading(false);
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-sm';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <button onClick={() => navigate('/auth')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to sign in
        </button>
        <div className="bg-card rounded-2xl shadow-elevated p-8 border border-border/50">
          <h1 className="text-2xl font-heading font-bold text-foreground mb-1">Set new password</h1>
          <p className="text-sm text-muted-foreground mb-6">Enter your new password below.</p>

          {success ? (
            <div className="text-center py-4">
              <Check className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-foreground font-semibold">Password updated successfully!</p>
              <p className="text-sm text-muted-foreground mt-1">Redirecting to sign in...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">New Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required className={`${inputClass} pr-10`} placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {password && (
                  <div className="mt-2 space-y-1">
                    {passwordRules.map((rule) => (
                      <div key={rule.label} className="flex items-center gap-2 text-xs">
                        {rule.test(password) ? <Check className="w-3 h-3 text-green-500" /> : <X className="w-3 h-3 text-destructive" />}
                        <span className={rule.test(password) ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>{rule.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className={inputClass} placeholder="••••••••" />
                {confirmPassword && password !== confirmPassword && <p className="text-xs text-destructive mt-1">Passwords do not match</p>}
              </div>
              {error && <p className="text-destructive text-sm bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>}
              <button type="submit" disabled={loading} className="w-full py-3.5 bg-accent text-accent-foreground font-heading font-bold rounded-xl hover:bg-accent/90 transition-all shadow-accent-glow disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Updating...</> : 'Update Password'}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
