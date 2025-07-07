import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "";

export async function connectMongo(): Promise<void> {
  try {
    // Mongoose supports a separate strictQuery option to avoid strict mode for query filters. 
    // This is because empty query filters cause Mongoose to return all documents in the model
    mongoose.set("strictQuery", true);

    await mongoose.connect(MONGO_URI, {
      dbName: "climate",
      autoIndex: false, // Recommended in production
      maxPoolSize: 10, // Limit concurrent connections
    });

    console.log(`✅ Connected to MongoDB at ${MONGO_URI}`);

    handleMongoEvents();
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

function handleMongoEvents() {
  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ MongoDB disconnected");
  });

  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("🛑 MongoDB connection closed due to app termination");
    process.exit(0);
  });
}
