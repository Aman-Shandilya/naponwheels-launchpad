import { motion } from 'framer-motion';
import { Star, Snowflake, BatteryCharging, Shield, Sparkles } from 'lucide-react';
import { useLeadModal } from '@/contexts/LeadModalContext';
import heroBus from '@/assets/hero-bus.jpg';

const buses = [
  {
    name: 'Volvo Sleeper Deluxe',
    location: 'Bangalore Majestic Bus Stand',
    priceHour: '₹55/hr',
    priceNight: '₹599/night',
    rating: 4.8,
    amenities: ['AC', 'Charging', 'Blanket', 'Security'],
    image: '/volvo-bus.jpg',
    clean: true,
    verified: true,
  },
  {
    name: 'Scania Premium Pod',
    location: 'Delhi ISBT Kashmere Gate',
    priceHour: '₹59/hr',
    priceNight: '₹799/night',
    rating: 4.9,
    amenities: ['AC', 'Charging', 'Blanket', 'Security'],
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=250&fit=crop',
    clean: true,
    verified: true,
  },
  {
    name: 'Comfort Plus Sleeper',
    location: 'Mumbai Dadar Station',
    priceHour: '₹50/hr',
    priceNight: '₹499/night',
    rating: 4.7,
    amenities: ['AC', 'Charging', 'Security'],
    image: 'https://images.unsplash.com/photo-1557223562-6c77ef16210f?w=400&h=250&fit=crop',
    clean: true,
    verified: true,
  },
];

const amenityIcons: Record<string, React.ElementType> = {
  AC: Snowflake,
  Charging: BatteryCharging,
  Blanket: Sparkles,
  Security: Shield,
};

const FeaturedBuses = () => {
  const { openModal } = useLeadModal();

  return (
    <section className="section-padding bg-background">
      <div className="container-narrow">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-foreground mb-4">
            Featured Sleep Buses
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Browse some of our top-rated sleeper buses available for booking.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buses.map((bus, i) => (
            <motion.div
              key={bus.name}
              className="glass-card-strong overflow-hidden group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={bus.image}
                  alt={`${bus.name} sleeper bus`}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = heroBus;
                  }}
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {bus.verified && (
                    <span className="px-2.5 py-1 bg-primary/90 text-primary-foreground text-xs font-bold rounded-full">
                      Safety Verified
                    </span>
                  )}
                  {bus.clean && (
                    <span className="px-2.5 py-1 bg-accent/90 text-accent-foreground text-xs font-bold rounded-full">
                      Sanitized
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-heading font-bold text-foreground">{bus.name}</h3>
                  <div className="flex items-center gap-1 text-accent">
                    <Star className="w-4 h-4 fill-accent" />
                    <span className="text-sm font-semibold">{bus.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{bus.location}</p>

                <div className="flex gap-3 mb-4">
                  {bus.amenities.map(a => {
                    const Icon = amenityIcons[a];
                    return (
                      <div key={a} className="flex items-center gap-1 text-xs text-muted-foreground">
                        {Icon && <Icon className="w-3.5 h-3.5" />}
                        {a}
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-lg font-heading font-bold text-foreground">{bus.priceHour}</span>
                    <span className="text-xs text-muted-foreground ml-2">{bus.priceNight}</span>
                  </div>
                  <button
                    onClick={() => openModal(`I'm interested in booking the ${bus.name} at ${bus.location}.`)}
                    className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBuses;
