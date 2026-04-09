import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Calendar, Clock, Search, LocateFixed } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/sonner';

const DELHI_LOCATIONS = [
  "Kashmere Gate ISBT",
  "Anand Vihar ISBT",
  "Sarai Kale Khan ISBT",
  "New Delhi Railway Station",
  "Old Delhi Railway Station",
  "Hazrat Nizamuddin Railway Station",
  "IGI Airport Terminal 1",
  "IGI Airport Terminal 3",
  "Majnu Ka Tilla",
  "Dhaula Kuan",
  "AIIMS Metro Station",
  "Rajiv Chowk Metro Station",
  "Chandni Chowk",
  "Karol Bagh",
  "Paharganj",
  "Connaught Place",
  "Lajpat Nagar",
  "Nehru Place",
  "Dwarka Sector 21",
  "Rohini Sector 18",
  "Mundka",
  "Botanical Garden (Noida)",
  "Huda City Centre (Gurgaon)",
  "Sikanderpur (Gurgaon)",
];

const generateTimeSlots = () => {
  const slots: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hour = h % 12 === 0 ? 12 : h % 12;
      const ampm = h < 12 ? 'AM' : 'PM';
      const min = m.toString().padStart(2, '0');
      slots.push(`${hour}:${min} ${ampm}`);
    }
  }
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

const DURATION_OPTIONS = [
  ...Array.from({ length: 23 }, (_, i) => `${i + 1} Hour${i + 1 > 1 ? 's' : ''}`),
  'Full Day (24 Hours)',
];

const BookingSearch = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [location, setLocation] = useState('');
  const [showLocations, setShowLocations] = useState(false);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkInTime, setCheckInTime] = useState('10:00 PM');
  const [duration, setDuration] = useState('3 Hours');
  
  const [detectingLocation, setDetectingLocation] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);

  const filteredLocations = DELHI_LOCATIONS.filter((loc) =>
    loc.toLowerCase().includes(location.toLowerCase())
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setShowLocations(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported by your browser');
      return;
    }
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const hubs: Record<string, [number, number]> = {
          "Kashmere Gate ISBT": [28.6674, 77.2284],
          "Anand Vihar ISBT": [28.6469, 77.3156],
          "Sarai Kale Khan ISBT": [28.5893, 77.2567],
          "New Delhi Railway Station": [28.6424, 77.2195],
          "Old Delhi Railway Station": [28.6583, 77.2281],
          "IGI Airport Terminal 3": [28.5562, 77.0872],
          "Connaught Place": [28.6315, 77.2167],
          "Rajiv Chowk Metro Station": [28.6328, 77.2197],
        };
        let nearest = DELHI_LOCATIONS[0];
        let minDist = Infinity;
        for (const [name, [lat, lng]] of Object.entries(hubs)) {
          const d = Math.sqrt((lat - latitude) ** 2 + (lng - longitude) ** 2);
          if (d < minDist) { minDist = d; nearest = name; }
        }
        setLocation(nearest);
        setDetectingLocation(false);
        toast.success(`Nearest hub: ${nearest}`);
      },
      () => {
        setDetectingLocation(false);
        toast.error('Unable to detect location. Please allow location access.');
      }
    );
  };

  const handleSearch = () => {
    navigate('/booking');
  };

  const today = new Date().toISOString().split('T')[0];

  const inputBase =
    "w-full bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/50 rounded-xl py-2.5 text-[13px] font-semibold text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition-all outline-none shadow-sm";

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-4 lg:p-5 rounded-2xl lg:rounded-full shadow-2xl shadow-black/10 border border-slate-200/60 dark:border-slate-700/50 transition-colors duration-300">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-end gap-3 lg:gap-2">
          {/* Location Field */}
          <div className="flex-[1.3] flex flex-col gap-1.5" ref={locationRef}>
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.12em] ml-3">
              Location / Hub
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
              <input
                type="text"
                value={location}
                onChange={(e) => { setLocation(e.target.value); setShowLocations(true); }}
                onFocus={() => setShowLocations(true)}
                placeholder="Search Delhi hubs..."
                className={`${inputBase} pl-9 pr-9`}
              />
              <button
                onClick={detectLocation}
                disabled={detectingLocation}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors"
                title="Detect my location"
              >
                <LocateFixed className={`w-3.5 h-3.5 ${detectingLocation ? 'animate-spin' : ''}`} />
              </button>
              {showLocations && (
                <div className="absolute z-50 top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-800 rounded-xl shadow-2xl shadow-black/15 border border-slate-200 dark:border-slate-700 max-h-52 overflow-y-auto">
                  {filteredLocations.length > 0 ? filteredLocations.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => { setLocation(loc); setShowLocations(false); }}
                      className="w-full text-left px-3.5 py-2.5 text-[13px] font-medium text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-slate-700/70 flex items-center gap-2.5 transition-colors first:rounded-t-xl last:rounded-b-xl"
                    >
                      <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                      {loc}
                    </button>
                  )) : (
                    <div className="px-4 py-3 text-sm text-slate-400">No hubs found</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px h-10 bg-slate-200 dark:bg-slate-700 self-center" />

          {/* Check-in Date */}
          <div className="flex-1 flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.12em] ml-3">
              Check-in Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500 pointer-events-none" />
              <input
                type="date"
                value={checkInDate}
                min={today}
                onChange={(e) => setCheckInDate(e.target.value)}
                className={`${inputBase} pl-9 pr-3 cursor-pointer`}
              />
            </div>
          </div>

          {/* Check-in Time */}
          <div className="flex-[0.8] flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.12em] ml-3">
              Time
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500 pointer-events-none" />
              <select
                value={checkInTime}
                onChange={(e) => setCheckInTime(e.target.value)}
                className={`${inputBase} pl-9 pr-7 appearance-none cursor-pointer`}
              >
                {TIME_SLOTS.map((t) => <option key={t}>{t}</option>)}
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <div className="w-1.5 h-1.5 border-r-[1.5px] border-b-[1.5px] border-slate-400 rotate-45" />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px h-10 bg-slate-200 dark:bg-slate-700 self-center" />

          {/* Duration */}
          <div className="flex-[0.9] flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.12em] ml-3">
              Duration
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500 pointer-events-none" />
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className={`${inputBase} pl-9 pr-7 appearance-none cursor-pointer`}
              >
                {DURATION_OPTIONS.map((d) => <option key={d}>{d}</option>)}
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <div className="w-1.5 h-1.5 border-r-[1.5px] border-b-[1.5px] border-slate-400 rotate-45" />
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="lg:ml-1">
            <Button 
              onClick={handleSearch}
              className="w-full lg:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 h-[42px] rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-orange-500/40"
            >
              <Search className="w-4 h-4 stroke-[3px]" />
              <span className="uppercase tracking-wide text-sm whitespace-nowrap">Find a Pod</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSearch;
