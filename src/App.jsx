// fucking GIT

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "@/context/CartContext";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Provider as ChakraProvider } from "@/components/ui/provider"

import PublicLayout from "@/components/layouts/PublicLayout";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import IntranetPortal from "@/context/IntranetPortal";
import AuthProvider from "@/context/AuthProvider";

// Páginas universales
import NotFound from "@/pages/NotFound";

// Páginas públicas
import { HomePage } from "@/pages/public/HomePage";
import { MenuPage } from "@/pages/public/MenuPage";
import { PromotionsPage } from "@/pages/public/PromotionsPage";
import { StoresPage } from "@/pages/public/StoresPage";
import { AboutPage } from "@/pages/public/AboutPage";
import { ContactPage } from "@/pages/public/ContactPage";
import { LoginPage } from "@/pages/LoginPage";
//import { RegisterPage } from "@/pages/public/RegisterPage";
import { CartPage } from "@/pages/public/CartPage";
import { CheckoutPage } from "@/pages/public/CheckoutPage";
import { OrderTrackingPage } from "@/pages/public/OrderTrackingPage";
//import { ProfilePage } from "@/pages/public/ProfilePage";

// Páginas de administración
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
//import { AdminLogin } from "@/pages/admin/AdminLogin";
import { OrderManagement } from "@/pages/admin/OrderManagement";
import { ProductManagement } from "@/pages/admin/ProductManagement";
import { InventoryManagement } from "@/pages/admin/InventoryManagement";
import { CustomerManagement } from "@/pages/admin/CustomerManagement";
import { ReportsPage } from "@/pages/admin/ReportsPage";
import { SettingsPage } from "@/pages/admin/SettingsPage";

// Componentes de protección
//import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
//import { AdminRoute } from "@/components/auth/AdminRoute";
import { SessionProvider } from "@/context/SessionProvider";
import { AdminLogin } from "./pages/admin/AdminLogin";

// Crear cliente de React Query
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

function App() {
    return (
        <BrowserRouter>
            <SessionProvider>
                <CartProvider>
                    <QueryClientProvider client={queryClient}>
                        <ChakraProvider>

                            <Routes>
                                {/* PUBLIC */}
                                <Route element={<PublicLayout />}>
                                    <Route index element={<HomePage />} />
                                    <Route path="/menu" element={<MenuPage />} />
                                    <Route path="/promociones" element={<PromotionsPage />} />
                                    <Route path="/locales" element={<StoresPage />} />
                                    <Route path="/nosotros" element={<AboutPage />} />
                                    <Route path="/contacto" element={<ContactPage />} />
                                    <Route path="/carrito" element={<CartPage />} />
                                    <Route path="/checkout" element={<CheckoutPage />} />
                                    <Route path="/tracking/:orderId" element={<OrderTrackingPage />} />
                                </Route>

                                {/* INTRANET */}
                                <Route path="/intranet" element={<Navigate to="/intranet/login" replace />} />
                                <Route path="/intranet/*" element={<IntranetPortal />} >
                                    <Route path="login" element={<AdminLogin/>} />

                                    {/* ADMIN */}
                                    <Route path="admin"
                                        element={
                                            <AuthProvider allowedRole={'ADMIN'}>
                                                <AdminLayout />
                                            </AuthProvider>
                                        }
                                    >
                                        <Route index element={<AdminDashboard />} />
                                        <Route path="pedidos" element={<OrderManagement />} />
                                        <Route path="productos" element={<ProductManagement />} />
                                        <Route path="inventario" element={<InventoryManagement />} />
                                        <Route path="clientes" element={<CustomerManagement />} />
                                        <Route path="reportes" element={<ReportsPage />} />
                                        <Route path="configuracion" element={<SettingsPage />} />
                                    </Route>
                                </Route>

                                {/* FALLBACK */}
                                <Route path="*" element={<NotFound />} />
                            </Routes>

                        </ChakraProvider>
                    </QueryClientProvider>
                </CartProvider>
            </SessionProvider>
        </BrowserRouter>
    );
}

export default App;