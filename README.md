# Fleet Score Gamification Portal

A React-based Fleet Score Gamification portal that transforms fleet management performance tracking into an engaging, interactive experience with advanced recommendation management and enhanced user experience design.

## Features

- React frontend with dynamic gamification features
- Interactive performance dashboards
- Recommendation management with action tracking
- React Query for efficient data management
- TypeScript for type-safe development
- Modal-based workflow for recommendation actions
- Perplexity AI integration for intelligent chatbot insights
- Tailwind CSS for responsive design
- PostgreSQL database for persistent storage
- Framer Motion for smooth animations

## Prerequisites

- Node.js (v18.x or later)
- PostgreSQL database
- Perplexity API key (for chatbot functionality)

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/fleetgamification
PGUSER=your_pg_username
PGPASSWORD=your_pg_password
PGHOST=localhost
PGPORT=5432
PGDATABASE=fleetgamification

# Perplexity AI API (for chatbot - required for the chat feature)
# Get your API key from https://www.perplexity.ai/settings/api
PERPLEXITY_API_KEY=your_perplexity_api_key
```

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd fleet-score-gamification
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up the PostgreSQL database

Make sure your PostgreSQL server is running, then create a new database:

```bash
createdb fleetgamification
```

Or connect to PostgreSQL and create the database:

```bash
psql
CREATE DATABASE fleetgamification;
\q
```

### 4. Push the database schema

```bash
npm run db:push
```

### 5. Seed the database with initial data

```bash
# Run the seed script directly with tsx
npx tsx server/seed.ts

# For additional recommendation data
npx tsx server/seed-recommendations.ts

# For updated vehicle data
npx tsx server/seed-data.ts
```

### 6. Start the development server

```bash
npm run dev
```

This will start the Express server for the backend and Vite server for the frontend. The application will be available at http://localhost:5000

## Project Structure

- `/client` - Frontend React application
  - `/src/components` - React components
  - `/src/lib` - Utility functions and data
  - `/src/pages` - Page components
- `/server` - Backend Express server
  - `/routes.ts` - API endpoints
  - `/storage.ts` - Database operations
  - `/seed.ts` - Database seeding
- `/shared` - Shared code between frontend and backend
  - `/schema.ts` - Database schema definitions

## API Endpoints

- `/api/users` - User management
- `/api/vehicles` - Vehicle data
- `/api/recommendations` - Fleet recommendations
- `/api/integrations` - Service integrations

## Database Schema

The application uses the following main database tables:

- `users` - User accounts
- `vehicles` - Fleet vehicles with performance metrics
- `recommendations` - Recommended actions for fleet improvement
- `recommendation_steps` - Steps to complete each recommendation
- `integration_services` - Available integration services
- `fleet_integrations` - User connections to external services

## External Services Integration

The application can integrate with fleet management services including:
- WEX (fuel cards)
- Auto Integrate (maintenance)
- Fleetio (fleet management)
- CEI (collision management)
- ChargePoint (EV charging)

## License

This project is licensed under the MIT License.