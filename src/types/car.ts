import type { FuelType, VehicleType } from "./driver";

export interface DriverCar {
  id: string;
  driverId: string;
  carBrand: string;
  vehicleModel: string;
  vehiclePlate: string;
  vehicleType: VehicleType;
  vehicleCapacity: number;
  fuelType: FuelType;
  isAc: boolean;
  isPetFriendly: boolean;
  smokingAllowed: boolean;
  luggageCapacityBags: number;
  cabPhoto?: string;
  isActive: boolean;
  createdAt: string;
}

export type DriverCarDraft = Omit<DriverCar, "id" | "driverId" | "createdAt">;
