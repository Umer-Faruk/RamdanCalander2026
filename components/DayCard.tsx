
import React from 'react';
import { PrayerTimes } from '../types';

interface Props {
  day: PrayerTimes;
}

export const DayCard: React.FC<Props> = ({ day }) => {
  const { Fajr, Maghrib, isToday, isPassed, readableDate, hijriDay } = day;

  return (
    <div className={`relative transition-all duration-300 ${
      isPassed ? 'opacity-40 grayscale-[0.2]' : 'hover:scale-[1.01]'
    }`}>
      <div className={`bg-white rounded-3xl p-5 shadow-sm border-2 flex items-center gap-4 transition-all duration-300 ${
        isToday 
          ? 'border-emerald-500 bg-emerald-50/40 ring-4 ring-emerald-50 shadow-xl shadow-emerald-100 z-10' 
          : isPassed 
            ? 'border-transparent bg-slate-50/50' 
            : 'border-white hover:border-emerald-100'
      }`}>
        
        {/* Day Number Column */}
        <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex flex-col items-center justify-center border transition-colors ${
          isToday ? 'bg-emerald-600 border-emerald-500' : 'bg-slate-50 border-slate-100'
        }`}>
          <span className={`text-xl font-black leading-none ${isToday ? 'text-white' : 'text-slate-700'}`}>{hijriDay}</span>
          <span className={`text-[8px] font-black uppercase tracking-tighter mt-1 ${isToday ? 'text-emerald-100' : 'text-slate-400'}`}>Day</span>
        </div>

        {/* Date and Day Info */}
        <div className="flex-grow min-w-0">
          <h4 className={`text-sm font-black truncate ${isToday ? 'text-emerald-900' : 'text-slate-800'}`}>
            {readableDate.split(',')[0]}
          </h4>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
            {readableDate.split(',')[1].trim()}
          </p>
        </div>

        {/* Timings Rows */}
        <div className="flex items-center gap-3 sm:gap-8">
          <div className="text-right">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Sehar</p>
            <p className={`text-[13px] sm:text-base font-black whitespace-nowrap ${isToday ? 'text-emerald-700' : 'text-slate-900'}`}>
              {Fajr}
            </p>
          </div>
          <div className="w-px h-10 bg-slate-100"></div>
          <div className="text-right">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Iftar</p>
            <p className={`text-[13px] sm:text-base font-black whitespace-nowrap ${isToday ? 'text-indigo-700' : 'text-slate-900'}`}>
              {Maghrib}
            </p>
          </div>
        </div>

        {/* Status Indicator */}
        {isToday && (
          <div className="absolute -top-1 -right-1">
            <span className="flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
