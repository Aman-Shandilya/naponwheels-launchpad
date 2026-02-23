import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, Cctv, Phone, Heart, MapPinCheck } from 'lucide-react';

const features = [
  { icon: ShieldCheck, title: 'Verified Bus Owners', desc: 'Every bus and owner is verified through our trust & safety process.' },
  { icon: Sparkles, title: 'Cleanliness Standards', desc: 'Hospital-grade sanitization between every guest check-out.' },
  { icon: Cctv, title: 'CCTV Availability', desc: 'Round-the-clock surveillance in parking zones.' },
  { icon: Phone, title: 'Emergency Support', desc: '24/7 emergency helpline for all guests.' },
  { icon: Heart, title: 'Female-Friendly Options', desc: 'Dedicated sections with extra safety measures for women.' },
  { icon: MapPinCheck, title: 'Secure Locations', desc: 'Buses parked only in well-lit, monitored areas.' },
];

const SafetySection = () => (
  <section id="safety" className="section-padding bg-surface">
    <div className="container-narrow">
      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-foreground mb-4">
          Safety & Trust — Our Priority
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Your well-being matters. Every aspect of NapOnWheels is built with your safety in mind.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            className="flex gap-4 glass-card p-5"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <f.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-foreground mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SafetySection;
