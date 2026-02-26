import { motion } from 'framer-motion';
import { Bus, Calendar, IndianRupee, ShieldCheck, ArrowRight } from 'lucide-react';
import { useLeadModal } from '@/contexts/LeadModalContext';

const perks = [
  { icon: Bus, text: 'Register your idle buses in minutes' },
  { icon: Calendar, text: 'Set your own availability schedule' },
  { icon: IndianRupee, text: 'Earn passive income daily' },
  { icon: ShieldCheck, text: 'Full platform support & insurance' },
];

const ForOwners = () => {
  const { openModal } = useLeadModal();

  return (
    <section id="for-owners" className="section-padding bg-surface">
      <div className="container-narrow">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-accent font-semibold text-sm uppercase tracking-wide mb-3 block">
              For Bus Owners
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-foreground mb-6">
              Turn Your Parked Buses Into a Steady Income Stream
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Your buses are sitting idle between trips. With NapOnWheels, they become micro-hotels
              — earning you money while helping travelers rest. It's a win-win.
            </p>

            <div className="space-y-4 mb-8">
              {perks.map(p => (
                <div key={p.text} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <p.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">{p.text}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => openModal('I own a sleeper bus and I\'d like to register it on NapOnWheels.')}
              className="px-8 py-4 bg-accent text-accent-foreground font-heading font-bold text-lg rounded-2xl hover:bg-accent/90 transition-all shadow-accent-glow flex items-center gap-2"
            >
              Register Your Bus
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="glass-card-strong p-8 space-y-6">
              <div className="text-center">
                <p className="text-5xl font-heading font-extrabold text-accent mb-2">₹200,000+</p>
                <p className="text-muted-foreground">Average monthly earning per bus</p>
              </div>
              <div className="h-px bg-border" />
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-heading font-bold text-foreground">500+</p>
                  <p className="text-sm text-muted-foreground">Registered Buses</p>
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold text-foreground">50+</p>
                  <p className="text-sm text-muted-foreground">Cities Covered</p>
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold text-foreground">10K+</p>
                  <p className="text-sm text-muted-foreground">Happy Guests</p>
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold text-foreground">4.8★</p>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ForOwners;
