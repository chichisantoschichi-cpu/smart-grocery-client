// API tests for every endpoint. Run with: npm test
// They use a separate "smart_grocery_test" database that is dropped at the end,
// so the real data in smart_grocery is never touched.
import 'dotenv/config';
import { after, before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import '../src/config/db.js';
import app from '../src/app.js';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

let server;
let baseUrl;

const request = async (method, path, body) => {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: response.status, body: await response.json() };
};

const get = (path) => request('GET', path);
const post = (path, body) => request('POST', path, body);
const put = (path, body) => request('PUT', path, body);
const del = (path) => request('DELETE', path);

// Local date as YYYY-MM-DD, the same format the purchase form sends
const daysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().split('T')[0];
};

const MISSING_ID = '000000000000000000000000';

// Records created along the way and shared between tests
const ids = {};

before(async () => {
  // Keeps the request logger quiet while the tests run
  process.env.NODE_ENV = 'test';
  await mongoose.connect(process.env.MONGO_URI, { dbName: 'smart_grocery_test' });
  await mongoose.connection.dropDatabase();
  await Promise.all(Object.values(mongoose.models).map((model) => model.init()));

  server = app.listen(0);
  baseUrl = `http://localhost:${server.address().port}/api`;
});

after(async () => {
  server?.close();
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('General', () => {
  test('GET /health returns ok', async () => {
    const res = await get('/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'ok');
  });

  test('unknown route returns JSON 404', async () => {
    const res = await get('/does-not-exist');
    assert.equal(res.status, 404);
    assert.match(res.body.message, /Route not found/);
  });

  test('invalid JSON body returns 400', async () => {
    const response = await fetch(`${baseUrl}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{ bad json',
    });
    assert.equal(response.status, 400);
  });
});

describe('Categories', () => {
  test('POST creates a category (201)', async () => {
    const res = await post('/categories', { name: 'Vegetables', description: 'Fresh vegetables' });
    assert.equal(res.status, 201);
    assert.equal(res.body.name, 'Vegetables');
    assert.ok(res.body.id);
    ids.category = res.body.id;

    const second = await post('/categories', { name: 'Dairy', description: 'Milk and eggs' });
    ids.emptyCategory = second.body.id;
  });

  test('POST without a name returns 400 with field errors', async () => {
    const res = await post('/categories', { description: 'No name' });
    assert.equal(res.status, 400);
    assert.ok(res.body.errors.name);
  });

  test('POST with a duplicate name returns 400', async () => {
    const res = await post('/categories', { name: 'Vegetables' });
    assert.equal(res.status, 400);
    assert.match(res.body.message, /already exists/);
  });

  test('GET one returns the category', async () => {
    const res = await get(`/categories/${ids.category}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.name, 'Vegetables');
  });

  test('GET with an invalid id returns 400', async () => {
    const res = await get('/categories/abc');
    assert.equal(res.status, 400);
  });

  test('GET a missing category returns 404', async () => {
    const res = await get(`/categories/${MISSING_ID}`);
    assert.equal(res.status, 404);
    assert.equal(res.body.message, 'Category not found');
  });

  test('PUT updates the category', async () => {
    const res = await put(`/categories/${ids.category}`, {
      name: 'Vegetables',
      description: 'Fresh vegetables and herbs',
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.description, 'Fresh vegetables and herbs');
  });

  test('PUT on a missing category returns 404', async () => {
    const res = await put(`/categories/${MISSING_ID}`, { name: 'Nothing' });
    assert.equal(res.status, 404);
  });
});

describe('Stores', () => {
  test('POST creates stores (201)', async () => {
    const market = await post('/stores', { name: 'Public Market', location: 'Poblacion' });
    const mall = await post('/stores', {
      name: 'SM Supermarket',
      location: 'SM City',
      contactNumber: '09171234567',
    });
    assert.equal(market.status, 201);
    assert.equal(mall.status, 201);
    ids.market = market.body.id;
    ids.mall = mall.body.id;
  });

  test('POST with an invalid contact number returns 400', async () => {
    const res = await post('/stores', { name: 'Bad Phone Store', contactNumber: '12345' });
    assert.equal(res.status, 400);
    assert.ok(res.body.errors.contactNumber);
  });

  test('GET lists stores sorted by name', async () => {
    const res = await get('/stores');
    assert.equal(res.status, 200);
    assert.deepEqual(
      res.body.map((store) => store.name),
      ['Public Market', 'SM Supermarket'],
    );
  });

  test('PUT updates and GET one returns the store', async () => {
    const updated = await put(`/stores/${ids.market}`, { name: 'Public Market', location: 'Palengke' });
    assert.equal(updated.status, 200);

    const res = await get(`/stores/${ids.market}`);
    assert.equal(res.body.location, 'Palengke');
  });

  test('DELETE removes an unused store', async () => {
    const created = await post('/stores', { name: 'Temporary Store' });
    const res = await del(`/stores/${created.body.id}`);
    assert.equal(res.status, 200);
    assert.equal((await get(`/stores/${created.body.id}`)).status, 404);
  });
});

describe('Products', () => {
  test('POST creates products with a stock status', async () => {
    const tomatoes = await post('/products', {
      name: 'Tomatoes',
      categoryId: ids.category,
      unit: 'kg',
      price: 80,
      stock: 0,
      minStock: 1,
    });
    assert.equal(tomatoes.status, 201);
    assert.equal(tomatoes.body.stockStatus, 'out-of-stock');
    ids.tomatoes = tomatoes.body.id;

    const onions = await post('/products', {
      name: 'Onions',
      categoryId: ids.category,
      unit: 'kg',
      price: 120,
      stock: 1,
      minStock: 2,
    });
    assert.equal(onions.body.stockStatus, 'low-stock');
    ids.onions = onions.body.id;

    const garlic = await post('/products', {
      name: 'Garlic',
      categoryId: ids.category,
      unit: 'kg',
      price: 140,
      stock: 5,
      minStock: 1,
    });
    assert.equal(garlic.body.stockStatus, 'in-stock');
    ids.garlic = garlic.body.id;
  });

  test('POST with missing fields returns 400 for each field', async () => {
    const res = await post('/products', { name: 'X' });
    assert.equal(res.status, 400);
    for (const field of ['name', 'categoryId', 'unit', 'price']) {
      assert.ok(res.body.errors[field], `expected an error for ${field}`);
    }
  });

  test('POST with an invalid unit returns 400', async () => {
    const res = await post('/products', {
      name: 'Rice',
      categoryId: ids.category,
      unit: 'sack',
      price: 50,
    });
    assert.equal(res.status, 400);
    assert.ok(res.body.errors.unit);
  });

  test('POST with a category that does not exist returns 400', async () => {
    const res = await post('/products', {
      name: 'Rice',
      categoryId: MISSING_ID,
      unit: 'kg',
      price: 50,
    });
    assert.equal(res.status, 400);
    assert.match(res.body.message, /Category not found/);
  });

  test('GET one includes the category name', async () => {
    const res = await get(`/products/${ids.tomatoes}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.categoryName, 'Vegetables');
    assert.equal(res.body.categoryId, ids.category);
  });

  test('GET list supports search, filters and sort', async () => {
    const search = await get('/products?search=oni');
    assert.deepEqual(search.body.map((p) => p.name), ['Onions']);

    const byPrice = await get('/products?sort=price-desc');
    assert.deepEqual(byPrice.body.map((p) => p.name), ['Garlic', 'Onions', 'Tomatoes']);

    const priceRange = await get('/products?minPrice=100&maxPrice=130');
    assert.deepEqual(priceRange.body.map((p) => p.name), ['Onions']);

    const lowStock = await get('/products?stockStatus=low-stock');
    assert.deepEqual(lowStock.body.map((p) => p.name), ['Onions']);
  });

  test('GET list with an invalid sort or category returns 400', async () => {
    assert.equal((await get('/products?sort=bogus')).status, 400);
    assert.equal((await get('/products?categoryId=abc')).status, 400);
  });

  test('GET /low-stock lists products to restock with a suggested quantity', async () => {
    const res = await get('/products/low-stock');
    assert.equal(res.status, 200);
    assert.equal(res.body.count, 2);

    const onions = res.body.products.find((p) => p.name === 'Onions');
    // suggested = minStock * 2 - stock = 2 * 2 - 1 = 3, cost = 3 * 120
    assert.equal(onions.suggestedQuantity, 3);
    assert.equal(onions.estimatedCost, 360);

    const tomatoes = res.body.products.find((p) => p.name === 'Tomatoes');
    // suggested = 1 * 2 - 0 = 2, cost = 2 * 80
    assert.equal(tomatoes.estimatedCost, 160);
    assert.equal(res.body.totalEstimatedCost, 520);
  });

  test('PUT updates the product and recomputes stock status', async () => {
    const res = await put(`/products/${ids.garlic}`, {
      name: 'Garlic',
      categoryId: ids.category,
      unit: 'kg',
      price: 150,
      stock: 1,
      minStock: 1,
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.price, 150);
    assert.equal(res.body.stockStatus, 'low-stock');
  });

  test('DELETE removes an unused product', async () => {
    const created = await post('/products', {
      name: 'Temporary',
      categoryId: ids.category,
      unit: 'piece',
      price: 1,
    });
    assert.equal((await del(`/products/${created.body.id}`)).status, 200);
    assert.equal((await get(`/products/${created.body.id}`)).status, 404);
  });
});

describe('Purchases', () => {
  test('POST records a purchase, computes totals and adds stock', async () => {
    const res = await post('/purchases', {
      storeId: ids.market,
      purchaseDate: daysAgo(0),
      notes: 'Weekly run',
      items: [
        { productId: ids.tomatoes, quantity: 2, unitPrice: 75 },
        { productId: ids.onions, quantity: 1.5, unitPrice: 110 },
      ],
    });
    assert.equal(res.status, 201);
    // 2 * 75 + 1.5 * 110 = 150 + 165
    assert.equal(res.body.totalAmount, 315);
    assert.equal(res.body.storeName, 'Public Market');
    assert.equal(res.body.items.length, 2);
    assert.equal(res.body.items[0].productName, 'Tomatoes');
    assert.equal(res.body.items[0].subtotal, 150);
    ids.purchase = res.body.id;

    const tomatoes = await get(`/products/${ids.tomatoes}`);
    assert.equal(tomatoes.body.stock, 2);
    assert.equal(tomatoes.body.stockStatus, 'in-stock');
  });

  test('POST without unitPrice uses the current product price', async () => {
    const res = await post('/purchases', {
      storeId: ids.mall,
      purchaseDate: daysAgo(0),
      items: [{ productId: ids.tomatoes, quantity: 1 }],
    });
    assert.equal(res.status, 201);
    assert.equal(res.body.items[0].unitPrice, 80);
    ids.mallPurchase = res.body.id;
  });

  test('POST with no items returns 400', async () => {
    const res = await post('/purchases', { storeId: ids.market, purchaseDate: daysAgo(0), items: [] });
    assert.equal(res.status, 400);
    assert.match(res.body.message, /at least one item/);
  });

  test('POST with a future date returns 400', async () => {
    const res = await post('/purchases', {
      storeId: ids.market,
      purchaseDate: daysAgo(-7),
      items: [{ productId: ids.tomatoes, quantity: 1 }],
    });
    assert.equal(res.status, 400);
    assert.ok(res.body.errors.purchaseDate);
  });

  test('POST with a store or product that does not exist returns 400', async () => {
    const badStore = await post('/purchases', {
      storeId: MISSING_ID,
      purchaseDate: daysAgo(0),
      items: [{ productId: ids.tomatoes, quantity: 1 }],
    });
    assert.equal(badStore.status, 400);

    const badProduct = await post('/purchases', {
      storeId: ids.market,
      purchaseDate: daysAgo(0),
      items: [{ productId: MISSING_ID, quantity: 1 }],
    });
    assert.equal(badProduct.status, 400);
  });

  test('POST with an invalid quantity returns 400', async () => {
    const res = await post('/purchases', {
      storeId: ids.market,
      purchaseDate: daysAgo(0),
      items: [{ productId: ids.tomatoes, quantity: 0 }],
    });
    assert.equal(res.status, 400);
  });

  test('GET one returns the purchase with items', async () => {
    const res = await get(`/purchases/${ids.purchase}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.items.length, 2);
    assert.equal(res.body.notes, 'Weekly run');
  });

  test('GET a missing purchase returns 404', async () => {
    assert.equal((await get(`/purchases/${MISSING_ID}`)).status, 404);
  });

  test('GET list filters by store and sorts by total', async () => {
    const byStore = await get(`/purchases?storeId=${ids.mall}`);
    assert.equal(byStore.body.length, 1);

    const byTotal = await get('/purchases?sort=total-high');
    assert.deepEqual(byTotal.body.map((p) => p.totalAmount), [315, 80]);

    assert.equal((await get('/purchases?from=not-a-date')).status, 400);
  });

  test('PUT replaces the items and adjusts stock by the difference', async () => {
    const res = await put(`/purchases/${ids.purchase}`, {
      storeId: ids.market,
      purchaseDate: daysAgo(0),
      notes: 'Weekly run',
      items: [
        { productId: ids.tomatoes, quantity: 4, unitPrice: 75 },
        { productId: ids.onions, quantity: 1.5, unitPrice: 110 },
      ],
    });
    assert.equal(res.status, 200);
    // 4 * 75 + 165
    assert.equal(res.body.totalAmount, 465);

    // started at 0, +4 from this purchase, +1 from the SM purchase
    const tomatoes = await get(`/products/${ids.tomatoes}`);
    assert.equal(tomatoes.body.stock, 5);
  });

  test('cannot delete a product, store or category that is still in use', async () => {
    const product = await del(`/products/${ids.tomatoes}`);
    assert.equal(product.status, 400);
    assert.match(product.body.message, /Cannot delete product/);

    const store = await del(`/stores/${ids.market}`);
    assert.equal(store.status, 400);

    const category = await del(`/categories/${ids.category}`);
    assert.equal(category.status, 400);
  });

  test('GET /products/:id/price-history returns prices and stats', async () => {
    const res = await get(`/products/${ids.tomatoes}/price-history`);
    assert.equal(res.status, 200);
    assert.equal(res.body.history.length, 2);
    assert.equal(res.body.stats.lowest, 75);
    assert.equal(res.body.stats.highest, 80);
    assert.equal(res.body.stats.average, 77.5);
  });
});

describe('Budgets', () => {
  const now = new Date();
  const month = MONTHS[now.getMonth()];
  const year = now.getFullYear();

  test('POST creates a budget for the current month', async () => {
    const res = await post('/budgets', { month, year, amount: 600 });
    assert.equal(res.status, 201);
    ids.budget = res.body.id;
  });

  test('POST a second budget for the same month returns 400', async () => {
    const res = await post('/budgets', { month, year, amount: 1000 });
    assert.equal(res.status, 400);
  });

  test('POST with an invalid month or amount returns 400', async () => {
    const res = await post('/budgets', { month: 'Smarch', year, amount: 0 });
    assert.equal(res.status, 400);
    assert.ok(res.body.errors.month);
    assert.ok(res.body.errors.amount);
  });

  test('GET list includes spent, remaining and status', async () => {
    const res = await get('/budgets');
    const budget = res.body.find((b) => b.id === ids.budget);
    // purchases this month: 465 + 80 = 545 of 600
    assert.equal(budget.spent, 545);
    assert.equal(budget.remaining, 55);
    assert.equal(budget.percentUsed, 90.83);
    assert.equal(budget.status, 'warning');
  });

  test('GET /:id/status computes the daily pace and projection', async () => {
    const res = await get(`/budgets/${ids.budget}/status`);
    assert.equal(res.status, 200);
    assert.equal(res.body.period, 'current');
    assert.equal(res.body.purchaseCount, 2);
    assert.equal(res.body.daysElapsed, now.getDate());

    const dailyAverage = Math.round((545 / now.getDate()) * 100) / 100;
    assert.equal(res.body.dailyAverage, dailyAverage);
    assert.equal(res.body.projectedToExceed, res.body.projectedSpending > 600);
  });

  test('PUT lowering the amount turns the status to over-budget', async () => {
    const updated = await put(`/budgets/${ids.budget}`, { month, year, amount: 500 });
    assert.equal(updated.status, 200);

    const res = await get(`/budgets/${ids.budget}`);
    assert.equal(res.body.status, 'over-budget');
    assert.equal(res.body.remaining, -45);
  });

  test('GET a missing budget returns 404', async () => {
    assert.equal((await get(`/budgets/${MISSING_ID}`)).status, 404);
    assert.equal((await get(`/budgets/${MISSING_ID}/status`)).status, 404);
  });
});

describe('Analytics', () => {
  test('GET /summary returns totals and highlights', async () => {
    const res = await get('/analytics/summary');
    assert.equal(res.status, 200);
    assert.equal(res.body.totalSpending, 545);
    assert.equal(res.body.purchaseCount, 2);
    assert.equal(res.body.averagePerPurchase, 272.5);
    assert.equal(res.body.highestCategory.name, 'Vegetables');
    assert.equal(res.body.topProduct.name, 'Tomatoes');
  });

  test('GET /monthly-spending returns 12 months with the current one filled in', async () => {
    const now = new Date();
    const res = await get(`/analytics/monthly-spending?year=${now.getFullYear()}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.months.length, 12);

    const current = res.body.months[now.getMonth()];
    assert.equal(current.spent, 545);
    assert.equal(current.budget, 500);
    assert.equal(current.budgetStatus, 'over-budget');
  });

  test('GET /monthly-spending with an invalid year returns 400', async () => {
    assert.equal((await get('/analytics/monthly-spending?year=abc')).status, 400);
  });

  test('GET /category-breakdown percentages add up to 100', async () => {
    const res = await get('/analytics/category-breakdown');
    assert.equal(res.status, 200);
    const total = res.body.categories.reduce((sum, c) => sum + c.percent, 0);
    assert.equal(Math.round(total), 100);
  });

  test('GET /store-comparison finds the cheapest store per product', async () => {
    const res = await get('/analytics/store-comparison');
    const tomatoes = res.body.find((p) => p.productName === 'Tomatoes');
    assert.equal(tomatoes.cheapestStore, 'Public Market');
    assert.equal(tomatoes.priceDifference, 5);
  });
});

describe('Cleanup rules', () => {
  test('DELETE a purchase removes its items and takes the stock back out', async () => {
    const res = await del(`/purchases/${ids.purchase}`);
    assert.equal(res.status, 200);

    const tomatoes = await get(`/products/${ids.tomatoes}`);
    assert.equal(tomatoes.body.stock, 1);
    assert.equal((await get(`/purchases/${ids.purchase}`)).status, 404);
  });

  test('DELETE an empty category and a budget', async () => {
    assert.equal((await del(`/categories/${ids.emptyCategory}`)).status, 200);
    assert.equal((await del(`/budgets/${ids.budget}`)).status, 200);
  });
});
