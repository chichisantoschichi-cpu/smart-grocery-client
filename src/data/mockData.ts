export const dashboardData = {
  budget: {
    month: "October 2026",
    amount: 15000,
  },

  spending: {
    total: 8620,
    previousMonth: 7910,
  },

  categories: [
    { name: "Meat & Poultry", amount: 2450, percentage: 28.4 },
    { name: "Rice & Grains", amount: 1680, percentage: 19.5 },
    { name: "Vegetables", amount: 1320, percentage: 15.3 },
    { name: "Dairy", amount: 1180, percentage: 13.7 },
    { name: "Beverages", amount: 940, percentage: 10.9 },
    { name: "Snacks", amount: 650, percentage: 7.5 },
    { name: "Others", amount: 400, percentage: 4.7 },
  ],

  weeklySpending: [
    { week: "Week 1", amount: 1850 },
    { week: "Week 2", amount: 2240 },
    { week: "Week 3", amount: 1980 },
    { week: "Week 4", amount: 2550 },
  ],

  topProducts: [
    {
      name: "Chicken Breast",
      category: "Meat & Poultry",
      amount: 1280,
      purchases: 6,
    },
    {
      name: "Rice",
      category: "Rice & Grains",
      amount: 1140,
      purchases: 4,
    },
    {
      name: "Fresh Milk",
      category: "Dairy",
      amount: 820,
      purchases: 5,
    },
    {
      name: "Cooking Oil",
      category: "Pantry",
      amount: 760,
      purchases: 3,
    },
    {
      name: "Eggs",
      category: "Dairy",
      amount: 690,
      purchases: 4,
    },
  ],
};

export const budgetsData = [
  {
    id: "budget-001",
    month: "October",
    year: 2026,
    amount: 15000,
    spent: 8620,
  },
  {
    id: "budget-002",
    month: "September",
    year: 2026,
    amount: 14000,
    spent: 10850,
  },
  {
    id: "budget-003",
    month: "August",
    year: 2026,
    amount: 13500,
    spent: 12540,
  },
  {
    id: "budget-004",
    month: "July",
    year: 2026,
    amount: 12000,
    spent: 12950,
  },
];

export const groceryProducts = [
  {
    id: "product-001",
    name: "Rice",
    category: "Rice & Grains",
    unit: "kg",
    estimatedPrice: 60,
  },
  {
    id: "product-002",
    name: "Chicken Breast",
    category: "Meat & Poultry",
    unit: "kg",
    estimatedPrice: 320,
  },
  {
    id: "product-003",
    name: "Fresh Milk",
    category: "Dairy",
    unit: "liter",
    estimatedPrice: 95,
  },
  {
    id: "product-004",
    name: "Eggs",
    category: "Dairy",
    unit: "dozen",
    estimatedPrice: 125,
  },
  {
    id: "product-005",
    name: "Tomato",
    category: "Vegetables",
    unit: "kg",
    estimatedPrice: 120,
  },
  {
    id: "product-006",
    name: "Cooking Oil",
    category: "Pantry",
    unit: "liter",
    estimatedPrice: 145,
  },
  {
    id: "product-007",
    name: "Bread",
    category: "Bakery",
    unit: "pack",
    estimatedPrice: 85,
  },
  {
    id: "product-008",
    name: "Mineral Water",
    category: "Beverages",
    unit: "bottle",
    estimatedPrice: 25,
  },
  {
    id: "product-009",
    name: "Potato",
    category: "Vegetables",
    unit: "kg",
    estimatedPrice: 110,
  },
  {
    id: "product-010",
    name: "Instant Noodles",
    category: "Snacks",
    unit: "pack",
    estimatedPrice: 18,
  },
];

export const storesData = [
  "Puregold",
  "SM Supermarket",
  "Robinsons Supermarket",
  "WalterMart",
  "Landers",
  "Local Grocery",
];

export const purchasesData = [
  {
    id: "purchase-001",
    store: "Puregold",
    purchaseDate: "2026-10-03",
    notes: "Weekly grocery run",
    items: [
      {
        productId: "product-001",
        productName: "Rice",
        category: "Rice & Grains",
        quantity: 5,
        unit: "kg",
        unitPrice: 60,
        subtotal: 300,
      },
      {
        productId: "product-002",
        productName: "Chicken Breast",
        category: "Meat & Poultry",
        quantity: 2,
        unit: "kg",
        unitPrice: 320,
        subtotal: 640,
      },
      {
        productId: "product-004",
        productName: "Eggs",
        category: "Dairy",
        quantity: 2,
        unit: "dozen",
        unitPrice: 125,
        subtotal: 250,
      },
      {
        productId: "product-003",
        productName: "Fresh Milk",
        category: "Dairy",
        quantity: 2,
        unit: "liter",
        unitPrice: 95,
        subtotal: 190,
      },
    ],
  },

  {
    id: "purchase-002",
    store: "SM Supermarket",
    purchaseDate: "2026-10-01",
    notes: "Pantry restock",
    items: [
      {
        productId: "product-006",
        productName: "Cooking Oil",
        category: "Pantry",
        quantity: 2,
        unit: "liter",
        unitPrice: 145,
        subtotal: 290,
      },
      {
        productId: "product-007",
        productName: "Bread",
        category: "Bakery",
        quantity: 3,
        unit: "pack",
        unitPrice: 85,
        subtotal: 255,
      },
      {
        productId: "product-010",
        productName: "Instant Noodles",
        category: "Snacks",
        quantity: 10,
        unit: "pack",
        unitPrice: 18,
        subtotal: 180,
      },
    ],
  },

  {
    id: "purchase-003",
    store: "Robinsons Supermarket",
    purchaseDate: "2026-09-26",
    notes: "Fresh produce",
    items: [
      {
        productId: "product-005",
        productName: "Tomato",
        category: "Vegetables",
        quantity: 3,
        unit: "kg",
        unitPrice: 120,
        subtotal: 360,
      },
      {
        productId: "product-009",
        productName: "Potato",
        category: "Vegetables",
        quantity: 2,
        unit: "kg",
        unitPrice: 110,
        subtotal: 220,
      },
    ],
  },

  {
    id: "purchase-004",
    store: "WalterMart",
    purchaseDate: "2026-09-20",
    notes: "Drinks and dairy",
    items: [
      {
        productId: "product-003",
        productName: "Fresh Milk",
        category: "Dairy",
        quantity: 4,
        unit: "liter",
        unitPrice: 95,
        subtotal: 380,
      },
      {
        productId: "product-008",
        productName: "Mineral Water",
        category: "Beverages",
        quantity: 12,
        unit: "bottle",
        unitPrice: 25,
        subtotal: 300,
      },
    ],
  },

  {
    id: "purchase-005",
    store: "Puregold",
    purchaseDate: "2026-09-15",
    notes: "Monthly restock",
    items: [
      {
        productId: "product-001",
        productName: "Rice",
        category: "Rice & Grains",
        quantity: 10,
        unit: "kg",
        unitPrice: 58,
        subtotal: 580,
      },
      {
        productId: "product-002",
        productName: "Chicken Breast",
        category: "Meat & Poultry",
        quantity: 3,
        unit: "kg",
        unitPrice: 315,
        subtotal: 945,
      },
    ],
  },
];
