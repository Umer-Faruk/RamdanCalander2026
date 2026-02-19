
import React, { useState } from 'react';
import { Location } from '../types';

interface Props {
  location: Location | null;
  error: string | null;
  loading: boolean;
  onSearch: (city: string) => void;
}

export const LocationStatus: React.FC<Props> = ({ location, error, loading, onSearch }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  if (loading) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch(searchValue.trim());
      setIsSearching(false);
      setSearchValue('');
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl p-4 sm:p-5 rounded-[2rem] shadow-xl border border-white mb-6 transition-all duration-300">
      {isSearching ? (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input 
            autoFocus
            type="text"
            placeholder="Search city (e.g. London, UK)"
            className="flex-grow bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-700"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <button 
            type="submit"
            className="p-3 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button 
            type="button"
            onClick={() => setIsSearching(false)}
            className="p-3 bg-slate-100 text-slate-500 rounded-2xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </form>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSearching(true)}
              className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center hover:bg-emerald-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
            </button>
            <div className="min-w-0">
              <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest leading-none mb-1">Region</p>
              <h3 className="text-sm font-bold text-slate-800 truncate">{location?.city || 'Detecting...'}</h3>
            </div>
          </div>

          <div className="text-right flex flex-col items-end">
            <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest leading-none mb-1">Year</p>
            <div className="flex items-center gap-2">
               <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg">1447 AH</span>
               <span className="text-xs font-bold text-slate-500">2026</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
