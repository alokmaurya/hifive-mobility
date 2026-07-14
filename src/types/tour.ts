export type TourStatus = "draft" | "published" | "paused" | "past";

export type TourCategory =
  | "city_sightseeing"
  | "outer_city_sightseeing"
  | "flexi"
  | "heritage"
  | "nature"
  | "food"
  | "adventure"
  | "religious"
  | "coastal"
  | "city";

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface TourStop {
  id: string;
  name: string;
  description?: string;
  durationMinutes: number;
  order: number;
}

export interface TourSchedule {
  startTime: string;
  endTime: string;
  daysOfWeek: number[];
  specificDates?: string[];
}

export interface Tour {
  id: string;
  driverId: string;
  name: string;
  city: string;
  state: string;
  country: string;
  category: TourCategory;
  description: string;
  coverImage?: string;
  stops: TourStop[];
  schedule: TourSchedule;
  pricePerPerson: number;
  fullCabPrice?: number;
  overtimeRatePerHour?: number;
  currency: string;
  maxGuests: number;
  currentBookings: number;
  status: TourStatus;
  createdAt: string;
  estimatedDurationMinutes: number;
  rating?: number;
  reviewCount?: number;
  hourlyRate?: number;
  tourType?: TourCategory;
  // Cab options
  isAc?: boolean;
  isPetFriendly?: boolean;
  smokingAllowed?: boolean;
  // Flexi pricing
  offersHourly?: boolean;
  offersAirportDrop?: boolean;
  offersRailwayDrop?: boolean;
  offersBusDrop?: boolean;
  airportDropPrice?: number;
  railwayDropPrice?: number;
  busStationDropPrice?: number;
  // Driver / vehicle info (attached from driver profile)
  driverName?: string;
  vehicleModel?: string;
  vehicleCapacity?: number;
  fuelType?: string;
  cabPhoto?: string;
}

export interface Guest {
  id: string;
  name: string;
  phone: string;
  guestCount: number;
  specialRequests?: string;
}

export interface Booking {
  id: string;
  tourId: string;
  tourName: string;
  tourDate: string;
  guest: Guest;
  status: BookingStatus;
  totalAmount: number;
  currency: string;
  bookedAt: string;
  tourType?: string;
  hoursRequested?: number;
  travellerEmail?: string;
}

export interface TourEarning {
  tourId: string;
  tourName: string;
  toursRun: number;
  totalGuests: number;
  grossRevenue: number;
  platformFee: number;
  netRevenue: number;
  currency: string;
}

export interface PayoutSummary {
  pendingPayout: number;
  lastPayoutAmount: number;
  lastPayoutDate: string;
  bankLast4: string;
  currency: string;
}

export type TourDraft = {
  city: string;
  state: string;
  country: string;
  category: TourCategory | "";
  stops: Omit<TourStop, "id">[];
  startTime: string;
  endTime: string;
  daysOfWeek: number[];
  // Pricing
  fullCabPrice: number | "";
  overtimeRatePerHour: number | "";
  hourlyRate: number | "";
  airportDropPrice: number | "";
  railwayDropPrice: number | "";
  busStationDropPrice: number | "";
  // Flexi service toggles
  offersAirportDrop: boolean;
  offersRailwayDrop: boolean;
  offersBusDrop: boolean;
  offersHourly: boolean;
  // Cab options
  isAc: boolean;
  isPetFriendly: boolean;
  smokingAllowed: boolean;
};
