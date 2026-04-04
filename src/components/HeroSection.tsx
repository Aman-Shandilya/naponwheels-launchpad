import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import heroBus from '@/assets/hero-bus.jpg';
import BookingSearch from './BookingSearch';

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={heroBus} alt="Luxury sleeper bus interior with comfortable berths" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 md:pt-32 md:pb-24 w-full flex flex-col items-center text-center">
        <div className="max-w-4xl flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/20 text-accent border border-accent/30 rounded-full text-sm font-semibold mb-8">
              <Clock className="w-4 h-4" />
              Coming Soon — Early Access Open
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-heading font-extrabold text-white leading-tight mb-6 text-balance"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Sleep Anywhere.<br />
            <span className="text-orange-500">Comfort on Wheels.</span>
          </motion.h1>

          <motion.p
            className="text-xl sm:text-2xl text-white/90 mb-12 leading-relaxed max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Book an affordable, clean sleeper berth in our parked luxury buses near major transport hubs. Rest by the hour.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="w-full"
          >
            <BookingSearch />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
