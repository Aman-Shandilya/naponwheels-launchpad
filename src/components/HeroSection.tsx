import { motion } from 'framer-motion';
import { ArrowRight, Shield, Star, Clock } from 'lucide-react';
import { useLeadModal } from '@/contexts/LeadModalContext';
import heroBus from '@/assets/hero-bus.jpg';

const HeroSection = () => {
  const { openModal } = useLeadModal();

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={heroBus} alt="Luxury sleeper bus interior with comfortable berths" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-foreground/30 dark:from-background/90 dark:via-background/70 dark:to-background/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 md:pt-32 md:pb-24 w-full">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/20 text-accent border border-accent/30 rounded-full text-sm font-semibold mb-6">
              <Clock className="w-4 h-4" />
              Coming Soon — Early Access Open
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-primary-foreground leading-tight mb-6 text-balance"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Sleep Anywhere.{' '}
            <span className="text-accent">Comfort on Wheels.</span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-primary-foreground/80 mb-8 leading-relaxed max-w-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Book a clean, safe sleeper berth in a parked luxury bus — anytime, anywhere.
            Affordable hourly stays near transport hubs, tailored for travelers.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            <button
              onClick={() => openModal()}
              className="px-8 py-4 bg-accent text-accent-foreground font-heading font-bold text-lg rounded-2xl hover:bg-accent/90 transition-all shadow-accent-glow flex items-center justify-center gap-2"
            >
              Discover Sleeper Buses
              <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="#how-it-works"
              className="px-8 py-4 bg-primary-foreground/10 text-primary-foreground border border-primary-foreground/20 font-heading font-semibold text-lg rounded-2xl hover:bg-primary-foreground/20 transition-all text-center backdrop-blur-sm"
            >
              Learn More
            </a>
          </motion.div>

          <motion.div
            className="flex flex-wrap gap-6 mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {[
              { icon: Shield, text: 'Safety Verified' },
              { icon: Star, text: '4.8★ Rated' },
              { icon: Clock, text: 'Hourly Booking' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-primary-foreground/70 text-sm">
                <Icon className="w-4 h-4 text-accent" />
                {text}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
