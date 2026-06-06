import mongoose from "mongoose";

const mongoURI = process.env.MONGO_URL || `mongodb://0.0.0.0:27017/invoice`;

export async function runDb() {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected successfully to mongo server");
  } catch (error) {
    console.log("Can not connect to db:", error);
    await mongoose.disconnect();
  }
}
