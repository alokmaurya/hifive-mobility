export interface Traveller {
  id: string;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
}

export interface TravellerBooking {
  id: string;
  tourId: string;
  tourName: string;
  tourCity: string;
  tourDate: string;
  guestCount: number;
  totalAmount: number;
  currency: string;
  status: "pending" | "confirmed" | "cancelled";
  specialRequests?: string;
  bookedAt: string;
}
