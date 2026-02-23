import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Frequent Traveler',
    text: 'I had a 6-hour layover in Bangalore. NapOnWheels saved my night — clean bed, great AC, and felt completely safe. Better than any budget hotel!',
    rating: 5,
  },
  {
    name: 'Rahul Verma',
    role: 'Night-Shift Worker',
    text: 'As a night shift worker, I needed a place to rest during the day. NapOnWheels is affordable, private, and right near my workplace. Absolutely love it.',
    rating: 5,
  },
  {
    name: 'Anita Desai',
    role: 'Student',
    text: 'Traveling between cities for exams, I used NapOnWheels twice. The berth was spotless and the digital check-in was seamless. Highly recommend!',
    rating: 4,
  },
];

const Testimonials = () => (
  <section className="section-padding bg-surface">
    <div className="container-narrow">
      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-foreground mb-4">
          What Our Guests Say
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Real stories from real travelers who chose rest over restlessness.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            className="glass-card p-6 relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Quote className="w-8 h-8 text-accent/30 absolute top-4 right-4" />
            <div className="flex gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star
                  key={j}
                  className={`w-4 h-4 ${j < t.rating ? 'text-accent fill-accent' : 'text-muted'}`}
                />
              ))}
            </div>
            <p className="text-foreground leading-relaxed mb-6 text-sm">{t.text}</p>
            <div>
              <p className="font-heading font-bold text-foreground">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
