import mongoose from 'mongoose';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import PurchaseItem from '../models/PurchaseItem.js';

const SORT_OPTIONS = {
  name: { name: 1 },
  'price-asc': { price: 1 },
  'price-desc': { price: -1 },
  'stock-asc': { stock: 1 },
  newest: { createdAt: -1 },
};

const withStockStatus = (product) => {
  const json = product.toJSON();
  let stockStatus = 'in-stock';
  if (json.stock === 0) stockStatus = 'out-of-stock';
  else if (json.stock <= json.minStock) stockStatus = 'low-stock';
  return { ...json, stockStatus };
};

// GET /api/products?search=&categoryId=&minPrice=&maxPrice=&stockStatus=&sort=
export const getProducts = async (req, res) => {
  const { search, categoryId, minPrice, maxPrice, stockStatus, sort = 'name' } = req.query;
  const filter = {};

  if (search) {
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.name = { $regex: escaped, $options: 'i' };
  }

  if (categoryId) {
    if (!mongoose.isValidObjectId(categoryId)) {
      return res.status(400).json({ message: `Invalid categoryId: ${categoryId}` });
    }
    filter.categoryId = categoryId;
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
    if (Number.isNaN(filter.price.$gte) || Number.isNaN(filter.price.$lte)) {
      return res.status(400).json({ message: 'minPrice and maxPrice must be numbers' });
    }
  }

  if (!SORT_OPTIONS[sort]) {
    return res.status(400).json({
      message: `Invalid sort. Use one of: ${Object.keys(SORT_OPTIONS).join(', ')}`,
    });
  }

  const products = await Product.find(filter)
    .populate('categoryId', 'name')
    .sort(SORT_OPTIONS[sort]);

  let result = products.map(withStockStatus);
  if (stockStatus) {
    result = result.filter((product) => product.stockStatus === stockStatus);
  }

  res.status(200).json(result);
};

// GET /api/products/low-stock (stock at or below minStock, with how many to buy)
export const getLowStockProducts = async (req, res) => {
  const products = await Product.find({ $expr: { $lte: ['$stock', '$minStock'] } })
    .populate('categoryId', 'name')
    .sort({ stock: 1, name: 1 });

  const result = products.map((product) => {
    const json = withStockStatus(product);
    const suggestedQuantity = Math.max(json.minStock * 2 - json.stock, 1);
    return {
      ...json,
      suggestedQuantity,
      estimatedCost: Math.round(suggestedQuantity * json.price * 100) / 100,
    };
  });

  const totalEstimatedCost = result.reduce((sum, product) => sum + product.estimatedCost, 0);

  res.status(200).json({
    count: result.length,
    totalEstimatedCost: Math.round(totalEstimatedCost * 100) / 100,
    products: result,
  });
};

// GET /api/products/:id
export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('categoryId', 'name');
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.status(200).json(withStockStatus(product));
};

// GET /api/products/:id/price-history (price paid per purchase, plus min/max/avg and change)
export const getProductPriceHistory = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const items = await PurchaseItem.aggregate([
    { $match: { productId: product._id } },
    { $lookup: { from: 'purchases', localField: 'purchaseId', foreignField: '_id', as: 'purchase' } },
    { $unwind: '$purchase' },
    { $lookup: { from: 'stores', localField: 'purchase.storeId', foreignField: '_id', as: 'store' } },
    { $unwind: { path: '$store', preserveNullAndEmptyArrays: true } },
    { $sort: { 'purchase.purchaseDate': 1 } },
    {
      $project: {
        _id: 0,
        date: '$purchase.purchaseDate',
        storeName: '$store.name',
        unitPrice: 1,
        quantity: 1,
      },
    },
  ]);

  if (items.length === 0) {
    return res.status(200).json({
      productId: product.id,
      productName: product.name,
      currentPrice: product.price,
      history: [],
      stats: null,
    });
  }

  const prices = items.map((item) => item.unitPrice);
  const first = prices[0];
  const last = prices[prices.length - 1];
  const average = prices.reduce((sum, price) => sum + price, 0) / prices.length;

  res.status(200).json({
    productId: product.id,
    productName: product.name,
    currentPrice: product.price,
    history: items,
    stats: {
      lowest: Math.min(...prices),
      highest: Math.max(...prices),
      average: Math.round(average * 100) / 100,
      changeAmount: Math.round((last - first) * 100) / 100,
      changePercent: Math.round(((last - first) / first) * 10000) / 100,
      trend: last > first ? 'up' : last < first ? 'down' : 'stable',
    },
  });
};

// POST /api/products
export const createProduct = async (req, res) => {
  const { name, categoryId, unit, price, stock, minStock } = req.body;
  if (mongoose.isValidObjectId(categoryId) && !(await Category.exists({ _id: categoryId }))) {
    return res.status(400).json({ message: `Category not found: ${categoryId}` });
  }
  const product = await Product.create({ name, categoryId, unit, price, stock, minStock });
  res.status(201).json(withStockStatus(product));
};

// PUT /api/products/:id
export const updateProduct = async (req, res) => {
  const { name, categoryId, unit, price, stock, minStock } = req.body;
  if (mongoose.isValidObjectId(categoryId) && !(await Category.exists({ _id: categoryId }))) {
    return res.status(400).json({ message: `Category not found: ${categoryId}` });
  }
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { name, categoryId, unit, price, stock, minStock },
    { new: true, runValidators: true }
  );
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.status(200).json(withStockStatus(product));
};

// DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const usageCount = await PurchaseItem.countDocuments({ productId: product._id });
  if (usageCount > 0) {
    return res.status(400).json({
      message: `Cannot delete product used in ${usageCount} purchase item(s).`,
    });
  }

  await product.deleteOne();
  res.status(200).json({ message: 'Product deleted successfully' });
};
