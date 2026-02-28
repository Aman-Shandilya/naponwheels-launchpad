import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const locations = [
  { name: 'Bangalore', buses: 12, x: '62%', y: '72%' },
  { name: 'Mumbai', buses: 8, x: '30%', y: '52%' },
  { name: 'Delhi', buses: 15, x: '42%', y: '18%' },
  { name: 'Chennai', buses: 6, x: '58%', y: '78%' },
  { name: 'Hyderabad', buses: 9, x: '50%', y: '58%' },
  { name: 'Pune', buses: 5, x: '35%', y: '55%' },
];

const MapPreview = () => (
  <section className="section-padding bg-background">
    <div className="container-narrow">
      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-foreground mb-4">
          Available Near You
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Find sleep buses across major Indian cities and transport hubs.
        </p>
      </motion.div>

      <motion.div
        className="glass-card-strong relative overflow-hidden rounded-3xl h-[400px] md:h-[500px]"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        {/* Stylized map background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-glow/5 to-accent/5">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          />
        </div>

        {/* Location pins */}
        {locations.map((loc, i) => (
          <motion.div
            key={loc.name}
            className="absolute group cursor-pointer"
            style={{ left: loc.x, top: loc.y }}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.1 }}
          >
            <div className="relative">
              <div className="absolute -inset-3 bg-accent/20 rounded-full animate-pulse-soft" />
              <MapPin
                className="w-8 h-8 text-accent drop-shadow-lg relative z-10"
                fill="hsl(var(--accent))"
              />
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 -top-14 bg-card shadow-elevated px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
              <p className="text-sm font-heading font-bold text-foreground">{loc.name}</p>
              <p className="text-xs text-muted-foreground">{loc.buses} buses available</p>
            </div>
          </motion.div>
        ))}

        {/* Center label */}
        <div className="absolute bottom-6 left-6 bg-card/90 backdrop-blur-sm px-4 py-2.5 rounded-xl shadow-soft">
          <p className="font-heading font-bold text-foreground text-sm">🇮🇳 India</p>
          <p className="text-xs text-muted-foreground">55+ buses across 50+ cities</p>
        </div>
      </motion.div>
    </div>
  </section>
);

export default MapPreview;
