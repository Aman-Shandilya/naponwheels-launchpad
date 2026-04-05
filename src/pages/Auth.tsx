import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, ArrowLeft, Eye, EyeOff, Check, X, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const COUNTRY_CODES = [
  { code: '+91', country: 'IN', label: 'India (+91)' },
  { code: '+1', country: 'US', label: 'US (+1)' },
  { code: '+44', country: 'GB', label: 'UK (+44)' },
  { code: '+61', country: 'AU', label: 'Australia (+61)' },
  { code: '+971', country: 'AE', label: 'UAE (+971)' },
  { code: '+65', country: 'SG', label: 'Singapore (+65)' },
  { code: '+81', country: 'JP', label: 'Japan (+81)' },
  { code: '+49', country: 'DE', label: 'Germany (+49)' },
];

const passwordRules = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One number', test: (p: string) => /\d/.test(p) },
  { label: 'One special character', test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

const Auth = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [forgotPassword, setForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [role, setRole] = useState<'customer' | 'bus_owner'>('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      const returnTo = (location.state as { returnTo?: string })?.returnTo;
      if (returnTo) {
        navigate(returnTo);
      } else {
        // Check profile role and redirect accordingly
        supabase.from('profiles').select('role').eq('user_id', user.id).single().then(({ data }) => {
          if (data?.role === 'bus_owner') {
            navigate('/owner');
          } else {
            navigate('/dashboard');
          }
        });
      }
    }
  }, [user, navigate, location.state]);

  const validateSignup = (): string | null => {
    if (!fullName.trim()) return 'Full name is required';
    if (fullName.trim().length < 2) return 'Name must be at least 2 characters';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email address';
    if (phone && !/^\d{7,15}$/.test(phone.replace(/\s/g, ''))) return 'Invalid phone number';
    for (const rule of passwordRules) {
      if (!rule.test(password)) return `Password: ${rule.label.toLowerCase()}`;
    }
    if (password !== confirmPassword) return 'Passwords do not match';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (forgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setMessage('Check your email for a password reset link.');
        toast({ title: 'Email sent!', description: 'Check your inbox for the reset link.' });
        setForgotPassword(false);
      } else if (mode === 'signup') {
        const validationError = validateSignup();
        if (validationError) {
          setError(validationError);
          setLoading(false);
          return;
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              full_name: fullName.trim(),
              phone: phone ? `${countryCode}${phone.replace(/\s/g, '')}` : '',
              role,
            },
          },
        });
        if (error) throw error;
        setMessage('Check your email for a confirmation link to complete sign up!');
        toast({ title: 'Account created!', description: 'Please verify your email to sign in.' });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: 'Welcome back!', description: 'You have signed in successfully.' });
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode: 'signin' | 'signup') => {
    setMode(newMode);
    setError('');
    setMessage('');
    setForgotPassword(false);
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-sm';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
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
          {/* Mode tabs */}
          {!forgotPassword && (
            <div className="flex mb-6 bg-muted rounded-xl p-1">
              {(['signin', 'signup'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                    mode === m
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {m === 'signin' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>
          )}

          <h1 className="text-2xl font-heading font-bold text-foreground mb-1">
            {forgotPassword ? 'Reset password' : mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            {forgotPassword
              ? "Enter your email and we'll send you a reset link."
              : mode === 'signin'
                ? 'Sign in to your NapOnWheels account'
                : 'Join NapOnWheels today — it takes 30 seconds'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === 'signup' && !forgotPassword && (
                <motion.div
                  key="signup-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      maxLength={100}
                      className={inputClass}
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Phone Number</label>
                    <div className="flex gap-2">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowCountryDropdown((v) => !v)}
                          className="flex items-center gap-1 px-3 py-3 rounded-xl bg-muted border border-border text-foreground text-sm min-w-[90px] justify-between"
                        >
                          {countryCode}
                          <ChevronDown className="w-3 h-3" />
                        </button>
                        {showCountryDropdown && (
                          <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-xl shadow-elevated z-20 w-48 max-h-48 overflow-y-auto">
                            {COUNTRY_CODES.map((c) => (
                              <button
                                key={c.code}
                                type="button"
                                onClick={() => {
                                  setCountryCode(c.code);
                                  setShowCountryDropdown(false);
                                }}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors"
                              >
                                {c.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/[^\d\s]/g, ''))}
                        maxLength={15}
                        className={`${inputClass} flex-1`}
                        placeholder="9876543210"
                      />
                    </div>
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">I am a</label>
                    <div className="grid grid-cols-2 gap-3">
                      {([
                        { value: 'customer' as const, label: 'Customer', desc: 'Book sleeper buses' },
                        { value: 'bus_owner' as const, label: 'Bus Owner', desc: 'List your buses' },
                      ]).map((r) => (
                        <button
                          key={r.value}
                          type="button"
                          onClick={() => setRole(r.value)}
                          className={`p-3 rounded-xl border-2 text-left transition-all ${
                            role === r.value
                              ? 'border-primary bg-primary/5 text-foreground'
                              : 'border-border text-muted-foreground hover:border-primary/30'
                          }`}
                        >
                          <p className="text-sm font-semibold">{r.label}</p>
                          <p className="text-xs mt-0.5 opacity-70">{r.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={255}
                className={inputClass}
                placeholder="you@email.com"
              />
            </div>

            {/* Password */}
            {!forgotPassword && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    maxLength={128}
                    className={`${inputClass} pr-10`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password strength for signup */}
                {mode === 'signup' && password && (
                  <div className="mt-2 space-y-1">
                    {passwordRules.map((rule) => (
                      <div key={rule.label} className="flex items-center gap-2 text-xs">
                        {rule.test(password) ? (
                          <Check className="w-3 h-3 text-green-500" />
                        ) : (
                          <X className="w-3 h-3 text-destructive" />
                        )}
                        <span className={rule.test(password) ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>
                          {rule.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

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

            {/* Confirm Password */}
            {mode === 'signup' && !forgotPassword && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    maxLength={128}
                    className={`${inputClass} pr-10`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-destructive mt-1">Passwords do not match</p>
                )}
              </div>
            )}

            {/* Remember Me for sign in */}
            {mode === 'signin' && !forgotPassword && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary/50"
                />
                <span className="text-sm text-muted-foreground">Remember me</span>
              </label>
            )}

            {error && <p className="text-destructive text-sm bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>}
            {message && <p className="text-green-600 dark:text-green-400 text-sm bg-green-500/10 px-3 py-2 rounded-lg">{message}</p>}

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
                forgotPassword ? 'Send reset link' : mode === 'signin' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {forgotPassword && (
            <p className="text-sm text-muted-foreground text-center mt-6">
              Remember your password?{' '}
              <button
                onClick={() => { setForgotPassword(false); setError(''); setMessage(''); }}
                className="text-accent font-semibold hover:underline"
              >
                Back to sign in
              </button>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
