import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Category from '../models/Category.js';
import Store from '../models/Store.js';
import Product from '../models/Product.js';
import Budget from '../models/Budget.js';
import Purchase from '../models/Purchase.js';
import PurchaseItem from '../models/PurchaseItem.js';

const categoryData = [
  { name: 'Rice & Grains', description: 'Rice, oats, pasta, and other grain-based groceries.' },
  { name: 'Meat & Poultry', description: 'Chicken, pork, beef, and other meat products.' },
  { name: 'Vegetables', description: 'Fresh vegetables and cooking ingredients.' },
  { name: 'Fruits', description: 'Fresh fruits and seasonal produce.' },
  { name: 'Dairy', description: 'Milk, cheese, eggs, butter, and related products.' },
  { name: 'Beverages', description: 'Water, juices, soft drinks, coffee, and other drinks.' },
  { name: 'Bakery', description: 'Bread, buns, pastries, and baked products.' },
  { name: 'Snacks', description: 'Instant noodles, chips, biscuits, and snack foods.' },
  { name: 'Household', description: 'Cleaning supplies, toiletries, and home essentials.' },
];

const storeData = [
  { name: 'SM Supermarket', location: 'SM City Mall', contactNumber: '09171234567' },
  { name: 'Puregold', location: 'Town Center', contactNumber: '09181234567' },
  { name: 'Robinsons Supermarket', location: 'Robinsons Place', contactNumber: '09191234567' },
  { name: 'Public Market', location: 'Palengke, Poblacion', contactNumber: '' },
];

// [name, category, unit, current price, stock, minStock]
const productData = [
  ['Rice', 'Rice & Grains', 'kg', 52, 8, 5],
  ['Rolled Oats', 'Rice & Grains', 'pack', 95, 1, 1],
  ['Chicken Breast', 'Meat & Poultry', 'kg', 210, 1, 2],
  ['Pork Belly', 'Meat & Poultry', 'kg', 320, 0, 1],
  ['Ground Beef', 'Meat & Poultry', 'kg', 380, 1, 1],
  ['Tomatoes', 'Vegetables', 'kg', 80, 1, 1],
  ['Onions', 'Vegetables', 'kg', 120, 0, 1],
  ['Garlic', 'Vegetables', 'kg', 140, 1, 1],
  ['Bananas', 'Fruits', 'kg', 70, 2, 1],
  ['Fresh Milk', 'Dairy', 'liter', 95, 1, 2],
  ['Eggs', 'Dairy', 'dozen', 108, 1, 1],
  ['Bottled Water', 'Beverages', 'bottle', 25, 6, 6],
  ['Instant Coffee', 'Beverages', 'pack', 150, 1, 1],
  ['Loaf Bread', 'Bakery', 'pack', 75, 0, 1],
  ['Instant Noodles', 'Snacks', 'pack', 16, 10, 6],
  ['Dishwashing Liquid', 'Household', 'bottle', 65, 1, 1],
];

const budgetData = [
  { month: 'May', year: 2026, amount: 4500 },
  { month: 'June', year: 2026, amount: 4500 },
  { month: 'July', year: 2026, amount: 3800 },
  { month: 'August', year: 2026, amount: 4500 },
  { month: 'September', year: 2026, amount: 4500 },
  { month: 'October', year: 2026, amount: 5000 },
];

// JavaScript months start at 0: 4 = May ... 9 = October
const SEED_YEAR = 2026;
const SEED_MONTHS = [4, 5, 6, 7, 8, 9];
const TRIP_DAYS = [3, 10, 17, 24];

// Each trip: [product index from productData, quantity]
const shoppingTrips = [
  [[0, 5], [2, 1.5], [5, 1], [6, 0.5], [10, 1], [11, 6]],
  [[3, 1], [7, 0.25], [8, 1.5], [9, 2], [13, 2], [14, 10]],
  [[2, 2], [4, 1], [5, 1], [12, 1], [11, 6], [15, 1]],
  [[0, 5], [1, 1], [8, 1], [9, 2], [10, 1], [13, 1]],
];

// Monthly price change per product: some go up, one goes down
const PRICE_RATES = [0.01, 0.02, -0.005, 0.015];

const historicalPrice = (currentPrice, productIndex, monthOffset) => {
  const monthsAgo = SEED_MONTHS.length - 1 - monthOffset;
  const rate = PRICE_RATES[productIndex % PRICE_RATES.length];
  return Math.round(currentPrice * (1 - rate * monthsAgo) * 100) / 100;
};

const seed = async () => {
  try {
    await connectDB();

    await Promise.all([
      Category.deleteMany(),
      Store.deleteMany(),
      Product.deleteMany(),
      Budget.deleteMany(),
      Purchase.deleteMany(),
      PurchaseItem.deleteMany(),
    ]);
    console.log('Cleared existing data');

    const categories = await Category.insertMany(categoryData);
    const categoryIdByName = Object.fromEntries(categories.map((c) => [c.name, c._id]));

    const stores = await Store.insertMany(storeData);

    const products = await Product.insertMany(
      productData.map(([name, category, unit, price, stock, minStock]) => ({
        name,
        categoryId: categoryIdByName[category],
        unit,
        price,
        stock,
        minStock,
      }))
    );

    await Budget.insertMany(budgetData);

    const today = new Date();
    let purchaseCount = 0;
    let itemCount = 0;

    for (const [monthOffset, monthIndex] of SEED_MONTHS.entries()) {
      for (const [tripIndex, trip] of shoppingTrips.entries()) {
        const purchaseDate = new Date(SEED_YEAR, monthIndex, TRIP_DAYS[tripIndex]);
        if (purchaseDate > today) continue;

        const purchase = await Purchase.create({
          storeId: stores[(monthOffset + tripIndex) % stores.length]._id,
          purchaseDate,
          notes: `Week ${tripIndex + 1} grocery run`,
        });

        const items = trip.map(([productIndex, quantity]) => {
          const product = products[productIndex];
          return {
            purchaseId: purchase._id,
            productId: product._id,
            productName: product.name,
            quantity,
            unitPrice: historicalPrice(product.price, productIndex, monthOffset),
          };
        });

        await PurchaseItem.insertMany(items);
        purchaseCount += 1;
        itemCount += items.length;
      }
    }

    console.log(`Seeded ${categories.length} categories`);
    console.log(`Seeded ${stores.length} stores`);
    console.log(`Seeded ${products.length} products`);
    console.log(`Seeded ${budgetData.length} budgets`);
    console.log(`Seeded ${purchaseCount} purchases with ${itemCount} items`);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seed();