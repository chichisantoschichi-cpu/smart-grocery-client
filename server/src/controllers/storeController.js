import Store from '../models/Store.js';
import Purchase from '../models/Purchase.js';

// GET /api/stores
export const getStores = async (req, res) => {
  const stores = await Store.find().sort({ name: 1 });
  res.status(200).json(stores);
};

// GET /api/stores/:id
export const getStoreById = async (req, res) => {
  const store = await Store.findById(req.params.id);
  if (!store) {
    return res.status(404).json({ message: 'Store not found' });
  }
  res.status(200).json(store);
};

// POST /api/stores
export const createStore = async (req, res) => {
  const { name, location, contactNumber } = req.body;
  const store = await Store.create({ name, location, contactNumber });
  res.status(201).json(store);
};

// PUT /api/stores/:id
export const updateStore = async (req, res) => {
  const { name, location, contactNumber } = req.body;
  const store = await Store.findByIdAndUpdate(
    req.params.id,
    { name, location, contactNumber },
    { new: true, runValidators: true }
  );
  if (!store) {
    return res.status(404).json({ message: 'Store not found' });
  }
  res.status(200).json(store);
};

// DELETE /api/stores/:id
export const deleteStore = async (req, res) => {
  const store = await Store.findById(req.params.id);
  if (!store) {
    return res.status(404).json({ message: 'Store not found' });
  }

  const purchaseCount = await Purchase.countDocuments({ storeId: store._id });
  if (purchaseCount > 0) {
    return res.status(400).json({
      message: `Cannot delete store with ${purchaseCount} purchase(s).`,
    });
  }

  await store.deleteOne();
  res.status(200).json({ message: 'Store deleted successfully' });
};
