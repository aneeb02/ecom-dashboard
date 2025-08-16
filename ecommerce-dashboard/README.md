# E-commerce Dashboard

A full-stack dashboard application with React frontend and Node.js/Express backend.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally on port 27017)

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   The `.env` file is already configured with:
   ```
   MONGODB_URI=mongodb://localhost:27017/ecom_dashboard
   VITE_API_URL=http://localhost:4000
   ```

3. **Seed the database:**
   ```bash
   npm run seed
   ```

## Running the Application

### Option 1: Use the startup script (Recommended)
```bash
./start-servers.ps1
```
This will start both the backend (port 4000) and frontend (port 5173) servers.

### Option 2: Manual startup

1. **Start the backend server:**
   ```bash
   npm run server
   ```
   The API will be available at `http://localhost:4000`

2. **In another terminal, start the frontend:**
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

## API Endpoints

- `GET /health` - Health check
- `GET /api/kpis` - Key performance indicators
- `GET /api/revenue-over-time` - Revenue data over time
- `GET /api/products` - Product performance data
- `GET /api/channels` - Marketing channel data
- `GET /api/states` - State-wise revenue data
- `GET /api/devices` - Device performance data

## Architecture

- **Frontend**: React + Vite (with shadcn components)
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **CORS**: Enabled for frontend-backend communication
- **Proxy**: Vite proxy routes `/api/*` requests to the backend

## Key Features

🗺️ **Real-time US State Revenue Map**: Interactive choropleth map showing revenue data for all 50 states with hover tooltips and color-coded visualization

⚡ **Live Data Sync**: Automatic data refresh every 30 seconds with manual refresh option

📊 **Real-time Status**: Live status indicator showing data freshness and last update time

🎨 **Enhanced Visualizations**: Improved map colors, legends, and user interactions

## Fixed Issues

✅ **"Unexpected token '<'" error**: Fixed by updating the frontend to use the correct API hook instead of trying to fetch from a non-existent static file.

✅ **Frontend-Backend connection**: Updated the data fetching hook to use Vite's proxy configuration.

✅ **CORS configuration**: Backend properly configured with CORS middleware.

✅ **State Map Data**: Expanded from 6 states to all 50 US states with comprehensive revenue data.

✅ **Real-time Updates**: Added automatic data synchronization and manual refresh capability.

## Troubleshooting

1. **Database connection**: Ensure MongoDB is running locally on port 27017
2. **Port conflicts**: Backend uses port 4000, frontend uses port 5173
3. **API calls**: All API requests are proxied through Vite's dev server
