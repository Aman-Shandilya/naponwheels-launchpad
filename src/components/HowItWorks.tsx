import { motion } from 'framer-motion';
import { MapPin, Bed, Smartphone, Coffee } from 'lucide-react';

const steps = [
  { icon: MapPin, title: 'Find a Nearby Sleep Bus', desc: 'Browse available sleeper buses parked near you or your destination.' },
  { icon: Bed, title: 'Choose Berth & Time', desc: 'Select your preferred berth type and booking duration — hourly or overnight.' },
  { icon: Smartphone, title: 'Check In Digitally', desc: 'Get instant access via your phone. No paperwork, no queues.' },
  { icon: Coffee, title: 'Rest & Leave Refreshed', desc: 'Enjoy a comfortable nap and check out whenever you\'re ready.' },
];

const HowItWorks = () => (
  <section id="how-it-works" className="section-padding bg-surface">
    <div className="container-narrow">
      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-foreground mb-4">
          How It Works
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          From finding a bus to resting comfortably — it's as easy as 1-2-3-4.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            className="glass-card p-6 text-center relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <step.icon className="w-7 h-7 text-primary" />
            </div>
            <span className="absolute top-4 right-4 text-4xl font-heading font-extrabold text-muted/60">
              {i + 1}
            </span>
            <h3 className="font-heading font-bold text-foreground mb-2">{step.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
