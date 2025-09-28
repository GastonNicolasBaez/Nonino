import { createBrowserRouter } from "react-router-dom";
import { PublicLayout } from "./components/layouts/PublicLayout";
import { AdminLayout } from "./components/layouts/AdminLayout";

// Páginas públicas
import { HomePage } from "./pages/public/HomePage";
import { MenuPage } from "./pages/public/MenuPage";
import { PromotionsPage } from "./pages/public/PromotionsPage";
import { StoresPage } from "./pages/public/StoresPage";
import { AboutPage } from "./pages/public/AboutPage";
import { ContactPage } from "./pages/public/ContactPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/public/RegisterPage";
import { CartPage } from "./pages/public/CartPage";
import { CheckoutPage } from "./pages/public/CheckoutPage";
import { OrderTrackingPage } from "./pages/public/OrderTrackingPage";
import { StoreSelectionPage } from "./pages/public/StoreSelectionPage";
import { ProfilePage } from "./pages/public/ProfilePage";

// Páginas de administración
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminLogin } from "./pages/admin/AdminLogin";
import { OrderManagement } from "./pages/admin/OrderManagement";
import { ProductManagement } from "./pages/admin/ProductManagement";
import { MenuManagement } from "./pages/admin/MenuManagement";
import { BranchManagement } from "./pages/admin/BranchManagement";
import { DeliveryManagement } from "./pages/admin/DeliveryManagement";
import { MaterialManagement } from "./pages/admin/MaterialManagement";
import { ComboManagement } from "./pages/admin/ComboManagement";
import { MaterialStockManagement } from "./pages/admin/MaterialStockManagement";
import { ProductStockManagement } from "./pages/admin/ProductStockManagement";
import { RecipeManagement } from "./pages/admin/RecipeManagement";
import { CustomerManagement } from "./pages/admin/CustomerManagement";
import { MetricsManagement } from "./pages/admin/MetricsManagement";
import { SettingsPage } from "./pages/admin/SettingsPage";

// Componentes de protección
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AdminRoute } from "./components/auth/AdminRoute";

export const router = createBrowserRouter([
  // Rutas públicas
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "menu",
        element: <MenuPage />,
      },
      {
        path: "promociones",
        element: <PromotionsPage />,
      },
      {
        path: "locales",
        element: <StoresPage />,
      },
      {
        path: "nosotros",
        element: <AboutPage />,
      },
      {
        path: "contacto",
        element: <ContactPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "pedir",
        element: <StoreSelectionPage />,
      },
      {
        path: "carrito",
        element: <CartPage />,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: "tracking/:orderId",
        element: <OrderTrackingPage />,
      },
      {
        path: "perfil",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
    ],
  },

  // Rutas de administración
  {
    path: "/intranet/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/intranet/admin",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "pedidos",
        element: <OrderManagement />,
      },
      {
        path: "ordenes",
        element: <OrderManagement />,
      },
      {
        path: "productos",
        element: <ProductManagement />,
      },
      {
        path: "materiales",
        element: <MaterialManagement />,
      },
      {
        path: "combos",
        element: <ComboManagement />,
      },
      {
        path: "sucursal-menu",
        element: <MenuManagement />,
      },
      {
        path: "inventario-productos",
        element: <ProductStockManagement />,
      },
      {
        path: "inventario-materiales",
        element: <MaterialStockManagement />,
      },
      {
        path: "sucursal",
        element: <BranchManagement />,
      },
      {
        path: "sucursal-envios",
        element: <DeliveryManagement />,
      },
      {
        path: "inventario",
        element: <MaterialManagement />,
      },
      {
        path: "inventario-receta",
        element: <RecipeManagement />,
      },
      {
        path: "clientes",
        element: <CustomerManagement />,
      },
      {
        path: "reportes",
        element: <MetricsManagement />,
      },
      {
        path: "metricas",
        element: <MetricsManagement />,
      },
      {
        path: "configuracion",
        element: <SettingsPage />,
      },
    ],
  },

  // Rutas de administración LOCAL
  {
    path: "/intranet/local/login",
    element: <AdminLogin />,
  },
  {
    path: "/intranet/local",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "pedidos",
        element: <OrderManagement />,
      },
      {
        path: "sucursal",
        element: <BranchManagement />,
      },
      {
        path: "sucursal-envios",
        element: <DeliveryManagement />,
      },
      {
        path: "inventario",
        element: <MaterialManagement />,
      },
      {
        path: "inventario-receta",
        element: <RecipeManagement />,
      },
      {
        path: "reportes",
        element: <MetricsManagement />,
      },
    ],
  },

  // Rutas de administración FABRICA
  {
    path: "/intranet/fabrica/login",
    element: <AdminLogin />,
  },
  {
    path: "/intranet/fabrica",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "inventario",
        element: <MaterialManagement />,
      },
      {
        path: "inventario-receta",
        element: <RecipeManagement />,
      },
    ],
  },

  // 404 Page
  {
    path: "*",
    element: (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-empanada-golden mb-4">404</h1>
          <p className="text-gray-600 mb-8">Página no encontrada</p>
          <a
            href="/"
            className="bg-empanada-golden text-white px-6 py-3 rounded-lg hover:bg-empanada-crust transition-colors"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    ),
  },
]);
