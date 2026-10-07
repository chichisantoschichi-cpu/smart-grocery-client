import mongoose from 'mongoose';
import Purchase from '../models/Purchase.js';
import PurchaseItem from '../models/PurchaseItem.js';
import Product from '../models/Product.js';
import Store from '../models/Store.js';

const populatePurchase = (query) => query.populate('items').populate('store', 'name location');

// Builds PurchaseItem documents from the request body and checks that every product exists.
// Returns { items } on success or { error } with a message for a 400 response.
const buildItems = async (purchaseId, rawItems) => {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return { error: 'A purchase must have at least one item' };
  }

  const productIds = rawItems.map((item) => item.productId);
  const invalidId = productIds.find((id) => !mongoose.isValidObjectId(id));
  if (invalidId !== undefined) {
    return { error: `Invalid productId: ${invalidId}` };
  }

  const products = await Product.find({ _id: { $in: productIds } });
  const productById = new Map(products.map((product) => [product.id, product]));

  const missingId = productIds.find((id) => !productById.has(String(id)));
  if (missingId) {
    return { error: `Product not found: ${missingId}` };
  }

  const items = rawItems.map(
    (item) =>
      new PurchaseItem({
        purchaseId,
        productId: item.productId,
        productName: productById.get(String(item.productId)).name,
        quantity: item.quantity,
        // Default to the product's current price when no price is given
        unitPrice: item.unitPrice ?? productById.get(String(item.productId)).price,
      })
  );

  await Promise.all(items.map((item) => item.validate()));
  return { items };
};

// Adds (sign = 1) or removes (sign = -1) purchased quantities from product stock.
// Stock never goes below 0.
const adjustStock = async (items, sign) => {
  await Promise.all(
    items.map((item) =>
      Product.updateOne(
        { _id: item.productId },
        [{ $set: { stock: { $max: [0, { $add: ['$stock', sign * item.quantity] }] } } }],
        { updatePipeline: true }
      )
    )
  );
};

// GET /api/purchases?storeId=&from=&to=&sort=
export const getPurchases = async (req, res) => {
  const { storeId, from, to, sort = 'newest' } = req.query;
  const filter = {};

  if (storeId) {
    if (!mongoose.isValidObjectId(storeId)) {
      return res.status(400).json({ message: `Invalid storeId: ${storeId}` });
    }
    filter.storeId = storeId;
  }

  if (from || to) {
    filter.purchaseDate = {};
    if (from) filter.purchaseDate.$gte = new Date(from);
    if (to) filter.purchaseDate.$lte = new Date(to);
    if (Object.values(filter.purchaseDate).some((date) => Number.isNaN(date.getTime()))) {
      return res.status(400).json({ message: 'from and to must be valid dates' });
    }
  }

  const purchases = await populatePurchase(
    Purchase.find(filter).sort({ purchaseDate: sort === 'oldest' ? 1 : -1 })
  );

  let result = purchases.map((purchase) => purchase.toJSON());
  if (sort === 'total-high') result.sort((a, b) => b.totalAmount - a.totalAmount);
  if (sort === 'total-low') result.sort((a, b) => a.totalAmount - b.totalAmount);

  res.status(200).json(result);
};

// GET /api/purchases/:id
export const getPurchaseById = async (req, res) => {
  const purchase = await populatePurchase(Purchase.findById(req.params.id));
  if (!purchase) {
    return res.status(404).json({ message: 'Purchase not found' });
  }
  res.status(200).json(purchase);
};

// POST /api/purchases  body: { storeId, purchaseDate, notes, items: [{ productId, quantity, unitPrice }] }
export const createPurchase = async (req, res) => {
  const { storeId, purchaseDate, notes, items: rawItems } = req.body;
  const purchase = new Purchase({ storeId, purchaseDate, notes });
  await purchase.validate();

  if (!(await Store.exists({ _id: purchase.storeId }))) {
    return res.status(400).json({ message: `Store not found: ${purchase.storeId}` });
  }

  const { items, error } = await buildItems(purchase._id, rawItems);
  if (error) {
    return res.status(400).json({ message: error });
  }

  await purchase.save();
  await PurchaseItem.insertMany(items);
  await adjustStock(items, 1);

  const created = await populatePurchase(Purchase.findById(purchase._id));
  res.status(201).json(created);
};

// PUT /api/purchases/:id  (replaces the purchase details and its items)
export const updatePurchase = async (req, res) => {
  const purchase = await Purchase.findById(req.params.id);
  if (!purchase) {
    return res.status(404).json({ message: 'Purchase not found' });
  }

  const { storeId, purchaseDate, notes, items: rawItems } = req.body;
  purchase.set({ storeId, purchaseDate, notes });
  await purchase.validate();

  if (!(await Store.exists({ _id: purchase.storeId }))) {
    return res.status(400).json({ message: `Store not found: ${purchase.storeId}` });
  }

  const { items, error } = await buildItems(purchase._id, rawItems);
  if (error) {
    return res.status(400).json({ message: error });
  }

  const oldItems = await PurchaseItem.find({ purchaseId: purchase._id });
  await adjustStock(oldItems, -1);
  await PurchaseItem.deleteMany({ purchaseId: purchase._id });

  await purchase.save();
  await PurchaseItem.insertMany(items);
  await adjustStock(items, 1);

  const updated = await populatePurchase(Purchase.findById(purchase._id));
  res.status(200).json(updated);
};

// DELETE /api/purchases/:id
export const deletePurchase = async (req, res) => {
  const purchase = await Purchase.findById(req.params.id);
  if (!purchase) {
    return res.status(404).json({ message: 'Purchase not found' });
  }

  const items = await PurchaseItem.find({ purchaseId: purchase._id });
  await adjustStock(items, -1);
  await PurchaseItem.deleteMany({ purchaseId: purchase._id });
  await purchase.deleteOne();

  res.status(200).json({ message: 'Purchase deleted successfully' });
};
