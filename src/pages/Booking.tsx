import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Star, ArrowLeft, CheckCircle2, ShieldCheck, Info, CreditCard, Hotel, MapPin, Clock, Coffee, Wifi, Wind, User, Download, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from '@/components/ui/sonner';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

// Mock Data - Focused on Hubs and Stays
const MOCK_HUBS = [
  {
    id: '1',
    name: 'Kashmere Gate Premium Hub',
    busNumber: 'DL 01 NP 7788',
    location: 'Near ISBT Metro Gate 1',
    availableFrom: '24/7 Available',
    rating: 4.8,
    ratingCount: 1250,
    hourlyRate: 49,
    images: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1562610807-0d5fb0bd3a27?auto=format&fit=crop&q=80&w=600'
    ],
    features: ['High-Speed WiFi', 'Fresh Linen', 'AC Pods', 'Locker Facility'],
    amenities: [
      { icon: Wind, label: 'AC' },
      { icon: Wifi, label: 'Free WiFi' },
      { icon: Coffee, label: 'Beverages' }
    ]
  },
  {
    id: '2',
    name: 'Anand Vihar Executive Hub',
    busNumber: 'DL 01 NP 5522',
    location: 'ISBT Main Parking Area',
    availableFrom: 'Available Now',
    rating: 4.6,
    ratingCount: 840,
    hourlyRate: 49,
    images: [
      'https://images.unsplash.com/photo-1562610807-0d5fb0bd3a27?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=600'
    ],
    features: ['Clean Toilets', 'Charging Points', 'CCTV Security', 'Quiet Zone'],
    amenities: [
      { icon: Wind, label: 'AC' },
      { icon: Wifi, label: 'Free WiFi' }
    ]
  }
];

const POD_LAYOUT = {
  lower: [
    { id: 'L1', type: 'Window', price: 59, status: 'available' }, { id: 'gap', type: 'aisle' }, { id: 'L2', type: 'Side', price: 49, status: 'available' }, { id: 'L3', type: 'Side', price: 49, status: 'available' },
    { id: 'L4', type: 'Window', price: 59, status: 'booked' }, { id: 'gap', type: 'aisle' }, { id: 'L5', type: 'Side', price: 49, status: 'booked' }, { id: 'L6', type: 'Side', price: 49, status: 'booked' },
    { id: 'L7', type: 'Window', price: 59, status: 'available' }, { id: 'gap', type: 'aisle' }, { id: 'L8', type: 'Side', price: 49, status: 'available' }, { id: 'L9', type: 'Side', price: 49, status: 'available' },
    { id: 'L10', type: 'Window', price: 59, status: 'booked' }, { id: 'gap', type: 'aisle' }, { id: 'L11', type: 'Side', price: 49, status: 'available' }, { id: 'L12', type: 'Side', price: 49, status: 'available' },
    { id: 'L13', type: 'Window', price: 59, status: 'available' }, { id: 'gap', type: 'aisle' }, { id: 'L14', type: 'Side', price: 49, status: 'booked' }, { id: 'L15', type: 'Side', price: 49, status: 'booked' },
    { id: 'L16', type: 'Window', price: 59, status: 'available' }, { id: 'gap', type: 'aisle' }, { id: 'L17', type: 'Side', price: 49, status: 'available' }, { id: 'L18', type: 'Side', price: 49, status: 'available' },
  ],
  upper: [
    { id: 'U1', type: 'Window', price: 59, status: 'available' }, { id: 'gap', type: 'aisle' }, { id: 'U2', type: 'Side', price: 49, status: 'available' }, { id: 'U3', type: 'Side', price: 49, status: 'available' },
    { id: 'U4', type: 'Window', price: 59, status: 'booked' }, { id: 'gap', type: 'aisle' }, { id: 'U5', type: 'Side', price: 49, status: 'available' }, { id: 'U6', type: 'Side', price: 49, status: 'available' },
    { id: 'U7', type: 'Window', price: 59, status: 'available' }, { id: 'gap', type: 'aisle' }, { id: 'U8', type: 'Side', price: 49, status: 'booked' }, { id: 'U9', type: 'Side', price: 49, status: 'booked' },
    { id: 'U10', type: 'Window', price: 59, status: 'available' }, { id: 'gap', type: 'aisle' }, { id: 'U11', type: 'Side', price: 49, status: 'available' }, { id: 'U12', type: 'Side', price: 49, status: 'available' },
    { id: 'U13', type: 'Window', price: 59, status: 'available' }, { id: 'gap', type: 'aisle' }, { id: 'U14', type: 'Side', price: 49, status: 'available' }, { id: 'U15', type: 'Side', price: 49, status: 'available' },
    { id: 'U16', type: 'Window', price: 59, status: 'available' }, { id: 'gap', type: 'aisle' }, { id: 'U17', type: 'Side', price: 49, status: 'booked' }, { id: 'U18', type: 'Side', price: 49, status: 'booked' },
  ]
};

