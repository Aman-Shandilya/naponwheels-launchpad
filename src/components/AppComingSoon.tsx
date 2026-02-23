import { motion } from 'framer-motion';
import { Smartphone } from 'lucide-react';
import { useLeadModal } from '@/contexts/LeadModalContext';

const AppComingSoon = () => {
  const { openModal } = useLeadModal();

  return (
    <section className="section-padding bg-surface">
      <div className="container-narrow">
        <motion.div
          className="glass-card-strong p-8 md:p-12 text-center relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
          <div className="relative z-10">
            <motion.div
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Smartphone className="w-8 h-8 text-primary" />
            </motion.div>

            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-foreground mb-4">
              NapOnWheels App — Coming Soon
            </h2>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto mb-8">
              Book your berth in seconds, manage check-ins, and find sleep buses near you — all from your phone. Available soon on Android & iOS.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => openModal('I want early access to the NapOnWheels mobile app.')}
                className="px-8 py-4 bg-accent text-accent-foreground font-heading font-bold rounded-2xl hover:bg-accent/90 transition-all shadow-accent-glow"
              >
                Get Early Access
              </button>
            </div>

            <div className="flex justify-center gap-6 mt-6 text-sm text-muted-foreground">
              <span>📱 Android</span>
              <span>🍎 iOS</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AppComingSoon;
