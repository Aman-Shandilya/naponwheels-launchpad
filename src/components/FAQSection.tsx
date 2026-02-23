import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  { q: 'Is it safe to sleep in a parked bus?', a: 'Absolutely. All buses are parked in verified, well-lit, CCTV-monitored locations. Every bus owner is background-verified and our platform provides 24/7 emergency support.' },
  { q: 'How is this different from hotels?', a: 'NapOnWheels offers affordable hourly stays near transport hubs — no full-night booking required. Think of it as a capsule hotel on wheels, designed for travelers who need a quick rest.' },
  { q: 'Can I book for just a few hours?', a: 'Yes! That\'s our specialty. You can book for as little as 2 hours. Perfect for layovers, transit breaks, or quick power naps.' },
  { q: 'Are the buses stationary during my stay?', a: 'Yes, all buses are completely stationary and parked in designated safe zones. They do not move during your booking period.' },
  { q: 'Who can use NapOnWheels?', a: 'Anyone! Travelers, students, night-shift workers, drivers, pilgrims, tourists — anyone who needs a safe, affordable place to rest during their journey.' },
  { q: 'How do I check in?', a: 'You receive a digital access code on your phone after booking. Simply show the code at the bus and you\'re in. No paperwork, no queues.' },
];

const FAQSection = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="section-padding bg-background">
      <div className="container-narrow max-w-3xl">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Got questions? We've got answers.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className="glass-card overflow-hidden"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-6 py-4 flex items-center justify-between text-left"
                aria-expanded={open === i}
              >
                <span className="font-heading font-semibold text-foreground pr-4">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`} />
              </button>
              <motion.div
                initial={false}
                animate={{ height: open === i ? 'auto' : 0, opacity: open === i ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <p className="px-6 pb-4 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
