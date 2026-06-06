import mongoose from "mongoose";

const nonceSchema = new mongoose.Schema({
  nonce: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600,
  },
});

export const NonceModel = mongoose.model("Nonce", nonceSchema);
