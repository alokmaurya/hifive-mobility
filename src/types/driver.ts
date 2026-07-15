import type { TourCategory } from "./tour";

// Keep these exports — car.ts imports them
export type FuelType = "petrol" | "diesel" | "cng" | "hybrid" | "ev";
export type VehicleType = "hatchback" | "sedan" | "suv" | "van" | "tempo";

export type Gender = "male" | "female" | "other" | "";

export interface DriverCar {
  vehicleModel: string;
  vehiclePlate: string;
  carBrand: string;
  vehicleType: string;
  vehicleCapacity: number;
  fuelType: string;
  isAc: boolean;
  luggageCapacityBags: number;
  isPetFriendly: boolean;
  smokingAllowed: boolean;
  cabPhoto: string;
}

export interface Driver {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  totalTrips: number;
  // Personal info
  age?: number;
  gender: Gender;
  phone?: string;
  aadharNumber: string;
  aadharFrontUrl: string;
  aadharBackUrl: string;
  // Professional info
  bio: string;
  languages: string[];
  yearsExperience: number;
  specialties: TourCategory[];
  licenseNumber: string;
  isVerified: boolean;
  // Stats
  totalToursRun: number;
  totalGuestsHosted: number;
  // Preferences
  isAvailable: boolean;
  hourlyRate: number;
  // Photo
  photoUrl?: string;
  tourTypes?: string[];
  primaryCar?: DriverCar;
  cars?: DriverCar[];
}
