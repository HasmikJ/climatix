# Climate Analytics Backend

A Node.js/TypeScript backend service for climate data analytics, providing GraphQL API endpoints for temperature data with candlestick chart support.

## 🚀 Features

- **GraphQL API** - Apollo Server with temperature data queries
- **Real-time Data** - WebSocket support for live weather events
- **Candlestick Charts** - OHLC (Open, High, Low, Close) data aggregation
- **MongoDB Integration** - Data persistence with Mongoose ODM
- **TypeScript** - Full type safety and modern development experience
- **Error Handling** - Comprehensive error management middleware
- **Testing** - Jest test suite with coverage reporting

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB instance
- npm or yarn

## 🛠️ Installation

1. **Clone and navigate to the backend directory:**

   ```bash
   cd climatix/backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Environment Setup:**

   Start MongoDB locally - and set the database URL in the `.env` file.

   Create a `.env` file in the backend directory:

   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/climate
   NODE_ENV=development
   ```

## 🏃‍♂️ Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

### Debug Mode

```bash
npm run dev:debug
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🏗️ Project Structure

```
src/
├── bootstrap.ts                 # Application bootstrap
├── main.ts                     # Server entry point
├── container.ts                # Dependency injection
├── clients/                    # WebSocket clients
├── config/                     # Configuration files
├── core/                       # Core business logic
├── graphql/                    # GraphQL schemas and resolvers
├── middleware/                 # Express middleware
├── shared/                     # Shared types and utilities
├── temperature/                # Temperature service
└── weather/                    # Weather data models and processing
```
