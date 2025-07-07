# Climatix Frontend

A React-based frontend application for visualizing weather data and temperature metrics using candlestick charts.

## Features

- **Real-time Temperature Data**: Displays temperature data for cities using candlestick charts
- **GraphQL Integration**: Uses Apollo Client to fetch data from the backend GraphQL API
- **Interactive Charts**: Built with ApexCharts for responsive and interactive data visualization
- **TypeScript**: Fully typed for better development experience and code reliability

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Apollo Client** - GraphQL client
- **ApexCharts** - Chart library
- **React Scripts** - Build tooling

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:

   ```bash
   cd climatix/frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will open at `http://localhost:3000`

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App (not recommended)

## Project Structure

```
src/
├── components/
│   ├── core/
│   │   └── CandlestickChart.tsx
│   └── temperature/
│       ├── TemperatureCandlestickChart.tsx
│       ├── TemperatureOverview.tsx
│       └── temperatureChart.utils.ts
├── clients/
│   └── apolloClient.ts
├── graphql/
│   └── queries.ts
└── App.tsx
```
