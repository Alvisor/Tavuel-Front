# Tavuel Admin Dashboard

Admin panel for the Tavuel home services platform built with Next.js 15, shadcn/ui, and Tailwind CSS.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **State Management:** Zustand
- **Data Tables:** TanStack Table
- **Charts:** Recharts
- **HTTP Client:** Axios
- **Icons:** Lucide React

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy the environment variables:

```bash
cp .env.example .env.local
```

3. Update `.env.local` with your API URL.

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
  app/
    (auth)/          # Authentication pages (login)
    (dashboard)/     # Dashboard pages with sidebar layout
      dashboard/     # Main dashboard with stats
      users/         # User management
      providers/     # Provider management
      bookings/      # Booking management
      pqrs/          # PQRS management
      payments/      # Payment management
      reports/       # Reports and analytics
      settings/      # Platform settings
  components/
    ui/              # shadcn/ui components
    layout/          # Layout components (sidebar, header)
    data-tables/     # Data table components
    charts/          # Chart components
  lib/
    api/             # API client and services
    utils.ts         # Utility functions
```
