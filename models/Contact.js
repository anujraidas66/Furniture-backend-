import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    subject: {
      type: String,
      required: true
    },

    message: {
      type: String,
      required: true
    },

    // ✅ Admin reply fields
    reply: {
      type: String,
      default: null
    },

    repliedAt: {
      type: Date,
      default: null
    },

    repliedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  { timestamps: true }
);

export const Contact = mongoose.model("Contact", contactSchema);


