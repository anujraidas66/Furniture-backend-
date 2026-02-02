
import express from 'express';
import { adminAuthenticate, authMiddleware } from '../middlewares/authMiddleware.js';
import { createCategories, getCategories } from '../controllers/categoryController.js';
const router = express.Router();

router.post('/', authMiddleware,adminAuthenticate,createCategories);
router.get('/',authMiddleware, getCategories);

export default router;