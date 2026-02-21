import express from "express";
import {  getSubscribers, createSubscribe } from "../controllers/subscribeController.js";
import { checkAdmin, checkUser } from "../middleware/checkUser.js";

const router = express.Router();

// Subscribe endpoint (public)
router.post("/", checkUser, createSubscribe); // checkUser optional if you want userId
// Admin: get all subscribers
router.get("/", checkUser, checkAdmin, getSubscribers);

export default router;
