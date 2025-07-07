# climatix 🌍

A real-time climate analytics platform that monitors and visualizes weather data across multiple cities with OHLC (Open-High-Low-Close) analysis.

## 🏗️ Architecture

The project consists of three main components:

```
├── climatix/
│   ├── backend/          # GraphQL API & WebSocket clients
│   ├── frontend/         # React dashboard
│   └── simulator/        # Weather data simulator
```

### Backend (`climatix/backend/`)

- **TypeScript/Node.js** with Express.js
- **Apollo GraphQL Server** for API endpoints
- **MongoDB** with Mongoose ODM
- **WebSocket clients** for real-time data ingestion
- **Event-driven architecture** with processors
- **Jest** testing framework

### Frontend (`climatix/frontend/`)

- **React 19** with TypeScript
- **Apollo Client** for GraphQL integration
- **ApexCharts** for interactive data visualization
- **Real-time updates** via WebSocket connections

### Simulator (`climatix/simulator/`)

- **~10 events/second** data streaming rate

## 🌟 Key Features

### Real-time Weather Monitoring

- Live temperature, wind speed, and wind direction tracking
- WebSocket-based data streaming
- Multi-city simultaneous monitoring

### Data Analytics

- **OHLC (Open-High-Low-Close)** candlestick format conversion
- Hourly data aggregation for trend analysis
- Configurable time-range filtering (default: 24 hours)
- Timezone-aware data processing with Luxon

### Interactive Visualization

- Real-time candlestick charts
- Responsive design for all screen sizes
- Historical data comparison
- City-specific data views

## 📊 Data Flow

```
Weather Simulator → WebSocket → Backend Processors → MongoDB → GraphQL API → React Frontend
```

1. **Data Generation**: Simulator creates realistic weather events
2. **Real-time Ingestion**: WebSocket clients receive and process data
3. **Storage**: Weather events stored in MongoDB with timestamps
4. **Analytics**: TemperatureService converts raw data to OHLC format
5. **API**: GraphQL provides flexible data querying
6. **Visualization**: React components render interactive charts
