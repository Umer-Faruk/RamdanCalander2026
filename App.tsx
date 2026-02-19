
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { DayCard } from './components/DayCard';
import { LocationStatus } from './components/LocationStatus';
import { PrayerTimes, Location } from './types';

// Utility to convert 24h string (e.g., "05:15") to 12h format (e.g., "5:15 AM")
const formatTo12h = (time24: string) => {
  if (!time24) return "";
  const [hoursStr, minutes] = time24.split(':');
  let hours = parseInt(hoursStr, 10);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  return `${hours}:${minutes} ${ampm}`;
};

const App: React.FC = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [calendar, setCalendar] = useState<PrayerTimes[]>([]);
  const todayRef = useRef<HTMLDivElement>(null);

  const fetchCalendarData = useCallback(async (loc: Location) => {
    try {
      setLoading(true);
      setError(null);
      
      let url = "";
      // Method 1: University of Islamic Sciences, Karachi (India/Pakistan Standard)
      // adjustment=-1: Delays the Hijri month start by 1 day to align 1st Ramadan with Feb 19, 2026.
      const method = 1; 
      const adjustment = -1; 
      const hijriYear = 1447;
      const hijriMonth = 9;

      if (loc.latitude && loc.longitude && !loc.city) {
        url = `https://api.aladhan.com/v1/hijriCalendar/${hijriYear}/${hijriMonth}?latitude=${loc.latitude}&longitude=${loc.longitude}&method=${method}&adjustment=${adjustment}`;
      } else {
        const address = loc.city || "Gangavathi, India";
        url = `https://api.aladhan.com/v1/hijriCalendarByAddress/${hijriYear}/${hijriMonth}?address=${encodeURIComponent(address)}&method=${method}&adjustment=${adjustment}`;
      }

      const response = await fetch(url);
      const result = await response.json();

      if (result.code === 200) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const data: PrayerTimes[] = result.data.map((day: any) => {
          const dateStr = day.date.gregorian.date;
          const [d, m, y] = dateStr.split('-');
          const gregorianDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
          gregorianDate.setHours(0, 0, 0, 0);

          return {
            Fajr: formatTo12h(day.timings.Fajr.split(' ')[0]),
            Maghrib: formatTo12h(day.timings.Maghrib.split(' ')[0]),
            date: dateStr,
            readableDate: day.date.gregorian.weekday.en + ', ' + day.date.gregorian.month.en + ' ' + day.date.gregorian.day,
            hijriDay: parseInt(day.date.hijri.day),
            hijriMonth: day.date.hijri.month.en,
            isToday: gregorianDate.getTime() === today.getTime(),
            isPassed: gregorianDate.getTime() < today.getTime(),
          };
        });

        setCalendar(data);
        
        if (!loc.city && result.data[0]?.meta?.timezone) {
          const cityParts = result.data[0].meta.timezone.split('/');
          const city = cityParts[cityParts.length - 1]?.replace('_', ' ') || 'Detected Location';
          setLocation(prev => ({ ...prev!, city }));
        }
      } else {
        throw new Error("Failed to fetch timing data for this location.");
      }
    } catch (err) {
      setError("Could not retrieve timings. Please try a different location or check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = (city: string) => {
    const newLoc = { city, latitude: 0, longitude: 0 };
    setLocation(newLoc);
    fetchCalendarData(newLoc);
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const initialLoc = { latitude, longitude };
          setLocation(initialLoc);
          fetchCalendarData(initialLoc);
        },
        (err) => {
          const defaultLoc = { latitude: 15.4321, longitude: 76.5322, city: 'Gangavathi' };
          setLocation(defaultLoc);
          fetchCalendarData(defaultLoc);
        }
      );
    } else {
      const defaultLoc = { latitude: 15.4321, longitude: 76.5322, city: 'Gangavathi' };
      setLocation(defaultLoc);
      fetchCalendarData(defaultLoc);
    }
  }, [fetchCalendarData]);

  const scrollToToday = () => {
    todayRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const todayData = calendar.find(d => d.isToday);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12 selection:bg-emerald-100">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <LocationStatus 
          location={location} 
          error={error} 
          loading={loading} 
          onSearch={handleSearch}
        />
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-500 font-medium tracking-tight">Syncing with South Asia sighting standards...</p>
          </div>
        ) : error ? (
          <div className="bg-white p-10 rounded-[2.5rem] text-center shadow-2xl border border-red-50 max-w-md mx-auto">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-red-600 font-black text-lg mb-2">Location Error</p>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {todayData && (
              <section className="bg-emerald-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-emerald-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                   <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6-2zm0 8h2v2h-2z" /></svg>
                </div>
                <div className="relative z-10">
                  <span className="bg-emerald-500/30 text-emerald-200 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-500/30">Today • Day {todayData.hijriDay}</span>
                  <h2 className="text-3xl font-bold mt-4 mb-8">Ramadan Timings</h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/10">
                      <p className="text-[10px] uppercase font-black tracking-widest text-emerald-300 mb-1">Sehar Ends</p>
                      <p className="text-2xl sm:text-3xl font-black">{todayData.Fajr}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/10">
                      <p className="text-[10px] uppercase font-black tracking-widest text-emerald-300 mb-1">Iftar Starts</p>
                      <p className="text-2xl sm:text-3xl font-black">{todayData.Maghrib}</p>
                    </div>
                  </div>
                  
                  <button onClick={scrollToToday} className="mt-8 w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-2xl transition-all active:scale-95 shadow-lg shadow-emerald-900/40">
                    View Full Month
                  </button>
                </div>
              </section>
            )}

            <div className="flex items-center justify-between px-2">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Full Month Calendar</h3>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Feb - Mar 2026</div>
            </div>

            <div className="flex flex-col gap-4">
              {calendar.map((day) => (
                <div key={day.date} ref={day.isToday ? todayRef : null}>
                  <DayCard day={day} />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="mt-16 text-center px-4">
        <p className="text-slate-400 text-sm font-medium">May Allah accept your fasting and prayers.</p>
        <div className="mt-4 inline-flex flex-col items-center gap-2">
          <div className="px-4 py-2 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse inline-block mr-2"></span>
            Verified for {location?.city || 'Selected Location'}
          </div>
          <p className="mt-2 text-[10px] text-slate-400 uppercase tracking-widest font-black max-w-xs mx-auto">
            Source: University of Islamic Sciences, Karachi (India/Pakistan Standard)
          </p>
          <p className="text-[9px] text-slate-300 uppercase tracking-widest font-medium">
            AlAdhan Timing Engine • Hijri Adjustment Applied • 1447 AH
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
