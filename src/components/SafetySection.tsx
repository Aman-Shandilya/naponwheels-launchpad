import { motion } from 'framer-motion';
import {
  ShieldCheck,
  UserCheck,
  Users,
  Sun,
  Cctv,
  Phone,
  Lock,
  AlertCircle,
  MapPin,
  Navigation,
  Sparkles,
  CreditCard,
  Flame,
  LifeBuoy,
} from 'lucide-react';

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
          Women &amp; Passenger Safety First
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Rest peacefully — your safety is our highest priority.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* left column: women safety */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-4 bg-white/50 dark:bg-white/5 p-6 rounded-3xl backdrop-blur-sm"
        >
          <h3 className="text-xl font-heading font-semibold text-foreground mb-4">
            Women Safety
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
              <UserCheck className="w-5 h-5 text-primary shrink-0" />
              <span>Verified drivers and staff</span>
            </li>
            <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
              <Users className="w-5 h-5 text-primary shrink-0" />
              <span>Women-friendly zones and optional women-only buses (coming soon)</span>
            </li>
            <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
              <Sun className="w-5 h-5 text-primary shrink-0" />
              <span>Well-lit, secure parking locations</span>
            </li>
            <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
              <Cctv className="w-5 h-5 text-primary shrink-0" />
              <span>CCTV surveillance inside and outside the bus</span>
            </li>
            <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
              <Phone className="w-5 h-5 text-primary shrink-0" />
              <span>Emergency contact support</span>
            </li>
            <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
              <Lock className="w-5 h-5 text-primary shrink-0" />
              <span>Controlled entry — only verified passengers allowed</span>
            </li>
            <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
              <AlertCircle className="w-5 h-5 text-primary shrink-0" />
              <span>Panic alert feature (future app feature)</span>
            </li>
          </ul>
          <p className="mt-3 text-sm text-muted-foreground italic">
            Designed so women can travel and rest with confidence.
          </p>
        </motion.div>

        {/* right column: passenger safety */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-4 bg-white/50 dark:bg-white/5 p-6 rounded-3xl backdrop-blur-sm"
        >
          <h3 className="text-xl font-heading font-semibold text-foreground mb-4">
            Passenger Safety
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
              <MapPin className="w-5 h-5 text-primary shrink-0" />
              <span>Buses remain stationary at approved secure locations</span>
            </li>
            <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
              <Navigation className="w-5 h-5 text-primary shrink-0" />
              <span>GPS-tracked parking areas</span>
            </li>
            <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
              <Sparkles className="w-5 h-5 text-primary shrink-0" />
              <span>Sanitized and clean berths for every passenger</span>
            </li>
            <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
              <CreditCard className="w-5 h-5 text-primary shrink-0" />
              <span>Cashless, secure digital payments</span>
            </li>
            <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
              <Flame className="w-5 h-5 text-primary shrink-0" />
              <span>Fire safety equipment on every bus</span>
            </li>
            <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
              <LifeBuoy className="w-5 h-5 text-primary shrink-0" />
              <span>24/7 passenger assistance</span>
            </li>
            <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
              <span>Insurance coverage for every stay (coming soon)</span>
            </li>
          </ul>
          <p className="mt-3 text-sm text-muted-foreground italic">
            Committed to making your rest journey worry-free.
          </p>
        </motion.div>
      </div>

      {/* trust badge callout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 text-center"
      >
        <div className="inline-block px-6 py-4 bg-accent/10 border border-accent rounded-xl shadow-sm">
          <span className="text-accent font-semibold">
            Safe by Design — Every bus is verified before listing.
          </span>
        </div>
      </motion.div>
    </div>
  </section>
);

export default SafetySection;
