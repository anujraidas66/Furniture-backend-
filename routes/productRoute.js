import express from 'express';
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  getRelatedProducts,
  updateProduct
} from '../controllers/productController.js';
import { notAllowed } from '../utils/notAllowed.js';
import { checkFile, updateCheckFile } from '../middleware/checkFiles.js';
import { checkId } from '../middleware/checkId.js';
import { checkAdmin, checkUser } from '../middleware/checkUser.js';

const router = express.Router();

// --- All Products ---
router
  .route('/api/products')
  .get(getProducts)
  .post(checkUser, checkAdmin, checkFile, createProduct)
  .all(notAllowed);

// --- Single Product ---
router
  .route('/api/products/:id')
  .get(checkId, getProduct)
  .patch(checkId, checkUser, checkAdmin, updateCheckFile, updateProduct)
  .delete(checkId, checkUser, checkAdmin, deleteProduct)
  .all(notAllowed);

router.route("/api/products/:id/related")
  .get(getRelatedProducts);

export default router;




// import express from 'express';
// import { createProduct, deleteProduct, getProduct,
//      getProducts, getProductsByCategory, updateProduct } from '../controllers/productController.js';
// import { notAllowed } from '../utils/notAllowed.js';
// import { checkFile, updateCheckFile } from '../middleware/checkFiles.js';
// import { checkId } from '../middleware/checkId.js';
// import { checkAdmin, checkUser } from '../middleware/checkUser.js';
// const router = express.Router();

// router.route('/api/products')
// .get(getProducts)
// .post(checkUser,checkAdmin,checkFile,createProduct).all(notAllowed);

// router.route('/api/products/:id')
// .get(checkId,getProduct)
// .patch(checkId,updateCheckFile,updateProduct)
// .delete(checkId,deleteProduct).all(notAllowed);


// //category wise data filter;
// router.route('/api/products/category/:category')
//   .get(getProductsByCategory);
// export default router;

