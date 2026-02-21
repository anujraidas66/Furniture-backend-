import express from 'express';
import { notAllowed } from '../utils/notAllowed.js';
import {  forgotPassword, loginUser, registerUser, resetPassword } from '../controllers/userController.js';
const router = express.Router();

router.route('/api/users/login')
.post(loginUser).all(notAllowed);

router.route('/api/users/register')
.post(registerUser).all(notAllowed);


router.route('/api/users/forgot-password')
.post(forgotPassword);

router.route('/api/users/reset-password/:token')
.post(resetPassword).all(notAllowed);

export default router;