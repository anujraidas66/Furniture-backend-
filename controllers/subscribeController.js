import Subscribe from "../models/subscribe.js";

export const createSubscribe = async (req, res) => {
  const { email } = req.body;
  const userId = req.userId || null; // optional user from middleware

  try {
    // Check if already subscribed
    const existing = await Subscribe.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already subscribed" });

    const subscribe = new Subscribe({ email, user: userId });
    await subscribe.save();

    res.status(201).json({ message: "Subscribed successfully", subscribe });
  } catch (err) {
    res.status(500).json({ message: "Login user only subscribe", error: err.message });
  }
};


export const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscribe.find()
      .populate("user", "name email") // populate name and email from User
      .sort({ createdAt: -1 });

    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ message: "Failed to get subscribers", error: err.message });
  }
};
