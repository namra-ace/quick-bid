import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME || undefined,
      serverSelectionTimeoutMS: 10000,
    });
    console.log("✅ MongoDB connected:", conn.connection.host, conn.connection.name);
  } catch (err) {
    console.error("❌ Database connection error:", err);
    process.exit(1);
  }
};

export default connectDB;
