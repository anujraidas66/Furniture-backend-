import mongoose from "mongoose";

const productSchema = new mongoose.Schema({

  title: {
    type: String,
    unique: true,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  rating:{
    type: Number,
    default: 0
  },

  price: {
    type: Number,
    required: true
  },


  image: [{ type: String,
  required: true }], // multiple images

  stock: {
    type: Number,
    default: 0
  },

  category: {
    type: String,
    required: true
  },

    sku: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },

  tags: [{
    type: String,
    lowercase: true,
    trim: true,
    required: true
  }],



  colors: [{ type: String, required: true }], // multiple colors
    sizes: [{ type: String, required: true }]  // multiple sizes


}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
export default Product;
