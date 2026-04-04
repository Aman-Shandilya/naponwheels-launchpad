import React from 'react';
import { MapPin, Calendar, Clock, Users, Search } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/sonner';

const BookingSearch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

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

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-[#E5E7EB]/95 dark:bg-slate-900/90 backdrop-blur-md p-3 lg:p-4 rounded-[2.5rem] shadow-2xl border border-white/40 dark:border-slate-800 flex flex-col lg:flex-row items-stretch lg:items-center gap-2 lg:gap-3 transition-colors duration-300">
        {/* Location Field */}
        <div className="flex-[1.2] flex flex-col gap-1 px-2 py-1">
          <label className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
            LOCATION / HUB
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-orange-500" />
            </div>
            <input
              type="text"
              placeholder="Kashmere Gate IS"
              className="w-full bg-white dark:bg-slate-800 border-none rounded-2xl py-3 pl-11 pr-4 text-sm font-semibold text-slate-600 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-orange-500/20 transition-all outline-none shadow-sm"
            />
          </div>
        </div>

        {/* Check-in Field */}
        <div className="flex-1 flex flex-col gap-1 px-2 py-1">
          <label className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
            CHECK-IN
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-orange-500" />
            </div>
            <input
              type="text"
              placeholder="Today, 10:00 PM"
              className="w-full bg-white dark:bg-slate-800 border-none rounded-2xl py-3 pl-11 pr-4 text-sm font-semibold text-slate-600 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-orange-500/20 transition-all outline-none shadow-sm"
            />
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
            <select className="w-full bg-white dark:bg-slate-800 border-none rounded-2xl py-3 pl-11 pr-8 text-sm font-semibold text-slate-600 dark:text-slate-200 focus:ring-2 focus:ring-orange-500/20 transition-all outline-none appearance-none cursor-pointer shadow-sm">
              <option>3 Hours</option>
              <option>6 Hours</option>
              <option>12 Hours</option>
              <option>Full Day</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <div className="w-1.5 h-1.5 border-r-2 border-b-2 border-slate-400 dark:border-slate-500 rotate-45" />
            </div>
          </div>
        </div>

        {/* Guests Field */}
        <div className="flex-1 flex flex-col gap-1 px-2 py-1">
          <label className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
            GUESTS
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
              <Users className="w-4 h-4 text-orange-500" />
            </div>
            <select className="w-full bg-white dark:bg-slate-800 border-none rounded-2xl py-3 pl-11 pr-8 text-sm font-semibold text-slate-600 dark:text-slate-200 focus:ring-2 focus:ring-orange-500/20 transition-all outline-none appearance-none cursor-pointer shadow-sm">
              <option>1 Berth</option>
              <option>2 Berths</option>
              <option>3 Berths</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <div className="w-1.5 h-1.5 border-r-2 border-b-2 border-slate-400 dark:border-slate-500 rotate-45" />
            </div>
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
