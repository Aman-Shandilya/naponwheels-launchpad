import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLeadModal } from '@/contexts/LeadModalContext';

const FinalCTA = () => {
  const { openModal } = useLeadModal();

  return (
    <section id="contact" className="relative section-padding overflow-hidden">
      <div className="absolute inset-0 gradient-bg" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_transparent_50%,_hsl(var(--background)/0.3))]" />

      <div className="relative z-10 container-narrow text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-primary-foreground mb-6 text-balance">
            Your Bed Is Waiting — Wherever You Are.
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto mb-8">
            Join thousands of smart travelers who chose comfort, safety, and affordability. Start your NapOnWheels journey today.
          </p>
          <button
            onClick={() => openModal()}
            className="px-10 py-4 bg-accent text-accent-foreground font-heading font-bold text-lg rounded-2xl hover:bg-accent/90 transition-all shadow-accent-glow inline-flex items-center gap-2"
          >
            Book Your Berth Now
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
