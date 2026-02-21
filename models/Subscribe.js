import mongoose from "mongoose";

const subscribeSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional user reference
  },
  { timestamps: true }
);


const Subscribe = mongoose.model("Subscribe", subscribeSchema);
export default Subscribe;
