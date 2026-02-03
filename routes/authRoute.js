import express from 'express';
import { getProfile, login, register, updateProfile } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { updateAddress } from '../controllers/addressController.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);


router.get('/profile',authMiddleware,getProfile);
router.patch('/profile',authMiddleware,updateProfile);

router.patch('/update-address',authMiddleware,updateAddress);

export default router;

