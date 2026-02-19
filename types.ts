
export interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

export interface PrayerTimes {
  Fajr: string;
  Maghrib: string;
  date: string;
  readableDate: string;
  hijriDay: number;
  hijriMonth: string;
  isPassed: boolean;
  isToday: boolean;
}

export interface ApiResponse {
  code: number;
  status: string;
  data: any[];
}
