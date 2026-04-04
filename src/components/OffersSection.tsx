import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Copy, Check } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const offers = [
  {
    code: 'FIRSTNAP',
    description: 'Flat 20% off on your first nap!',
    bgColor: 'bg-[#FFEDD5] dark:bg-orange-950/30',
    textColor: 'text-orange-600 dark:text-orange-400',
    iconColor: 'text-orange-600 dark:text-orange-400',
  },
  {
    code: 'NIGHT50',
    description: '₹50 off on overnight bookings!',
    bgColor: 'bg-[#F1F5F9] dark:bg-slate-800/50',
    textColor: 'text-orange-600 dark:text-orange-400',
    iconColor: 'text-orange-600 dark:text-orange-400',
  },
  {
    code: 'BUDDY10',
    description: '10% off when you book 2+ berths!',
    bgColor: 'bg-[#FEF9C3] dark:bg-yellow-950/30',
    textColor: 'text-orange-600 dark:text-orange-400',
    iconColor: 'text-orange-600 dark:text-orange-400',
  },
];

const OfferCard = ({ code, description, bgColor, textColor, iconColor }: typeof offers[0]) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(`Code ${text} copied to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`${bgColor} p-6 rounded-[2rem] flex flex-col gap-3 shadow-sm border border-black/5 dark:border-white/5 min-w-[280px] flex-1`}
    >
      <div className="flex items-center gap-2">
        <Gift className={`w-5 h-5 ${iconColor}`} />
        <span className={`font-black text-lg tracking-wider ${textColor}`}>{code}</span>
      </div>
      <p className="text-slate-800 dark:text-slate-200 font-semibold text-base leading-snug">
        {description}
      </p>
      <button
        onClick={() => copyToClipboard(code)}
        className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-2xl flex items-center gap-2.5 w-fit transition-all text-sm font-bold border border-slate-100 dark:border-slate-800 shadow-sm mt-1"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-green-500" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            <span>Copy Code</span>
          </>
        )}
      </button>
    </motion.div>
  );
};

const OffersSection = () => {
  return (
    <section className="py-24 bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-heading font-extrabold text-[#1E293B] dark:text-white mb-4">
            Exclusive Offers
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg sm:text-xl font-medium">
            Save more on every rest session
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {offers.map((offer) => (
            <OfferCard key={offer.code} {...offer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OffersSection;
