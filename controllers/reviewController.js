import Product from "../models/product.js";
import Review from "../models/Review.js";

export const getReviews = async (req, res) => {
  const { id } = req.params;
  try {
    const reviews = await Review.find({ product: id }).populate({
      path: "user",
      select: "username",
    });
    res.status(200).json(reviews);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const addReview = async (req, res) => {
  const { id } = req.params; // product ID
  const { rating, comment } = req.body;

  try {
    await Review.create({
      user: req.userId,
      product: id,
      rating,
      comment,
    });

    // update product avg rating
    const reviews = await Review.find({ product: id });
    const product = await Product.findById(id);

    const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    product.rating = Number(avg.toFixed(1));
    await product.save();

    res.status(201).json({ message: "Review added successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};