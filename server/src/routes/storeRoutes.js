import { Router } from 'express';
import {
  getStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,
} from '../controllers/storeController.js';

const router = Router();

router.route('/').get(getStores).post(createStore);
router.route('/:id').get(getStoreById).put(updateStore).delete(deleteStore);

export default router;
