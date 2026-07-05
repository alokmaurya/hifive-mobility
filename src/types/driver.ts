import type { TourCategory } from "./tour";

export type FuelType = "petrol" | "diesel" | "cng";
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
  carPhotoUrl?: string;
  isAvailable: boolean;
  hourlyRate: number;
  phone?: string;
}
