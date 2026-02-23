import { motion } from 'framer-motion';
import { Clock, IndianRupee, Lock, MapPin, Zap, Bed } from 'lucide-react';

const benefits = [
  { icon: IndianRupee, title: 'Affordable Hourly Pricing', desc: 'Pay only for the hours you rest. No full-night charges.' },
  { icon: Clock, title: 'No Full-Night Booking', desc: 'Need 2 hours? Book 2 hours. Total flexibility.' },
  { icon: Lock, title: 'Private Berth', desc: 'Your own personal space with privacy curtains.' },
  { icon: MapPin, title: 'Near Transport Hubs', desc: 'Located close to bus stands, railway stations & airports.' },
  { icon: Zap, title: 'Quick Check-In', desc: 'Digital check-in takes under 30 seconds.' },
  { icon: Bed, title: 'Comfortable Sleeper Beds', desc: 'Premium mattresses and clean bedding every time.' },
];

const BenefitsSection = () => (
  <section className="section-padding bg-background">
    <div className="container-narrow">
      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-foreground mb-4">
          Why Choose NapOnWheels Over Hotels?
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Everything you need for a quick, comfortable rest — at a fraction of the cost.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((b, i) => (
          <motion.div
            key={b.title}
            className="glass-card p-6 group hover:shadow-glow transition-shadow duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
              <b.icon className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-heading font-bold text-foreground mb-2">{b.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default BenefitsSection;
