export interface Database {
  public: {
    Tables: {
      drivers: {
        Row: {
          id: string;
          name: string;
          phone: string | null;
          bio: string | null;
          rating: number;
          total_tours_run: number;
          total_guests_hosted: number;
          years_experience: number;
          vehicle_model: string | null;
          vehicle_plate: string | null;
          car_brand: string | null;
          vehicle_capacity: number;
          vehicle_type: string;
          fuel_type: string;
          is_ac: boolean;
          luggage_capacity_bags: number;
          is_pet_friendly: boolean;
          languages: string[];
          specialties: string[];
          is_verified: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          name?: string;
          phone?: string | null;
          bio?: string | null;
          rating?: number;
          total_tours_run?: number;
          total_guests_hosted?: number;
          years_experience?: number;
          vehicle_model?: string | null;
          vehicle_plate?: string | null;
          car_brand?: string | null;
          vehicle_capacity?: number;
          vehicle_type?: string;
          fuel_type?: string;
          is_ac?: boolean;
          luggage_capacity_bags?: number;
          is_pet_friendly?: boolean;
          languages?: string[];
          specialties?: string[];
          is_verified?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["drivers"]["Insert"]>;
      };
      tours: {
        Row: {
          id: string;
          driver_id: string;
          name: string;
          category: string;
          description: string;
          status: string;
          price_per_person: number;
          max_guests: number;
          start_time: string;
          days_of_week: number[];
          estimated_duration_minutes: number;
          city: string;
          state: string;
          country: string;
          current_bookings: number;
          rating: number | null;
          review_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          driver_id: string;
          name: string;
          category: string;
          description?: string;
          status?: string;
          price_per_person: number;
          max_guests?: number;
          start_time?: string;
          days_of_week?: number[];
          estimated_duration_minutes?: number;
          city?: string;
          state?: string;
          country?: string;
          current_bookings?: number;
        };
        Update: Partial<Database["public"]["Tables"]["tours"]["Insert"]>;
      };
      tour_stops: {
        Row: {
          id: string;
          tour_id: string;
          name: string;
          duration_minutes: number;
          stop_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          tour_id: string;
          name: string;
          duration_minutes: number;
          stop_order: number;
        };
        Update: Partial<Database["public"]["Tables"]["tour_stops"]["Insert"]>;
      };
      bookings: {
        Row: {
          id: string;
          tour_id: string;
          driver_id: string;
          guest_name: string;
          guest_phone: string | null;
          guest_count: number;
          tour_date: string;
          status: string;
          total_amount: number;
          special_requests: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          tour_id: string;
          driver_id: string;
          guest_name: string;
          guest_phone?: string | null;
          guest_count?: number;
          tour_date: string;
          status?: string;
          total_amount?: number;
          special_requests?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["bookings"]["Insert"]>;
      };
    };
  };
}
