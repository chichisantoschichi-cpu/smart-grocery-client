import { createBrowserRouter } from "react-router";

import App from "../App";
import DashboardLayout from "../layouts/DashboardLayout";

// Landing
import LandingPage from "../pages/Landing/LandingPage";

// Dashboard
import DashboardPage from "../pages/Dashboard/DashboardPage";

// Budgets
import BudgetsPage from "../pages/Budgets/BudgetsPage";
import CreateBudgetPage from "../pages/Budgets/CreateBudgetPage";
import BudgetDetailsPage from "../pages/Budgets/BudgetDetailsPage";
import EditBudgetPage from "../pages/Budgets/EditBudgetPage";

// Products
import ProductsPage from "../pages/Products/ProductsPage";
import CreateProductPage from "../pages/Products/CreateProductPage";
import EditProductPage from "../pages/Products/EditProductPage";

// Categories
import CategoriesPage from "../pages/Categories/CategoriesPage";
import CreateCategoryPage from "../pages/Categories/CreateCategoryPage";
import EditCategoryPage from "../pages/Categories/EditCategoryPage";

// Purchases
import PurchasesPage from "../pages/Purchases/PurchasesPage";
import CreatePurchasePage from "../pages/Purchases/CreatePurchasePage";
import PurchaseDetailsPage from "../pages/Purchases/PurchaseDetailsPage";
import EditPurchasePage from "../pages/Purchases/EditPurchasePage";

// Analytics
import AnalyticsPage from "../pages/Analytics/AnalyticsPage";
import SpendingAnalysisPage from "../pages/Analytics/SpendingAnalysisPage";
import PriceTrendsPage from "../pages/Analytics/PriceTrendsPage";

// Shopping List
import ShoppingListPage from "../pages/ShoppingList/ShoppingListPage";

// Not Found
import NotFoundPage from "../pages/NotFound/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      // Public Landing Page
      {
        index: true,
        Component: LandingPage,
      },

      // Dashboard Layout
      {
        Component: DashboardLayout,
        children: [
          {
            path: "dashboard",
            Component: DashboardPage,
          },

          // Budgets
          {
            path: "budgets",
            Component: BudgetsPage,
          },
          {
            path: "budgets/new",
            Component: CreateBudgetPage,
          },
          {
            path: "budgets/:id",
            Component: BudgetDetailsPage,
          },
          {
            path: "budgets/:id/edit",
            Component: EditBudgetPage,
          },

          // Products
          {
            path: "products",
            Component: ProductsPage,
          },
          {
            path: "products/new",
            Component: CreateProductPage,
          },
          {
            path: "products/:id/edit",
            Component: EditProductPage,
          },

          // Categories
          {
            path: "categories",
            Component: CategoriesPage,
          },
          {
            path: "categories/new",
            Component: CreateCategoryPage,
          },
          {
            path: "categories/:id/edit",
            Component: EditCategoryPage,
          },

          // Purchases
          {
            path: "purchases",
            Component: PurchasesPage,
          },
          {
            path: "purchases/new",
            Component: CreatePurchasePage,
          },
          {
            path: "purchases/:id",
            Component: PurchaseDetailsPage,
          },
          {
            path: "purchases/:id/edit",
            Component: EditPurchasePage,
          },

          // Analytics
          {
            path: "analytics",
            Component: AnalyticsPage,
          },
          {
            path: "analytics/spending",
            Component: SpendingAnalysisPage,
          },
          {
            path: "analytics/prices",
            Component: PriceTrendsPage,
          },

          // Shopping List
          {
            path: "shopping-list",
            Component: ShoppingListPage,
          },
        ],
      },

      // 404
      {
        path: "*",
        Component: NotFoundPage,
      },
    ],
  },
]);
