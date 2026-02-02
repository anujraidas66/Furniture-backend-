
import express from 'express';
import multer from "multer";
import { adminAuthenticate, authMiddleware } from '../middlewares/authMiddleware.js';
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from '../controllers/productController.js';
const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage()
});

router.post('/',authMiddleware, adminAuthenticate,upload.array("images"),createProduct);
router.patch('/:id',authMiddleware,adminAuthenticate,upload.array("images"),updateProduct);
router.delete('/:id',authMiddleware,adminAuthenticate,deleteProduct);
router.get('/:id', getProductById);
router.get('/',getProducts);

export default router;