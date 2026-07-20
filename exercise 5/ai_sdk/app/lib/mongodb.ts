import mongoose, { Schema } from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ai_chat_db";

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  await mongoose.connect(MONGODB_URI);

  isConnected = true;
  console.log("✅ MongoDB connected");
}

const MovieSchema = new Schema({
  title: String,
  genre: String,
  rating: Number,
});

const userSchema = new Schema({
  name: String,
  age: Number,
});

const reviewSchema = new Schema({
  movieId: Schema.Types.ObjectId,
  userId: Schema.Types.ObjectId,
  comment: String,
  rating: Number,
});

export const Movie =
  mongoose.models.Movie || mongoose.model("Movie", MovieSchema);

export const User =
  mongoose.models.User || mongoose.model("User", userSchema);

export const Review =
  mongoose.models.Review || mongoose.model("Review", reviewSchema);