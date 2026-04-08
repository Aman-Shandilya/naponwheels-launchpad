import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Calendar, Clock, Users, Search, LocateFixed } from 'lucide-react';
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
  const [guests, setGuests] = useState('1');
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
        // Find nearest hub (simple distance calc)
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
    if (!user) {
      toast.info('Please sign in to continue', {
        description: 'You need to be logged in to search and book pods.'
      });
      navigate('/auth', { state: { returnTo: '/booking' } });
      return;
    }
    navigate('/booking');
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-[#E5E7EB]/95 dark:bg-slate-900/90 backdrop-blur-md p-3 lg:p-4 rounded-[2.5rem] shadow-2xl border border-white/40 dark:border-slate-800 flex flex-col lg:flex-row items-stretch lg:items-center gap-2 lg:gap-3 transition-colors duration-300">
        {/* Location Field */}
        <div className="flex-[1.2] flex flex-col gap-1 px-2 py-1" ref={locationRef}>
          <label className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
            LOCATION / HUB
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-orange-500" />
            </div>
            <input
              type="text"
              value={location}
              onChange={(e) => { setLocation(e.target.value); setShowLocations(true); }}
              onFocus={() => setShowLocations(true)}
              placeholder="Search Delhi hubs..."
              className="w-full bg-white dark:bg-slate-800 border-none rounded-2xl py-3 pl-11 pr-10 text-sm font-semibold text-slate-600 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-orange-500/20 transition-all outline-none shadow-sm"
            />
            <button
              onClick={detectLocation}
              disabled={detectingLocation}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500 hover:text-orange-600 transition-colors"
              title="Detect my location"
            >
              <LocateFixed className={`w-4 h-4 ${detectingLocation ? 'animate-spin' : ''}`} />
            </button>
            {showLocations && (
              <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 max-h-52 overflow-y-auto">
                {filteredLocations.length > 0 ? filteredLocations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => { setLocation(loc); setShowLocations(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors"
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

        {/* Check-in Field */}
        <div className="flex-1 flex flex-col gap-1 px-2 py-1">
          <label className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
            CHECK-IN
          </label>
          <div className="flex gap-1.5">
            <div className="relative group flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                <Calendar className="w-4 h-4 text-orange-500" />
              </div>
              <input
                type="date"
                value={checkInDate}
                min={today}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border-none rounded-2xl py-3 pl-11 pr-3 text-sm font-semibold text-slate-600 dark:text-slate-200 focus:ring-2 focus:ring-orange-500/20 transition-all outline-none shadow-sm cursor-pointer"
              />
            </div>
            <div className="relative group flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                <Clock className="w-4 h-4 text-orange-500" />
              </div>
              <select
                value={checkInTime}
                onChange={(e) => setCheckInTime(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border-none rounded-2xl py-3 pl-9 pr-6 text-sm font-semibold text-slate-600 dark:text-slate-200 focus:ring-2 focus:ring-orange-500/20 transition-all outline-none appearance-none cursor-pointer shadow-sm"
              >
                {TIME_SLOTS.map((t) => <option key={t}>{t}</option>)}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <div className="w-1.5 h-1.5 border-r-2 border-b-2 border-slate-400 dark:border-slate-500 rotate-45" />
              </div>
            </div>
          </div>
        </div>

        {/* Duration Field */}
        <div className="flex-1 flex flex-col gap-1 px-2 py-1">
          <label className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
            DURATION
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
              <Clock className="w-4 h-4 text-orange-500" />
            </div>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border-none rounded-2xl py-3 pl-11 pr-8 text-sm font-semibold text-slate-600 dark:text-slate-200 focus:ring-2 focus:ring-orange-500/20 transition-all outline-none appearance-none cursor-pointer shadow-sm"
            >
              {DURATION_OPTIONS.map((d) => <option key={d}>{d}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <div className="w-1.5 h-1.5 border-r-2 border-b-2 border-slate-400 dark:border-slate-500 rotate-45" />
            </div>
          </div>
        </div>

        {/* Guests Field */}
        <div className="flex-1 flex flex-col gap-1 px-2 py-1">
          <label className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
            GUESTS (BERTHS)
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
              <Users className="w-4 h-4 text-orange-500" />
            </div>
            <input
              type="number"
              min={1}
              max={20}
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              placeholder="1"
              list="guest-options"
              className="w-full bg-white dark:bg-slate-800 border-none rounded-2xl py-3 pl-11 pr-8 text-sm font-semibold text-slate-600 dark:text-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500/20 transition-all outline-none shadow-sm"
            />
            <datalist id="guest-options">
              {[1,2,3,4,5,6,8,10].map(n => <option key={n} value={n} />)}
            </datalist>
          </div>
        </div>

        {/* Search Button */}
        <div className="lg:pl-2 pt-2 lg:pt-0 self-end mb-1">
          <Button 
            onClick={handleSearch}
            className="w-full lg:w-auto bg-orange-500 hover:bg-orange-600 text-white font-black px-8 py-6 rounded-2xl shadow-[0_8px_20px_-6px_rgba(249,115,22,0.6)] flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Search className="w-5 h-5 stroke-[3.5px]" />
            <span className="uppercase tracking-[0.05em] text-base">FIND A POD</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingSearch;
