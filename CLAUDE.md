# WanderPlan — Travel Planner App

## Overview
A full-featured travel planning app. Users plan trips: flights, accommodation, travelers, budget, itinerary. Post-MVP: flight price tracking with notifications.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS v3 + shadcn/ui |
| Routing | React Router v6 |
| Server state | TanStack Query v5 |
| Client state | Zustand |
| Backend / DB | Supabase (auth, postgres, realtime) |
| Icons | Lucide React |
| Forms | React Hook Form + Zod |
| Dates | date-fns |

---

## Design System

**Aesthetic**: Cartographic / editorial — inspired by vintage maps and travel journals. Warm off-white background (`#FAF9F6`), deep navy primary (`#1B2B4B`), amber accent (`#E8963A`), coral secondary accent (`#E85D4A`). Serif display font (Playfair Display) paired with clean sans (DM Sans).

**Tailwind config additions:**
```js
colors: {
  bg: '#FAF9F6',
  navy: '#1B2B4B',
  amber: '#E8963A',
  coral: '#E85D4A',
  muted: '#8B8677',
  surface: '#FFFFFF',
  border: '#E5E3DC',
}
```

---

## Folder Structure

```
src/
  components/
    ui/           # shadcn primitives
    common/       # shared app components (PageHeader, EmptyState, etc.)
    trips/
    flights/
    accommodation/
    travelers/
    budget/
    itinerary/
  pages/
    DashboardPage.tsx
    TripDetailPage.tsx
    TripCreatePage.tsx
  features/
    trips/
      tripsStore.ts
      tripsQueries.ts
      tripsTypes.ts
    flights/
    accommodation/
    travelers/
    budget/
    itinerary/
  lib/
    supabase.ts
    utils.ts
  hooks/
    useTrip.ts
    useBudget.ts
```

---

## Supabase Schema

### trips
| column | type | notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK | auth.users |
| title | text | "Tokyo Spring 2025" |
| destination | text | |
| start_date | date | |
| end_date | date | |
| currency | text | "USD", "EUR" |
| cover_image_url | text | optional |
| created_at | timestamp | |

### travelers
| column | type | notes |
|---|---|---|
| id | uuid PK | |
| trip_id | uuid FK | |
| name | text | |
| email | text | optional |
| is_owner | boolean | |

### flights
| column | type | notes |
|---|---|---|
| id | uuid PK | |
| trip_id | uuid FK | |
| traveler_id | uuid FK | nullable |
| from_iata | text | |
| to_iata | text | |
| departure_at | timestamptz | |
| arrival_at | timestamptz | |
| airline | text | |
| flight_number | text | |
| price | numeric | |
| currency | text | |
| is_return | boolean | |
| booking_url | text | optional |

### accommodations
| column | type | notes |
|---|---|---|
| id | uuid PK | |
| trip_id | uuid FK | |
| name | text | |
| address | text | |
| check_in | date | |
| check_out | date | |
| price_per_night | numeric | |
| currency | text | |
| booking_url | text | optional |
| confirmation_code | text | optional |

### expenses
| column | type | notes |
|---|---|---|
| id | uuid PK | |
| trip_id | uuid FK | |
| category | text | flights / accommodation / food / transport / activities / other |
| description | text | |
| amount | numeric | |
| currency | text | |
| paid_by | uuid FK | travelers |
| date | date | |

### itinerary_days
| column | type | notes |
|---|---|---|
| id | uuid PK | |
| trip_id | uuid FK | |
| date | date | |
| title | text | optional |

### itinerary_items
| column | type | notes |
|---|---|---|
| id | uuid PK | |
| day_id | uuid FK | |
| time | time | optional |
| title | text | |
| description | text | |
| category | text | activity / food / transport / free |
| location | text | optional |
| cost | numeric | optional |

### price_alerts (Post-MVP)
| column | type | notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK | |
| from_iata | text | |
| to_iata | text | |
| travel_date | date | |
| target_price | numeric | |
| currency | text | |
| is_active | boolean | |
| last_checked_at | timestamp | |
| last_price | numeric | |

---

## Code Conventions

- Functional components, named exports
- Zod schemas for all forms (React Hook Form + zodResolver)
- All Supabase calls in dedicated service files — never inline in components
- date-fns for all date logic
- No `any` — strict TypeScript
- Feature build order: Types → Service → TanStack Query hooks → Zustand (if needed) → Components → Page

---

## Development Phases

### Phase 1 — MVP
- [ ] Supabase setup + auth
- [ ] Trips CRUD
- [ ] Travelers module
- [ ] Flights module
- [ ] Accommodation module
- [ ] Budget dashboard
- [ ] Itinerary planner

### Phase 2 — Polish
- [ ] Trip cover images (Unsplash API)
- [ ] Currency conversion
- [ ] Export trip as PDF
- [ ] Share trip (read-only link)

### Phase 3 — Flight Tracking
- [ ] Price alerts UI
- [ ] Supabase Edge Function + cron (every 6h, Amadeus API)
- [ ] In-app notifications via Supabase Realtime
- [ ] Email notifications via Resend
