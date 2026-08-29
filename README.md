# HiFive Tours — Driver & Traveller Platform

A two-sided marketplace for curated sightseeing tours across India. Drivers create and manage tours; travellers browse, book, and rate their experiences. Built as a high-performance Next.js app deployed as a static web app on GitHub Pages and packaged natively as an **Android mobile app via Capacitor**, backed by Supabase for auth, database, and file storage.

**Live Web App:** https://alokmaurya.github.io/hifive-mobility/

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Features](#features)
   - [Driver Portal](#driver-portal)
   - [Traveller Portal](#traveller-portal)
4. [Mobile Application (Android)](#mobile-application-android)
5. [Pages & Routes](#pages--routes)
6. [Components](#components)
7. [Hooks](#hooks)
8. [Types](#types)
9. [Database Schema](#database-schema)
10. [Authentication](#authentication)
11. [Storage](#storage)
12. [Deployment & CI/CD](#deployment--cicd)
13. [Local Development](#local-development)
14. [Environment Variables](#environment-variables)

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org) | 16.x | App Router, static export (`output: "export"`) |
| [Capacitor](https://capacitorjs.com) | 8.x | Native mobile runtime & Android wrapper (`@capacitor/android`) |
| [React](https://react.dev) | 19.x | UI runtime |
| [TypeScript](https://www.typescriptlang.org) | 5.x | Type safety |
| [Supabase](https://supabase.com) | 2.x | PostgreSQL database, Auth, Storage |
| [Tailwind CSS](https://tailwindcss.com) | 4.x | Utility-first styling |
| [Lucide React](https://lucide.dev) | 1.x | Icon library |
| [Leaflet](https://leafletjs.com) | 1.9.x | Interactive map for pickup location |
| [Geist Font](https://vercel.com/font) | — | Sans + Mono typefaces via `next/font` |

---

## Project Structure

```
├── android/                    # Native Android Gradle project (Capacitor)
├── capacitor.config.ts         # Capacitor mobile app configuration
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Root splash / auth redirect
│   │   ├── layout.tsx          # Root layout with font and providers
│   │   ├── auth/               # Driver authentication (login/signup)
│   │   ├── dashboard/          # Driver dashboard (stats)
│   │   ├── tours/              # Tour management & wizard
│   │   ├── bookings/           # Driver booking management
│   │   ├── earnings/           # Driver earnings & payouts
│   │   ├── profile/            # Driver profile & cars
│   │   ├── support/            # Driver support tickets
│   │   └── traveller/          # Traveller sub-app
│   │       ├── auth/           # Traveller auth (login/signup)
│   │       ├── page.tsx        # Traveller home
│   │       ├── explore/        # Browse drivers by city
│   │       ├── driver/         # Driver detail page
│   │       ├── tour/           # Tour detail & booking
│   │       ├── bookings/       # Traveller booking history
│   │       ├── profile/        # Traveller profile & preferences
│   │       └── support/        # Traveller support tickets
│   ├── components/
│   │   ├── bookings/           # BookingCard
│   │   ├── tours/
│   │   │   └── TourWizard/     # 7-step tour creation wizard
│   │   ├── traveller/          # Traveller-specific components
│   │   ├── ui/                 # Shared UI primitives
│   │   └── providers/          # React context providers
│   ├── contexts/
│   │   └── AuthContext.tsx     # Supabase auth state
│   ├── hooks/                  # Data-fetching hooks
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client with build-safe fallbacks
│   │   ├── database.types.ts   # Database schema definitions
│   │   └── utils.ts            # Shared formatting helpers
│   └── types/                  # TypeScript interfaces
└── supabase/
    ├── migrations/             # SQL migrations (001 to 028)
    └── schema.sql              # Supabase initial schema
```

---

## Features

### Driver Portal

| Feature | Description |
|---|---|
| **Account signup** | Single-step registration (name, email, phone, password). No vehicle details required at signup. |
| **Dashboard** | Overview of total tours, total bookings, pending requests, and gross earnings. |
| **Tour creation wizard** | 7-step guided wizard: Location → Tour Type → Schedule → Pricing → Car Selection → Itinerary → Preview. |
| **State & City dropdowns** | Step 1 of the wizard has a cascading State → City dropdown covering all Indian states/UTs with major cities. |
| **Tour management** | List, publish, pause, duplicate, and delete tours. Filter by status (all / published / draft / paused / past). |
| **Booking management** | Tab-based view (Pending / Confirmed / On Going / Completed / Cancelled). Confirm or decline incoming bookings. |
| **OTP-based trip flow** | On trip start, the driver enters the traveller's 4-digit Start OTP. On trip end, the driver enters the traveller's 4-digit End OTP. |
| **Pickup location** | Driver sees the traveller's pickup address and a **Google Maps link** (lat/lng pin) directly in the booking card. |
| **Earnings & payouts** | Per-tour revenue breakdown, platform fee (10%), net payout per tour, and overall payout summary. |
| **Profile management** | Edit personal info (name, age, gender, phone, bio, languages spoken, years of experience, specialties). Upload profile photo and Aadhaar front/back for verification. |
| **Vehicle management** | Add, edit, delete multiple cars from the Profile page. Set brand, model, plate, type, fuel, seats, AC, luggage capacity, pet-friendly and smoking flags. Upload a car photo. |
| **Automatic verification** | Driver is marked `is_verified` automatically when Aadhaar number and both document photos are saved. |
| **Support tickets** | Create support tickets by category. View admin replies and ticket status. |

### Traveller Portal

| Feature | Description |
|---|---|
| **Account signup** | Registration with name, email, phone, and password. Creates a row in the `travellers` table with role separation. |
| **Home screen** | State/city selector with live data (only cities that have published tours). Dynamic hero images. |
| **Explore drivers** | Browse all drivers operating in the selected city. View driver photo, rating, vehicle, tour types, and verification badge. |
| **Driver detail** | Full driver profile: bio, languages, specialties, all offered tours with stops, schedules, and pricing. |
| **Tour booking** | Select tour date, guest count, and pickup location on an interactive Leaflet map. Booking saves pickup address + coordinates. |
| **Flexi booking** | Book by-the-hour rides: select hours, start/end times, and pickup point. |
| **Pickup map** | Leaflet map with OpenStreetMap tiles. Click/drag to pin exact pickup location. Reverse-geocodes address via Nominatim. |
| **Booking history** | View all bookings (upcoming, ongoing, completed, cancelled). See OTP codes for trip verification. |
| **Post-trip rating** | Rate the driver 1–5 stars with an optional comment after trip completion. |
| **Traveller Profile & Preferences** | Manage personal information, **Food Habits & Diet** (`Pure Veg/Jain`, `Vegetarian`, `Eggitarian`, `Non-Veg`, `Vegan`, `Halal`, `No Preference`) + dietary notes, **Travel Interests** (12 category chips + custom tags), **Preferred Guide/Driver Language**, and **Emergency Contact**. |
| **Booking cancellation** | Cancel pending bookings before the driver confirms. |
| **Support tickets** | Create and track support tickets. |

---

## Mobile Application (Android)

HiFive Mobility is configured with **Capacitor** to run as a native Android application.

### Architecture & Build Flow
```
Next.js Source Code ──► (npm run build:mobile) ──► /out (Static Build) ──► (cap sync) ──► /android (Native APK / AAB)
```

- **Zero Rewrite**: 100% of React components, Supabase queries, and Leaflet maps run inside the native container.
- **Routing**: `next.config.ts` handles multi-target paths — `basePath: ""` for mobile apps vs `basePath: "/hifive-mobility"` for GitHub Pages.

### Mobile Commands

```bash
# 1. Compile Next.js web app for mobile and sync with Android
npm run cap:sync

# 2. Open the native Android project in Android Studio
npm run cap:open
```

### Running in Android Studio
1. Open the **`android`** folder in Android Studio.
2. Connect an Android phone via USB (with **USB Debugging** enabled) or start a Virtual Device / Emulator.
3. Click the green **▶ Play** button to deploy and run.
4. To create a standalone `.apk` installable file:  
   **Build → Build Bundle(s) / APK(s) → Build APK(s)**.

---

## Pages & Routes

### Driver Routes

| Route | Component | Description |
|---|---|---|
| `/` | `app/page.tsx` | Splash page — redirects to `/dashboard` (auth) or `/auth/login` (guest) |
| `/auth/login` | `app/auth/login/page.tsx` | Driver login with forgot-password flow |
| `/auth/signup` | `app/auth/signup/page.tsx` | Driver signup (name, email, phone, password only) |
| `/auth/reset-password` | `app/auth/reset-password/page.tsx` | Password reset via email link |
| `/dashboard` | `app/dashboard/page.tsx` | Stats overview — tours, bookings, earnings |
| `/tours` | `app/tours/page.tsx` | All tours list with status filter and actions |
| `/tours/new` | `app/tours/new/page.tsx` | 7-step tour creation wizard |
| `/tours/edit` | `app/tours/edit/page.tsx` | Edit existing tour (pre-populated wizard) |
| `/bookings` | `app/bookings/page.tsx` | Booking management with 5-tab status filter |
| `/earnings` | `app/earnings/page.tsx` | Per-tour earnings and payout summary |
| `/profile` | `app/profile/page.tsx` | Profile editor + car management |
| `/support` | `app/support/page.tsx` | Driver support tickets |

### Traveller Routes

| Route | Component | Description |
|---|---|---|
| `/traveller` | `app/traveller/page.tsx` | Traveller home with state/city search |
| `/traveller/auth/login` | `app/traveller/auth/login/page.tsx` | Traveller login |
| `/traveller/auth/signup` | `app/traveller/auth/signup/page.tsx` | Traveller signup |
| `/traveller/explore` | `ExploreClient.tsx` | Driver listing for selected city |
| `/traveller/driver` | `DriverDetailClient.tsx` | Driver profile + available tours |
| `/traveller/tour` | `TourDetailClient.tsx` | Tour detail + booking form with map |
| `/traveller/bookings` | `app/traveller/bookings/page.tsx` | Booking history with OTPs and rating |
| `/traveller/profile` | `app/traveller/profile/page.tsx` | Traveller profile, interests, food habits & travel style editor |
| `/traveller/support` | `app/traveller/support/page.tsx` | Traveller support tickets |

---

## Components

### `src/components/bookings/`

| Component | Description |
|---|---|
| `BookingCard.tsx` | Full booking card for driver view. Expandable detail panel showing traveller info, booking details, pickup location with Google Maps link, OTP entry fields, and action buttons (Confirm / Decline / Start Trip / End Trip). Shows traveller's post-trip rating on completed bookings. |

### `src/components/tours/TourWizard/`

| Step | Component | Fields |
|---|---|---|
| 1 | `Step1Location.tsx` | State dropdown (all Indian states/UTs) → City dropdown (filtered by state) |
| 2 | `Step2TourType.tsx` | Tour category selector (City Sightseeing, Outer City, Flexi, Heritage, Nature, Food, Adventure, Religious, Coastal) |
| 3 | `Step3Schedule.tsx` | Operating days of week (multi-select), start time, end time |
| 4 | `Step4Pricing.tsx` | Full cab price, overtime rate. Flexi: hourly rate, airport/railway/bus drop prices with enable toggles |
| 5 | `Step5CabOptions.tsx` | Select registered car; inherits AC, pet-friendly, smoking settings |
| 6 | `Step6Itinerary.tsx` | Add/remove/reorder tour stops with name and duration |
| 7 | `Step7Preview.tsx` | Read-only summary before final submit |
| — | `WizardShell.tsx` | State orchestrator, step navigation, progress bar, submit handler |

### `src/components/traveller/`

| Component | Description |
|---|---|
| `PickupLocationMap.tsx` | Leaflet map (OpenStreetMap tiles). Click/drag marker to set pickup. Reverse-geocodes to address string via Nominatim. Emits `{ address, lat, lng }`. |
| `TravellerBottomNav.tsx` | Bottom navigation bar for traveller app (Home, Explore, Bookings, Profile). |

### `src/components/ui/`

| Component | Description |
|---|---|
| `AppHeader.tsx` | Sticky top bar for driver app with title and notification badge |
| `BottomNav.tsx` | Driver app bottom navigation (Dashboard, Tours, Bookings, Earnings, Profile) |
| `BottomSheet.tsx` | Reusable slide-up bottom sheet with backdrop dismiss |
| `EmptyState.tsx` | Empty list placeholder (emoji + title + description) |
| `RequireAuth.tsx` | Route guard for driver pages — redirects to `/auth/login` |
| `RequireTravellerAuth.tsx` | Route guard for traveller pages — redirects to `/traveller/auth/login` |
| `StatCard.tsx` | KPI tile used on the dashboard |

---

## Hooks

| Hook | Tables | Responsibility |
|---|---|---|
| `useAuth` | — | Wraps Supabase `onAuthStateChange`. Exposes `user`, `session`, `signOut`. |
| `useBookings` | `bookings`, `tours`, `travellers` | Driver bookings: fetch, confirm, cancel, start trip (writes start OTP), end trip (writes end OTP). Fetches pickup coordinates. |
| `useTours` | `tours`, `tour_stops`, `driver_cars`, `drivers` | Driver tours: create, update, delete, duplicate, toggle status. Auto-generates tour name and `tourCode`. |
| `useProfile` | `drivers` | Driver profile read/update. Photo and Aadhaar upload to Supabase Storage. Sets `is_verified` flag. |
| `useCars` | `driver_cars` | Driver vehicle CRUD + car photo upload. |
| `useCityStateOptions` | `tours` | Derives distinct city/state pairs from published tours for traveller home dropdowns. |
| `useDriversByCity` | `tours`, `drivers`, `driver_cars` | Fetches drivers with published tours in a given city + state. Aggregates tour types and active cars per driver. |
| `useTraveller` | `travellers` | Traveller profile read/update (interests, food habits, diet notes, language, city, emergency contact, bio). |
| `useTravellerBookings` | `bookings`, `drivers`, `tours`, `driver_cars` | Traveller bookings: create tour/flexi booking with pickup coords, cancel, submit rating. |
| `useSupport` | `support_tickets` | Create and read support tickets. Role-scoped (`"driver"` or `"traveller"`). Handles missing table gracefully. |

---

## Types

### `src/types/traveller.ts`

```ts
type TourType = "city_sightseeing" | "outer_city_sightseeing" | "flexi"

interface Traveller {
  id: string
  name: string
  phone: string
  email: string
  createdAt: string
  interests?: string[]
  foodPreference?: string
  dietaryNotes?: string
  preferredLanguage?: string
  city?: string
  emergencyContact?: string
  bio?: string
}

interface TravellerBooking {
  id: string
  driverName: string
  driverPhotoUrl?: string
  vehicleModel?: string
  tourCity: string
  tourDate: string
  tourType: TourType
  status: "pending" | "confirmed" | "ongoing" | "cancelled" | "completed"
  startOtp?: string
  endOtp?: string
  travellerRating?: number
  ratingComment?: string
  pickupAddress?: string
  pickupLat?: number
  pickupLng?: number
  ...
}
```

---

## Database Schema

### `travellers`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Matches auth user id |
| `name` | text | Full name |
| `phone` | text | Contact number |
| `email` | text | Login email |
| `interests` | text[] | Array of travel interest tags |
| `food_preference` | text | Diet/food habit preference |
| `dietary_notes` | text | Allergies & specific requests |
| `preferred_language` | text | Preferred guide/driver language |
| `city` | text | Home city |
| `emergency_contact` | text | Emergency contact information |
| `bio` | text | Travel bio / preferences |
| `created_at` | timestamptz | Account creation timestamp |

*(See `supabase/schema.sql` and `supabase/migrations/` for full DDL of `drivers`, `driver_cars`, `tours`, `tour_stops`, `bookings`, and `support_tickets`).*

---

## Authentication

The app uses **Supabase Auth** with role-based routing:
- **Drivers**: Signed up with `user_type: "driver"` → redirects to `/dashboard`.
- **Travellers**: Signed up with `user_type: "traveller"` → redirects to `/traveller`.
- **Route Guards**: `RequireAuth` protects driver routes; `RequireTravellerAuth` protects traveller routes.

---

## Storage

Supabase Storage bucket: **`driver-photos`**

| Path pattern | Content |
|---|---|
| `{userId}/profile.{ext}` | Driver profile photo |
| `{userId}/aadhar-front.{ext}` | Aadhaar card front image |
| `{userId}/aadhar-back.{ext}` | Aadhaar card back image |
| `{userId}/car-{carId}.{ext}` | Car photo |

---

## Deployment & CI/CD

- **GitHub Pages (Web App)**: Automatically built and deployed on every push to `main` via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).
- **Mobile Builds (Android)**: Run `npm run cap:sync` to export the web application and sync it into the native Gradle project inside `android/`.

---

## Local Development

```bash
# Clone the repository
git clone https://github.com/alokmaurya/hifive-mobility.git
cd hifive-mobility

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

# Start local web development server
npm run dev

# Or build & sync for Android mobile development
npm run cap:sync
npm run cap:open
```

---

## Environment Variables

| Variable | Description | Where to set |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `.env.local` (local) / GitHub Secrets or Variables (CI) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous public key | `.env.local` (local) / GitHub Secrets or Variables (CI) |

---

*Built with Next.js + Supabase + Tailwind CSS + Capacitor. Deployed on GitHub Pages & Android.*

Developer Name: Alok Maurya
