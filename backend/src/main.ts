import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import dotenv from "dotenv";
import express, { Application } from "express";
import morgan from "morgan";
import { bootstrap } from "./bootstrap";

import { resolvers } from "./graphql/resolvers";
import { typeDefs } from "./graphql/schemas";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("combined"));

async function startServer() {
  // Setup Apollo Server with your GraphQL schema and resolvers
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // TODO: Add auth logic here
      /**
       * The authentication logic should be implemented here but in separate module as it is a separate concern.
       * Depends on the auth strategy, the logic will be different (e.g. JWT, OAuth, etc.).
       * Let's assume we are using JWT.
       *
       * Option A: Local Authentication (Monolithic / Self-Contained)
       *    (The auth logic is implemented in the same file as the main logic.)
       *    - The same server handles both token issuing (e.g., login mutation) and token verification.
       *    - Uses HS256 (symmetric algorithm) or RS256 if needed.
       *    - Verifies JWT tokens locally, synchronously in Apollo’s context.
       *
       *    Token Flow:
       *       1. User logs in via a login mutation.
       *       2. Server issues a JWT signed with a secret or private key.
       *       3. On subsequent requests, client sends Authorization: Bearer <token>.
       *       4. Apollo context() verifies the token using local secret or public key.
       *
       * Option B: External Authentication (Microservices) - Let's assume we implement it in a separate service.
       *    - The auth logic is implemented in a separate service.
       *    - The auth service is responsible for issuing and verifying tokens.
       *
       *    Token Flow:
       *       1. User logs in via a login mutation.
       *       2. Server issues a JWT signed with a secret or private key.
       *       3. On subsequent requests, client sends Authorization: Bearer <token>.
       *       4. Apollo context() verifies the token using local secret or public key.
       *
       * Option C: External Authentication - from external providers, e.g Google, etc.
       *
       * The best approach is depends on the use case, e.g. complexity, scalability, etc.
       *
       */
    }
  });

  await apolloServer.start();

  // Apply Apollo middleware on /graphql route
  apolloServer.applyMiddleware({ app, path: "/graphql" });

  // 404 Middleware
  app.use(notFound);

  // Error handling middleware
  app.use(errorHandler);

  await bootstrap();

  // Start listening
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
    console.log(`📡 GraphQL endpoint at http://localhost:${PORT}/graphql`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
