import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle2 } from 'lucide-react';
import { useLeadModal } from '@/contexts/LeadModalContext';

const LeadFormModal = () => {
  const { isOpen, closeModal, defaultReason } = useLeadModal();
  const [form, setForm] = useState({ name: '', phone: '', email: '', why: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [initialized, setInitialized] = useState(false);

  if (isOpen && !initialized) {
    setForm({ name: '', phone: '', email: '', why: defaultReason });
    setErrors({});
    setSuccess(false);
    setInitialized(true);
  }
  if (!isOpen && initialized) {
    setInitialized(false);
  }

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    else if (!/^\+?[\d\s-]{7,15}$/.test(form.phone.trim())) e.phone = 'Enter a valid phone number';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Enter a valid email';
    if (!form.why.trim()) e.why = 'Please tell us why you\'re interested';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const WEBHOOK_URL = 'https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjcwNTZmMDYzNjA0Mzc1MjZkNTUzMzUxMzMi_pc';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      // send data to webhook
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, phone: form.phone, email: form.email, why: form.why }),
      });

      // simulate processing delay for UX
      await new Promise(r => setTimeout(r, 800));

      setSuccess(true);
    } catch (err) {
      console.error('Failed to submit lead:', err);
      // keep user informed; optionally show an error toast (not implemented)
      setErrors(prev => ({ ...prev, submit: 'Submission failed. Please try again.' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={closeModal} />
          <motion.div
            className="relative w-full md:max-w-lg bg-card rounded-t-3xl md:rounded-2xl shadow-elevated max-h-[90vh] overflow-y-auto z-10"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            {/* Handle bar for mobile */}
            <div className="md:hidden flex justify-center pt-3">
              <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
            </div>

            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-heading font-bold text-foreground">
                    {success ? 'Thank You!' : 'Get Started with NapOnWheels'}
                  </h3>
                  {!success && (
                    <p className="text-sm text-muted-foreground mt-1">
                      We'll reach out to you shortly
                    </p>
                  )}
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {success ? (
                <motion.div
                  className="text-center py-8"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <CheckCircle2 className="w-16 h-16 text-accent mx-auto mb-4" />
                  <p className="text-lg font-heading font-semibold text-foreground">
                    Your request has been submitted!
                  </p>
                  <p className="text-muted-foreground mt-2">
                    Our team will contact you within 24 hours.
                  </p>
                  <button
                    onClick={closeModal}
                    className="mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Done
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="lead-name" className="block text-sm font-medium text-foreground mb-1.5">
                      Full Name
                    </label>
                    <input
                      id="lead-name"
                      type="text"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                      placeholder="Your full name"
                      maxLength={100}
                    />
                    {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="lead-phone" className="block text-sm font-medium text-foreground mb-1.5">
                      Phone Number
                    </label>
                    <div className="flex gap-2">
                      <select
                        className="px-3 py-3 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                        defaultValue="+91"
                        aria-label="Country code"
                      >
                        <option value="+91">🇮🇳 +91</option>
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+971">🇦🇪 +971</option>
                        <option value="+65">🇸🇬 +65</option>
                      </select>
                      <input
                        id="lead-phone"
                        type="tel"
                        inputMode="numeric"
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        className="flex-1 px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                        placeholder="Your phone number"
                        maxLength={15}
                      />
                    </div>
                    {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label htmlFor="lead-email" className="block text-sm font-medium text-foreground mb-1.5">
                      Email Address
                    </label>
                    <input
                      id="lead-email"
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                      placeholder="you@email.com"
                      maxLength={255}
                    />
                    {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="lead-why" className="block text-sm font-medium text-foreground mb-1.5">
                      Why are you interested?
                    </label>
                    <textarea
                      id="lead-why"
                      value={form.why}
                      onChange={e => setForm(f => ({ ...f, why: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition resize-none"
                      placeholder="Tell us your reason..."
                      maxLength={1000}
                    />
                    {errors.why && <p className="text-destructive text-xs mt-1">{errors.why}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-accent text-accent-foreground font-heading font-bold rounded-xl hover:bg-accent/90 transition-all shadow-accent-glow disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Request'
                    )}
                  </button>

                  <p className="text-xs text-muted-foreground text-center">
                    By submitting, you agree to our Terms of Service & Privacy Policy.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LeadFormModal;
