import { Router } from 'express';
import {
  getProducts,
  getLowStockProducts,
  getProductById,
  getProductPriceHistory,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

const router = Router();

router.route('/').get(getProducts).post(createProduct);
router.get('/low-stock', getLowStockProducts);
router.route('/:id').get(getProductById).put(updateProduct).delete(deleteProduct);
router.get('/:id/price-history', getProductPriceHistory);

export default router;
