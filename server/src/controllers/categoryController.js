import PurchaseItem from '../models/PurchaseItem.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

// GET /api/categories (includes productCount and totalSpending)
export const getCategories = async (req, res) => {
  const [categories, productCounts, spendingTotals] = await Promise.all([
    Category.find().sort({ name: 1 }),
    Product.aggregate([{ $group: { _id: '$categoryId', count: { $sum: 1 } } }]),
    PurchaseItem.aggregate([
      { $lookup: { from: 'products', localField: 'productId', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product.categoryId',
          total: { $sum: { $multiply: ['$quantity', '$unitPrice'] } },
        },
      },
    ]),
  ]);

  const countByCategory = new Map(productCounts.map((p) => [String(p._id), p.count]));
  const spendingByCategory = new Map(spendingTotals.map((s) => [String(s._id), s.total]));

  const result = categories.map((category) => ({
    ...category.toJSON(),
    productCount: countByCategory.get(category.id) ?? 0,
    totalSpending: Math.round((spendingByCategory.get(category.id) ?? 0) * 100) / 100,
  }));

  res.status(200).json(result);
};

// GET /api/categories/:id
export const getCategoryById = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }
  res.status(200).json(category);
};

// POST /api/categories
export const createCategory = async (req, res) => {
  const { name, description } = req.body;
  const category = await Category.create({ name, description });
  res.status(201).json(category);
};

// PUT /api/categories/:id
export const updateCategory = async (req, res) => {
  const { name, description } = req.body;
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { name, description },
    { new: true, runValidators: true }
  );
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }
  res.status(200).json(category);
};

// DELETE /api/categories/:id
export const deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }

  const productCount = await Product.countDocuments({ categoryId: category._id });
  if (productCount > 0) {
    return res.status(400).json({
      message: `Cannot delete category with ${productCount} product(s). Reassign or delete them first.`,
    });
  }

  await category.deleteOne();
  res.status(200).json({ message: 'Category deleted successfully' });
};