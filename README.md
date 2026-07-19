# HiFive Tours — Driver & Traveller Platform

A two-sided marketplace for curated sightseeing tours across India. Drivers create and manage tours; travellers browse, book, and rate their experiences. Built as a fully static Next.js app deployed on GitHub Pages, backed by Supabase for auth, database, and file storage.

**Live app:** https://alokmaurya.github.io/hifive-mobility/

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Features](#features)
   - [Driver Portal](#driver-portal)
   - [Traveller Portal](#traveller-portal)
4. [Pages & Routes](#pages--routes)
5. [Components](#components)
6. [Hooks](#hooks)
7. [Types](#types)
8. [Database Schema](#database-schema)
9. [Authentication](#authentication)
10. [Storage](#storage)
11. [Deployment](#deployment)
12. [Local Development](#local-development)
13. [Environment Variables](#environment-variables)

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org) | 16.x | App Router, static export (`output: "export"`) |
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
src/
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Root splash / auth redirect
│   ├── layout.tsx              # Root layout with font and providers
│   ├── auth/                   # Driver authentication
│   │   ├── login/
│   │   ├── signup/
│   │   └── reset-password/
│   ├── dashboard/              # Driver dashboard (stats)
│   ├── tours/                  # Tour management
│   │   ├── page.tsx
│   │   ├── new/
│   │   └── edit/
│   ├── bookings/               # Booking management
│   ├── earnings/               # Earnings & payouts
│   ├── profile/                # Driver profile & cars
│   ├── support/                # Driver support tickets
│   └── traveller/              # Traveller sub-app
│       ├── auth/               # Traveller auth (login/signup)
│       ├── page.tsx            # Traveller home
│       ├── explore/            # Browse drivers by city
│       ├── driver/             # Driver detail page
│       ├── tour/               # Tour detail & booking
│       ├── bookings/           # Traveller booking history
│       ├── profile/            # Traveller profile
│       └── support/            # Traveller support tickets
├── components/
│   ├── bookings/               # BookingCard
│   ├── tours/
│   │   └── TourWizard/         # 7-step tour creation wizard
│   ├── traveller/              # Traveller-specific components
│   ├── ui/                     # Shared UI primitives
│   └── providers/              # React context providers
├── contexts/
│   └── AuthContext.tsx         # Supabase auth state
├── hooks/                      # Data-fetching hooks
├── lib/
│   ├── supabase.ts             # Supabase client
│   └── utils.ts                # Shared helpers (formatCurrency, formatDate, etc.)
└── types/                      # TypeScript interfaces
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
| **Account signup** | Registration with name, email, phone, and password. Creates a row in the `travellers` table. |
| **Home screen** | State/city selector with live data (only cities that have published tours). Dynamic hero images from Wikimedia. |
| **Explore drivers** | Browse all drivers operating in the selected city. View driver photo, rating, vehicle, tour types, and verification badge. |
| **Driver detail** | Full driver profile: bio, languages, specialties, all offered tours with stops, schedules, and pricing. |
| **Tour booking** | Select tour date, guest count, and pickup location on an interactive Leaflet map. Booking saves pickup address + coordinates. |
| **Flexi booking** | Book by-the-hour rides: select hours, start/end times, and pickup point. |
| **Pickup map** | Leaflet map with OpenStreetMap tiles. Click/drag to pin exact pickup location. Reverse-geocodes address via Nominatim. |
| **Booking history** | View all bookings (upcoming, ongoing, completed, cancelled). See OTP codes for trip verification. |
| **Post-trip rating** | Rate the driver 1–5 stars with an optional comment after trip completion. |
| **Booking cancellation** | Cancel pending bookings before the driver confirms. |
| **Support tickets** | Create and track support tickets. |

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
| `/traveller/profile` | `app/traveller/profile/page.tsx` | Traveller profile editor |
| `/traveller/support` | `app/traveller/support/page.tsx` | Traveller support tickets |

---

## Components

### `src/components/bookings/`

| Component | Description |
|---|---|
| `BookingCard.tsx` | Full booking card for driver view. Expandable detail panel showing traveller info, booking details, pickup location with Google Maps link, OTP entry fields, and action buttons (Confirm / Decline / Start Trip / End Trip). Shows traveller's post-trip rating on completed bookings. |

### `src/components/tours/`

| Component | Description |
|---|---|
| `TourCard.tsx` | Driver's tour listing card. Shows tour code, city/state, category, vehicle info, schedule, price, and status badge. Three-dot action menu: Publish/Pause, Edit, Duplicate, Delete. |

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
| `useTraveller` | `travellers` | Traveller profile read/update. |
| `useTravellerBookings` | `bookings`, `drivers`, `tours`, `driver_cars` | Traveller bookings: create tour/flexi booking with pickup coords, cancel, submit rating. |
| `useSupport` | `support_tickets` | Create and read support tickets. Role-scoped (`"driver"` or `"traveller"`). Handles missing table gracefully. |

---

## Types

### `src/types/tour.ts`

```ts
type TourStatus    = "draft" | "published" | "paused" | "past"
type TourCategory  = "city_sightseeing" | "outer_city_sightseeing" | "flexi" | "heritage"
                   | "nature" | "food" | "adventure" | "religious" | "coastal" | "city"
type BookingStatus = "pending" | "confirmed" | "ongoing" | "completed" | "cancelled"

interface TourStop     { id, name, description?, durationMinutes, order }
interface TourSchedule { startTime, endTime, daysOfWeek[], specificDates? }
interface Tour         { id, driverId, name, tourCode, city, state, category, stops,
                         schedule, fullCabPrice, overtimeRatePerHour, hourlyRate,
                         airportDropPrice, railwayDropPrice, busStationDropPrice,
                         offersAirportDrop, offersRailwayDrop, offersBusDrop,
                         offersHourly, isAc, isPetFriendly, smokingAllowed,
                         maxGuests, rating, reviewCount, status, ... }
interface Booking      { id, tourId, tourName, tourDate, guest, status, totalAmount,
                         tourType, hoursRequested, flexiStartTime, flexiEndTime,
                         startOtp, endOtp, travellerRating, ratingComment,
                         pickupAddress, pickupLat, pickupLng, ... }
interface TourDraft    { /* wizard state — mirrors Tour for create/edit */ }
```

### `src/types/driver.ts`

```ts
type FuelType    = "petrol" | "diesel" | "cng" | "hybrid" | "ev"
type VehicleType = "hatchback" | "sedan" | "suv" | "van" | "tempo"
type Gender      = "male" | "female" | "other" | ""

interface Driver { id, name, rating, totalToursRun, totalGuestsHosted,
                   bio, languages, specialties, yearsExperience, age, gender,
                   phone, photoUrl, aadharNumber, aadharFrontUrl, aadharBackUrl,
                   isVerified, isAvailable, hourlyRate, primaryCar, allCars }
```

### `src/types/car.ts`

```ts
interface DriverCar      { id, driverId, carBrand, vehicleModel, vehiclePlate,
                           vehicleType, vehicleCapacity, fuelType, isAc,
                           isPetFriendly, smokingAllowed, luggageCapacityBags,
                           cabPhoto, isActive, createdAt }
interface DriverCarDraft { /* Omit<DriverCar, 'id' | 'driverId' | 'createdAt'> */ }
```

### `src/types/traveller.ts`

```ts
type TourType = "city_sightseeing" | "outer_city_sightseeing" | "flexi"

interface Traveller        { id, name, phone, email, createdAt }
interface TravellerBooking { id, driverName, driverPhoto, vehicleModel,
                             tourName, tourDate, tourType, status,
                             startOtp, endOtp, travellerRating, ratingComment,
                             pickupAddress, pickupLat, pickupLng, ... }
```

---

## Database Schema

### Tables

#### `drivers`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Matches Supabase auth user id |
| `name` | text | |
| `email` | text | |
| `phone` | text | Optional |
| `age` | int | |
| `gender` | text | |
| `photo_url` | text | Supabase Storage URL |
| `bio` | text | |
| `languages` | text[] | |
| `specialties` | text[] | |
| `years_experience` | int | |
| `aadhar_number` | text | |
| `aadhar_front_url` | text | Supabase Storage URL |
| `aadhar_back_url` | text | Supabase Storage URL |
| `is_verified` | boolean | Auto-set when Aadhaar + photos are present |
| `is_available` | boolean | |
| `hourly_rate` | numeric | |
| `rating` | numeric | Updated by DB trigger |
| `total_tours_run` | int | Updated by DB trigger |
| `total_guests_hosted` | int | Updated by DB trigger |

#### `driver_cars`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | |
| `driver_id` | uuid | FK → drivers |
| `car_brand` | text | |
| `vehicle_model` | text | |
| `vehicle_plate` | text | |
| `vehicle_type` | text | hatchback / sedan / suv / van / tempo |
| `vehicle_capacity` | int | Seat count |
| `fuel_type` | text | petrol / diesel / cng / hybrid / ev |
| `is_ac` | boolean | |
| `is_pet_friendly` | boolean | |
| `smoking_allowed` | boolean | |
| `luggage_capacity_bags` | int | |
| `cab_photo` | text | Supabase Storage URL |
| `is_active` | boolean | |
| `created_at` | timestamptz | |

#### `tours`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | |
| `driver_id` | uuid | FK → drivers |
| `car_id` | uuid | FK → driver_cars |
| `name` | text | Auto-generated (city + driver + vehicle) |
| `tour_code` | text | Short unique code, e.g. `MABA-X1-DEZIRE-01` |
| `city` | text | |
| `state` | text | |
| `country` | text | Default: India |
| `category` | text | TourCategory enum value |
| `tour_type` | text | city_sightseeing / outer_city_sightseeing / flexi |
| `status` | text | draft / published / paused / past |
| `full_cab_price` | numeric | Price for the entire cab |
| `overtime_rate_per_hour` | numeric | |
| `hourly_rate` | numeric | For flexi tours |
| `airport_drop_price` | numeric | |
| `railway_drop_price` | numeric | |
| `bus_station_drop_price` | numeric | |
| `offers_airport_drop` | boolean | |
| `offers_railway_drop` | boolean | |
| `offers_bus_drop` | boolean | |
| `offers_hourly` | boolean | |
| `is_ac` | boolean | |
| `is_pet_friendly` | boolean | |
| `smoking_allowed` | boolean | |
| `max_guests` | int | |
| `start_time` | time | |
| `end_time` | time | |
| `days_of_week` | int[] | 0=Sun … 6=Sat |
| `estimated_duration_minutes` | int | |
| `rating` | numeric | |
| `review_count` | int | |
| `current_bookings` | int | |

#### `tour_stops`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | |
| `tour_id` | uuid | FK → tours |
| `name` | text | |
| `duration_minutes` | int | |
| `stop_order` | int | Display order |

#### `bookings`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | |
| `tour_id` | uuid | FK → tours (nullable for flexi) |
| `driver_id` | uuid | FK → drivers |
| `traveller_id` | uuid | FK → travellers |
| `guest_name` | text | |
| `guest_count` | int | |
| `tour_date` | date | |
| `total_amount` | numeric | |
| `status` | text | pending / confirmed / ongoing / completed / cancelled |
| `tour_type` | text | |
| `hours_requested` | int | Flexi only |
| `hourly_rate` | numeric | Flexi only |
| `flexi_start_time` | time | Flexi only |
| `flexi_end_time` | time | Flexi only |
| `special_requests` | text | |
| `start_otp` | text | 4-digit, generated on confirm |
| `end_otp` | text | 4-digit, generated on trip start |
| `traveller_rating` | int | 1–5 |
| `rating_comment` | text | |
| `pickup_address` | text | Reverse-geocoded from map pin |
| `pickup_lat` | float8 | |
| `pickup_lng` | float8 | |
| `created_at` | timestamptz | |

#### `travellers`
| Column | Type |
|---|---|
| `id` | uuid (= auth user id) |
| `name` | text |
| `phone` | text |
| `email` | text |
| `created_at` | timestamptz |

#### `support_tickets`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | |
| `user_id` | uuid | FK → auth user |
| `user_role` | text | `"driver"` or `"traveller"` |
| `category` | text | |
| `subject` | text | |
| `description` | text | |
| `status` | text | open / in_progress / resolved |
| `admin_reply` | text | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

### DB Trigger

**`024_driver_stats_trigger`** — `SECURITY DEFINER` trigger on the `bookings` table. Automatically updates `drivers.rating`, `drivers.total_tours_run`, and `drivers.total_guests_hosted` whenever a booking is completed or a traveller rating is submitted. This ensures driver stats are always accurate without client-side aggregation.

---

## Authentication

The app uses **Supabase Auth** (email + password only).

### Driver Auth Flow
1. **Signup** — `supabase.auth.signUp({ email, password, options: { data: { name } } })` → DB trigger / insert creates a row in `drivers` with `id` = auth user id.
2. **Login** — `supabase.auth.signInWithPassword({ email, password })` → redirect to `/dashboard`.
3. **Forgot password** — `supabase.auth.resetPasswordForEmail(email, { redirectTo: .../auth/reset-password })`.
4. **Logout** — `supabase.auth.signOut()` from `AuthContext`.

### Traveller Auth Flow
Same Supabase calls, but signup inserts into `travellers` instead of `drivers`. Separate UI at `/traveller/auth/`.

### Session Management
`AuthContext` wraps the app with a single Supabase `onAuthStateChange` listener, reactively updating `session` and `user` state. Route guards (`RequireAuth`, `RequireTravellerAuth`) redirect unauthenticated users to their respective login pages.

---

## Storage

Supabase Storage bucket: **`driver-photos`**

| Path pattern | Content |
|---|---|
| `{userId}/profile.{ext}` | Driver profile photo |
| `{userId}/aadhar-front.{ext}` | Aadhaar card front image |
| `{userId}/aadhar-back.{ext}` | Aadhaar card back image |
| `{userId}/car-{carId}.{ext}` | Car photo |

All uploads use `upsert: true` so re-uploads overwrite the previous file at the same path.

---

## Deployment

The app builds to a **fully static export** (no Node.js server needed at runtime).

### Build configuration (`next.config.ts`)

```ts
output: "export"          // static HTML/CSS/JS only
basePath: "/hifive-mobility"   // GitHub Pages subpath
assetPrefix: "/hifive-mobility/"
trailingSlash: true
images: { unoptimized: true }  // required for static export
```

### GitHub Actions (`.github/workflows/deploy.yml`)

Triggers on push to `main` or manual dispatch.

```
1. actions/checkout@v4
2. actions/configure-pages@v4   → switches Pages source to "GitHub Actions"
3. actions/setup-node@v4        → Node 20, npm cache
4. npm ci
5. npm run build                → injects NEXT_PUBLIC_SUPABASE_* from secrets
6. touch ./out/.nojekyll        → prevents Jekyll from processing the output
7. actions/upload-pages-artifact@v3
8. actions/deploy-pages@v4
```

### GitHub Pages settings

Pages source must be set to **GitHub Actions** (not "Deploy from a branch") at:  
`github.com/alokmaurya/hifive-mobility/settings/pages`

### SPA routing on GitHub Pages

Because GitHub Pages returns a 404 for unknown paths, a custom `404.html` captures the URL and redirects to `/?p=<original-path>`. The root `layout.tsx` includes an inline script that reads the `?p=` query param and restores the original path via `window.location.replace` on load.

---

## Local Development

```bash
# Clone the repo
git clone https://github.com/alokmaurya/hifive-mobility.git
cd hifive-mobility

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note:** In development, `basePath` is empty so the app runs at `/`. In production builds, it runs at `/hifive-mobility`.

### Other commands

```bash
npm run build    # production static export → ./out
npm run lint     # ESLint
```

---

## Environment Variables

| Variable | Description | Where to set |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `.env.local` (local) / GitHub Secrets or Variables (CI) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous public key | `.env.local` (local) / GitHub Secrets or Variables (CI) |

For GitHub Actions CI, add these as either:
- **Repository Secrets** (`Settings → Secrets and variables → Actions → Secrets`)
- **Repository Variables** (`Settings → Secrets and variables → Actions → Variables`)

The workflow reads both with `secrets.X || vars.X` so either approach works.

---

## Contributing

1. Create a feature branch from `main`: `git checkout -b feat/your-feature`
2. Make your changes and commit with a descriptive message
3. Push and open a pull request against `main`
4. CI will build and lint automatically

---

*Built with Next.js + Supabase + Tailwind CSS. Deployed on GitHub Pages.*
