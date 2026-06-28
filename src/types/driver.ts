import type { TourCategory } from "./tour";

export interface Driver {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  totalTrips: number;
  vehicleModel: string;
  vehiclePlate: string;
  bio: string;
  languages: string[];
  vehicleType: "car" | "van" | "suv";
  vehicleCapacity: number;
  yearsExperience: number;
  specialties: TourCategory[];
  totalToursRun: number;
  totalGuestsHosted: number;
  licenseNumber: string;
  isVerified: boolean;
}