const Booking = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const step = parseInt(searchParams.get('step') || '1');
  
  const setStep = (newStep: number, replace = false) => {
     setSearchParams(params => {
       params.set('step', newStep.toString());
       return params;
     }, { replace });
   };

  const [selectedHub, setSelectedHub] = useState<typeof MOCK_HUBS[0] | null>(null);
  const [selectedPods, setSelectedPods] = useState<string[]>([]);
  const [stayHours, setStayHours] = useState<number>(3);
  const [checkInDate, setCheckInDate] = useState<string>('2026-04-04');
  const [checkInTime, setCheckInTime] = useState<string>('22:00');
  const [guestDetails, setGuestDetails] = useState<Record<string, { name: string; age: string; gender: string }>>({});
  const [contactInfo, setContactInfo] = useState({ email: '', phone: '' });
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Scroll to top and validate steps when step changes
   useEffect(() => {
     window.scrollTo(0, 0);

     // Validate current step requirements
     if (step > 1 && !selectedHub) {
       setStep(1, true);
     } else if (step > 2 && selectedPods.length === 0) {
       setStep(2, true);
     }
   }, [step, selectedHub, selectedPods.length]);

  const handleSelectHub = (hub: typeof MOCK_HUBS[0]) => {
    setSelectedHub(hub);
    setStep(2);
  };

  const handleTogglePod = (podId: string) => {
    setSelectedPods(prev => 
      prev.includes(podId) ? prev.filter(id => id !== podId) : [...prev, podId]
    );
  };

  const handleGuestInfoChange = (podId: string, field: string, value: string) => {
    setGuestDetails(prev => ({
      ...prev,
      [podId]: {
        ...(prev[podId] || { name: '', age: '', gender: 'Male' }),
        [field]: value
      }
    }));
  };

  const calculateTotalPrice = () => {
    const baseSum = selectedPods.reduce((total, podId) => {
      const pod = [...POD_LAYOUT.lower, ...POD_LAYOUT.upper].find(s => s.id === podId);
      return total + (pod?.price || 0);
    }, 0);
    return baseSum * stayHours;
  };

  const handleBack = () => {
    if (step > 1) {
      // Just navigate back in history to maintain state naturally
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleDownloadTicket = () => {
    toast.success('Downloading your ticket...');
    // In a real app, this would generate a PDF. For now, we simulate.
    setTimeout(() => {
      window.print();
    }, 1000);
  };

  const getCheckOutTime = () => {
    const [hours, minutes] = checkInTime.split(':').map(Number);
    const date = new Date(checkInDate);
    date.setHours(hours + stayHours, minutes);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const renderStepIndicator = () => (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 sticky top-16 z-40 overflow-x-auto scrollbar-hide transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-start lg:justify-center gap-6 lg:gap-12 text-[10px] lg:text-xs font-black uppercase tracking-widest whitespace-nowrap">
        {[
          { id: 1, label: 'Select Hub' },
          { id: 2, label: 'Choose Pods' },
          { id: 3, label: 'Guest Details' },
          { id: 4, label: 'Payment' },
          { id: 5, label: 'Confirmation' }
        ].map((s) => (
          <button 
            key={s.id} 
            onClick={() => s.id < step && setStep(s.id)}
            disabled={s.id >= step}
            className={`group relative flex items-center gap-2.5 transition-all py-2 ${step === s.id ? 'text-orange-600' : s.id < step ? 'text-slate-900 dark:text-white cursor-pointer' : 'text-slate-300 dark:text-slate-700 cursor-not-allowed'}`}
          >
            <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] transition-all duration-500 ${step === s.id ? 'border-orange-500 bg-orange-500 text-white scale-110 shadow-lg shadow-orange-200' : s.id < step ? 'border-slate-900 dark:border-white bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'border-slate-200 dark:border-slate-800'}`}>
              {s.id < step ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.id}
            </span>
            <span className="relative">
              {s.label}
              {step === s.id && (
                <motion.div 
                  layoutId="step-underline"
                  className="absolute -bottom-4 left-0 right-0 h-1 bg-orange-500 rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Header />
      
      {/* Search Context Header */}
      <div className="bg-white dark:bg-slate-900 pt-24 pb-4 px-4 shadow-sm border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button onClick={handleBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Stay in New Delhi Hubs
            </h1>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-orange-500" /> Kashmere Gate Area | <Clock className="w-3 h-3 text-orange-500" /> 3 Hours Stay
            </p>
          </div>
        </div>
      </div>

      {renderStepIndicator()}

      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="hub-list"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
              }}
              className="flex flex-col gap-6"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight text-balance">Available Nap Hubs</h2>
                <span className="text-sm font-bold text-slate-400">{MOCK_HUBS.length} Hubs Found</span>
              </div>
              
              {MOCK_HUBS.map((hub) => (
                <motion.div 
                  key={hub.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 lg:p-8 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row gap-8 hover:shadow-2xl hover:border-orange-100 dark:hover:border-orange-900/30 transition-all duration-300"
                >
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">Premium Hub</span>
                          <span className="text-slate-400 text-xs font-bold">• {hub.availableFrom}</span>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">{hub.name}</h2>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-orange-500" /> {hub.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-2 mb-1">
                          <span className="bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-current" /> {hub.rating}
                          </span>
                          <span className="text-slate-400 text-xs font-bold">{hub.ratingCount} reviews</span>
                        </div>
                        <p className="text-3xl font-black text-slate-900 dark:text-white">₹{hub.hourlyRate}<span className="text-sm text-slate-400 font-bold">/hr</span></p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                      {hub.amenities.map((amenity, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                            <amenity.icon className="w-4 h-4 text-slate-400" />
                          </div>
                          <span className="text-xs font-bold">{amenity.label}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {hub.features.map(f => (
                        <span key={f} className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-700 uppercase tracking-wider">{f}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="lg:w-80 flex flex-col gap-4">
                    <div className="relative group overflow-hidden rounded-[2rem] h-48">
                      <img src={hub.images[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Nap Hub Interior" />
                    </div>
                    <Button 
                      onClick={() => handleSelectHub(hub)}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-8 rounded-2xl text-lg shadow-xl shadow-orange-500/20 active:scale-95 transition-all"
                    >
                      Book Your Pod
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {step === 2 && selectedHub && (
            <motion.div 
              key="pod-selection"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Pod Map */}
              <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 lg:p-10 shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                  {/* Lower Deck Pods */}
                  <div className="flex-1 bg-slate-50/50 dark:bg-slate-800/50 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="font-black text-slate-900 dark:text-white text-lg">Lower deck</h3>
                      <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600 border-t-slate-600 dark:border-t-slate-300 rotate-45" />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-x-2 gap-y-4">
                      {POD_LAYOUT.lower.map((pod, idx) => (
                        pod.id === 'gap' ? (
                          <div key={`gap-lower-${idx}`} className="w-4" />
                        ) : (
                          <motion.button
                            key={pod.id}
                            disabled={pod.status === 'booked'}
                            onClick={() => handleTogglePod(pod.id)}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: idx * 0.02 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`
                              h-20 rounded-xl border-[1.5px] flex flex-col items-center justify-between py-2 transition-all relative
                              ${pod.status === 'booked' ? 'bg-[#F1F5F9] dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 cursor-not-allowed' : 
                                selectedPods.includes(pod.id) ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-500 ring-2 ring-orange-500/20' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-700'}
                            `}
                          >
                            <div className={`w-1/2 h-1 rounded-full absolute bottom-1 transition-colors duration-300 ${pod.status === 'booked' ? 'bg-slate-300 dark:bg-slate-700' : selectedPods.includes(pod.id) ? 'bg-orange-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
                            <div className="flex flex-col items-center">
                              <span className={`text-[8px] font-black uppercase tracking-tighter ${pod.status === 'booked' ? 'text-slate-400 dark:text-slate-500' : 'text-slate-400 dark:text-slate-500'}`}>{pod.type}</span>
                              <span className={`text-[10px] font-black ${pod.status === 'booked' ? 'text-slate-300 dark:text-600' : 'text-slate-900 dark:text-white'}`}>{pod.id}</span>
                            </div>
                            <span className={`text-[10px] font-black ${pod.status === 'booked' ? 'text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                              {pod.status === 'booked' ? 'Sold' : `₹${pod.price}`}
                            </span>
                          </motion.button>
                        )
                      ))}
                    </div>
                  </div>

                  {/* Upper Deck Pods */}
                  <div className="flex-1 bg-slate-50/50 dark:bg-slate-800/50 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="font-black text-slate-900 dark:text-white text-lg">Upper deck</h3>
                    </div>
                    <div className="grid grid-cols-4 gap-x-2 gap-y-4">
                      {POD_LAYOUT.upper.map((pod, idx) => (
                        pod.id === 'gap' ? (
                          <div key={`gap-upper-${idx}`} className="w-4" />
                        ) : (
                          <motion.button
                            key={pod.id}
                            disabled={pod.status === 'booked'}
                            onClick={() => handleTogglePod(pod.id)}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: (idx + 18) * 0.02 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`
                              h-20 rounded-xl border-[1.5px] flex flex-col items-center justify-between py-2 transition-all relative
                              ${pod.status === 'booked' ? 'bg-[#F1F5F9] dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 cursor-not-allowed' : 
                                selectedPods.includes(pod.id) ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-500 ring-2 ring-orange-500/20' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-700'}
                            `}
                          >
                            <div className={`w-1/2 h-1 rounded-full absolute bottom-1 transition-colors duration-300 ${pod.status === 'booked' ? 'bg-slate-300 dark:bg-slate-700' : selectedPods.includes(pod.id) ? 'bg-orange-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
                            <div className="flex flex-col items-center">
                              <span className={`text-[8px] font-black uppercase tracking-tighter ${pod.status === 'booked' ? 'text-slate-400 dark:text-slate-500' : 'text-slate-400 dark:text-slate-500'}`}>{pod.type}</span>
                              <span className={`text-[10px] font-black ${pod.status === 'booked' ? 'text-slate-300 dark:text-600' : 'text-slate-900 dark:text-white'}`}>{pod.id}</span>
                            </div>
                            <span className={`text-[10px] font-black ${pod.status === 'booked' ? 'text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                              {pod.status === 'booked' ? 'Sold' : `₹${pod.price}`}
                            </span>
                          </motion.button>
                        )
                      ))}
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-8 justify-center">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-lg border-[1.5px] border-slate-200 dark:border-slate-700" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-lg bg-[#F1F5F9] dark:bg-slate-800/50 border-[1.5px] border-slate-200 dark:border-slate-700" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Occupied</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-lg bg-orange-50 dark:bg-orange-900/20 border-[1.5px] border-orange-500" />
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Selected</span>
                  </div>
                </div>
              </div>

              {/* Booking Summary */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800 sticky top-32">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400">
                      <Hotel className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{selectedHub.name}</h2>
                      <p className="text-xs font-bold text-slate-400 mt-1">{selectedHub.location}</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex flex-col gap-4 py-3 border-b border-slate-50 dark:border-slate-800">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Stay Date</span>
                        <input 
                          type="date" 
                          value={checkInDate}
                          onChange={(e) => setCheckInDate(e.target.value)}
                          className="text-sm font-bold text-slate-900 dark:text-white border-none bg-transparent focus:ring-0 cursor-pointer"
                        />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Check-in Time</span>
                        <input 
                          type="time" 
                          value={checkInTime}
                          onChange={(e) => setCheckInTime(e.target.value)}
                          className="text-sm font-bold text-slate-900 dark:text-white border-none bg-transparent focus:ring-0 cursor-pointer"
                        />
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Stay Duration</span>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => setStayHours(Math.max(1, stayHours - 1))}
                            className="w-6 h-6 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:border-orange-500 hover:text-orange-500 transition-all"
                          >
                            -
                          </button>
                          <span className="text-sm font-bold text-slate-900 dark:text-white">{stayHours} Hours</span>
                          <button 
                            onClick={() => setStayHours(Math.min(24, stayHours + 1))}
                            className="w-6 h-6 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:border-orange-500 hover:text-orange-500 transition-all"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Check-out Time</span>
                        <span className="text-sm font-bold text-orange-600 dark:text-orange-400">{getCheckOutTime()}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-start py-3 border-b border-slate-50 dark:border-slate-800">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Pods Selected</span>
                      <div className="flex flex-wrap gap-1 justify-end max-w-[150px]">
                        {selectedPods.length > 0 ? selectedPods.map(id => (
                          <span key={id} className="text-[10px] font-black bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded">{id}</span>
                        )) : <span className="text-sm font-bold text-slate-900 dark:text-white">Please select</span>}
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-3">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Total Amount</span>
                      <span className="text-2xl font-black text-slate-900 dark:text-white">₹{calculateTotalPrice()}</span>
                    </div>
                  </div>

                  <Button 
                    disabled={selectedPods.length === 0}
                    onClick={() => {
                      if (!user) {
                        toast.info('Please sign in to continue', {
                          description: 'You need to be logged in to confirm your booking.'
                        });
                        navigate('/auth', { state: { returnTo: '/booking?step=2' } });
                        return;
                      }
                      setStep(3);
                    }}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-7 rounded-2xl text-lg shadow-xl shadow-orange-500/20 disabled:opacity-50"
                  >
                    Confirm & Proceed
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="guest-info"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 lg:p-12 shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400">
                    <User className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">Guest Details</h2>
                    <p className="text-sm font-bold text-slate-400">Please fill details for each selected pod</p>
                  </div>
                </div>

                <div className="space-y-12">
                  {selectedPods.map((podId, index) => (
                    <div key={podId} className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                      <h3 className="text-sm font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-[10px]">{index + 1}</span>
                        Guest for Pod {podId}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                          <input 
                            type="text" 
                            value={guestDetails[podId]?.name || ''}
                            onChange={(e) => handleGuestInfoChange(podId, 'name', e.target.value)}
                            placeholder="John Doe" 
                            className="bg-white dark:bg-slate-900 border-none rounded-xl px-5 py-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all shadow-sm" 
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Age</label>
                          <input 
                            type="number" 
                            value={guestDetails[podId]?.age || ''}
                            onChange={(e) => handleGuestInfoChange(podId, 'age', e.target.value)}
                            placeholder="25" 
                            className="bg-white dark:bg-slate-900 border-none rounded-xl px-5 py-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all shadow-sm" 
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Gender</label>
                          <select 
                            value={guestDetails[podId]?.gender || 'Male'}
                            onChange={(e) => handleGuestInfoChange(podId, 'gender', e.target.value)}
                            className="bg-white dark:bg-slate-900 border-none rounded-xl px-5 py-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none appearance-none shadow-sm"
                          >
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="p-8 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[2rem]">
                    <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Email ID</label>
                        <input 
                          type="email" 
                          value={contactInfo.email}
                          onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="john@example.com" 
                          className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-5 py-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all" 
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Mobile Number</label>
                        <input 
                          type="tel" 
                          value={contactInfo.phone}
                          onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+91 98765 43210" 
                          className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-5 py-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all" 
                        />
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => setStep(4)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-8 rounded-2xl text-xl shadow-xl shadow-orange-500/20"
                  >
                    Proceed to Payment
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && selectedHub && selectedPods.length > 0 && (
            <motion.div 
              key="payment"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 lg:p-12 shadow-xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-5 mb-10">
                  <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-2xl text-green-600 dark:text-green-400">
                    <CreditCard className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">Secure Payment</h2>
                    <p className="text-sm font-bold text-slate-400">{selectedPods.length} Pods Reserved</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-5">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Stay Duration</span>
                      <span className="text-sm font-black text-slate-900 dark:text-white">{stayHours} Hours</span>
                    </div>
                    <div className="flex justify-between items-center mb-5">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Hub Location</span>
                      <span className="text-sm font-black text-slate-900 dark:text-white">{selectedHub.name}</span>
                    </div>
                    <div className="flex justify-between items-start mb-5">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Reserved Pods</span>
                      <div className="flex flex-wrap gap-1 justify-end max-w-[200px]">
                        {selectedPods.map(id => (
                          <span key={id} className="text-[10px] font-black bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded">{id}</span>
                        ))}
                      </div>
                    </div>
                    <div className="h-px bg-slate-200 dark:bg-slate-700 my-6" />
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest">Total Stay Fee</span>
                      <span className="text-3xl font-black text-orange-600 dark:text-orange-500">
                        ₹{calculateTotalPrice()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Card Number</label>
                        <input type="text" placeholder="XXXX XXXX XXXX 1234" className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-5 py-4 text-sm font-bold text-slate-900 dark:text-white focus:border-orange-500 outline-none transition-all" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Expiry Date</label>
                        <input type="text" placeholder="MM / YY" className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-5 py-4 text-sm font-bold text-slate-900 dark:text-white focus:border-orange-500 outline-none transition-all" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-5 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                    <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <p className="text-[11px] font-bold text-blue-900 dark:text-blue-400 leading-relaxed">
                      Your payment is encrypted and secure. We never store your card information.
                    </p>
                  </div>

                  <Button 
                    onClick={() => {
                      toast.success('Payment Received!');
                      setStep(5, true);
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-8 rounded-2xl text-xl shadow-xl shadow-green-600/20 active:scale-95 transition-all"
                  >
                    Confirm Stay & Pay
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 5 && selectedHub && selectedPods.length > 0 && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-3xl mx-auto text-center print:m-0 print:p-0"
            >
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 lg:p-12 shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center print:shadow-none print:border-none">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-8 print:hidden">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Booking Confirmed!</h2>
                <p className="text-slate-500 dark:text-slate-400 font-bold mb-10 print:hidden">Thank you for choosing NapOnWheels.</p>
                
                {/* Digital Ticket */}
                <motion.div 
                  initial={{ opacity: 0, y: 40, rotateX: -15 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ type: "spring", duration: 1, bounce: 0.3, delay: 0.2 }}
                  className="w-full bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 p-8 text-left relative overflow-hidden shadow-inner"
                >
                  <div className="absolute top-0 right-0 bg-orange-500 text-white px-6 py-2 rounded-bl-2xl font-black text-[10px] uppercase tracking-widest">
                    Official Ticket
                  </div>
                  
                  <div className="flex flex-col md:flex-row justify-between gap-8 mb-10 border-b border-slate-100 dark:border-slate-800 pb-8">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">Hub Name</span>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">{selectedHub.name}</h3>
                      <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-orange-500" /> {selectedHub.location}
                      </p>
                    </div>
                    <div className="md:text-right">
                      <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">Bus Registration</span>
                      <span className="text-lg font-black text-slate-900 dark:text-white px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">{selectedHub.busNumber}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 border-b border-slate-100 dark:border-slate-800 pb-8">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">Date</span>
                      <span className="text-sm font-black text-slate-900 dark:text-white">{new Date(checkInDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">Check-in</span>
                      <span className="text-sm font-black text-slate-900 dark:text-white">{checkInTime}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">Check-out</span>
                      <span className="text-sm font-black text-orange-600 dark:text-orange-400">{getCheckOutTime()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">Duration</span>
                      <span className="text-sm font-black text-slate-900 dark:text-white">{stayHours} Hours</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-4">Guest Assignments</span>
                    <div className="space-y-3">
                      {selectedPods.map((podId) => (
                        <div key={podId} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-800">
                              <User className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-sm font-black text-slate-900 dark:text-white">{guestDetails[podId]?.name || 'Guest'}</span>
                              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block">{guestDetails[podId]?.age} Yrs • {guestDetails[podId]?.gender}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Pod No.</span>
                            <span className="text-sm font-black text-orange-600 dark:text-orange-400">{podId}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 max-w-xs">
                      Please carry a valid physical ID proof for check-in. This digital ticket is valid only at {selectedHub.name}.
                    </p>
                    <div className="flex gap-3 print:hidden">
                      <Button 
                        onClick={handleDownloadTicket}
                        variant="outline"
                        className="flex items-center gap-2 border-slate-200 dark:border-slate-700 font-bold dark:text-white dark:hover:bg-slate-800"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                      <Button 
                        onClick={() => window.print()}
                        variant="outline"
                        className="flex items-center gap-2 border-slate-200 dark:border-slate-700 font-bold dark:text-white dark:hover:bg-slate-800"
                      >
                        <Printer className="w-4 h-4" />
                        Print
                      </Button>
                    </div>
                  </div>
                </motion.div>

                <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full print:hidden">
                  <Button 
                    onClick={() => navigate('/')}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-black py-7 rounded-2xl text-lg shadow-xl shadow-orange-500/20 active:scale-95 transition-all"
                  >
                    Book Another Stay
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default Booking;
