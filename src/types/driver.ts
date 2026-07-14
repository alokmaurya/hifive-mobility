import type { TourCategory } from "./tour";

export type FuelType = "petrol" | "diesel" | "cng" | "hybrid" | "ev";
export type VehicleType = "hatchback" | "sedan" | "suv" | "van" | "tempo";

export interface Driver {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  totalTrips: number;
  vehicleModel: string;
  vehiclePlate: string;
  carBrand: string;
  vehicleType: VehicleType;
  vehicleCapacity: number;
  fuelType: FuelType;
  isAc: boolean;
  luggageCapacityBags: number;
  isPetFriendly: boolean;
  bio: string;
  languages: string[];
  yearsExperience: number;
  specialties: TourCategory[];
  totalToursRun: number;
  totalGuestsHosted: number;
  licenseNumber: string;
  isVerified: boolean;
  age?: number;
  smokingAllowed: boolean;
  photoUrl?: string;
  cabPhoto?: string;
  carPhotoUrl?: string; // alias kept for compat
  isAvailable: boolean;
  hourlyRate: number;
  phone?: string;
  tourTypes?: string[];
}
