// ch1

// PROVIDERS
import AuthProvider from "@/context/AuthProvider";
import { PublicDataProvider } from "./context/PublicDataProvider";
import { ThemeProvider } from "@/context/ThemeProvider";
import { SessionProvider } from "@/context/SessionProvider";
import { OrdersProvider } from "@/context/OrdersContext";
import { Toaster } from "sonner";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';

// LAYOUTS
import PublicLayout from "@/components/layouts/PublicLayout";
import AdminLayout from "@/components/layouts/AdminLayout";

// GATES
import IntranetPortal from "@/context/IntranetPortal";

// UNIVERSALES
import NotFound from "@/pages/NotFound";

// PUBLICS
import { HomePage } from "@/pages/public/HomePage";
import { MenuPage } from "@/pages/public/MenuPage";
import { PromotionsPage } from "@/pages/public/PromotionsPage";
import { StoresPage } from "@/pages/public/StoresPage";
import { AboutPage } from "@/pages/public/AboutPage";
import { ContactPage } from "@/pages/public/ContactPage";
//import { LoginPage } from "@/pages/LoginPage";
//import { RegisterPage } from "@/pages/public/RegisterPage";
import { CartPage } from "@/pages/public/CartPage";
import { CheckoutPage } from "@/pages/public/CheckoutPage";
import { OrderTrackingPage } from "@/pages/public/OrderTrackingPage";
import { StoreSelectionPage } from "@/pages/public/StoreSelectionPage";
//import { ProfilePage } from "@/pages/public/ProfilePage";

// ADMINS
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { AdminLogin } from "@/pages/admin/AdminLogin";
import { OrderManagement } from "@/pages/admin/OrderManagement";
import { ProductManagement } from "@/pages/admin/ProductManagement";
import { RecipeManagement } from "@/pages/admin/RecipeManagement";
import { CustomerManagement } from "@/pages/admin/CustomerManagement";
import { SettingsPage } from "@/pages/admin/SettingsPage";
import { BranchManagement } from "@/pages/admin/BranchManagement";
import { DeliveryManagement } from "@/pages/admin/DeliveryManagement";
import { ProductStockManagement } from "@/pages/admin/ProductStockManagement";
import { ComboManagement } from "@/pages/admin/ComboManagement";
import { MaterialManagement } from "@/pages/admin/MaterialManagement";
import { MaterialStockManagement } from "@/pages/admin/MaterialStockManagement";
import { MenuManagement } from "@/pages/admin/MenuManagement";
import { MetricsManagement } from "@/pages/admin/MetricsManagement";
import { FabricaProducir } from "@/pages/admin/FabricaProducir";
import { FabricaTransferir } from "@/pages/admin/FabricaTransferir";
import { CategoryManagement } from "@/pages/admin/CategoryManagement";
import { AdminDataProvider } from "./context/AdminDataProvider";

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
        <BrowserRouter basename="/demo/nonino/">
            <QueryClientProvider client={queryClient}>
                <SessionProvider>

                    <Routes>
                        {/* PUBLIC */}
                        <Route
                            element={
                                <PublicDataProvider>
                                    <PublicLayout />
                                </PublicDataProvider>
                            }
                        >
                            <Route index element={<HomePage />} />
                            <Route path="/menu" element={<MenuPage />} />
                            <Route path="/promociones" element={<PromotionsPage />} />
                            <Route path="/locales" element={<StoresPage />} />
                            <Route path="/nosotros" element={<AboutPage />} />
                            <Route path="/contacto" element={<ContactPage />} />
                            <Route path="/pedir" element={<StoreSelectionPage />} />
                            <Route path="/carrito" element={<CartPage />} />
                            <Route path="/checkout" element={<CheckoutPage />} />
                            <Route path="/tracking/:orderId" element={<OrderTrackingPage />} />
                        </Route>

                        {/* INTRANET */}
                        <Route path="/intranet" element={<Navigate to="/intranet/login" replace />} />
                        <Route path="/intranet/*" element={<IntranetPortal />} >
                            <Route path="login" element={<AdminLogin />} />

                            {/* ADMIN */}
                            <Route path="admin"
                                element={
                                    <AuthProvider allowedRole={'ADMIN'}>
                                        <ThemeProvider>
                                            <AdminDataProvider>
                                                <OrdersProvider>
                                                    <AdminLayout />
                                                </OrdersProvider>
                                            </AdminDataProvider>
                                        </ThemeProvider>
                                    </AuthProvider>
                                }
                            >
                                <Route index element={<AdminDashboard />} />
                                <Route path="ordenes" element={<OrderManagement />} />
                                <Route path="menu" element={<MenuManagement />} />
                                <Route path="productos" element={<ProductManagement />} />
                                <Route path="categorias" element={<CategoryManagement />} />
                                <Route path="materiales" element={<MaterialManagement />} />
                                <Route path="combos" element={<ComboManagement />} />
                                <Route path="sucursal-menu" element={<MenuManagement />} />
                                <Route path="sucursal-configurar" element={<BranchManagement />} />
                                <Route path="sucursal-delivery" element={<DeliveryManagement />} />
                                <Route path="inventario-productos" element={<ProductStockManagement />} />
                                <Route path="inventario-materiales" element={<MaterialStockManagement />} />
                                <Route path="fabrica-producir" element={<FabricaProducir />} />
                                <Route path="fabrica-transferir" element={<FabricaTransferir />} />
                                <Route path="clientes" element={<CustomerManagement />} />
                                <Route path="metricas" element={<MetricsManagement />} />
                                <Route path="configuracion" element={<SettingsPage />} />
                            </Route>

                            {/* LOCAL */}
                            <Route path="local"
                                element={
                                    <AuthProvider allowedRole={'LOCAL'}>
                                        <ThemeProvider>
                                            <AdminDataProvider>
                                                <OrdersProvider>
                                                    <AdminLayout />
                                                </OrdersProvider>
                                            </AdminDataProvider>
                                        </ThemeProvider>
                                    </AuthProvider>
                                }
                            >
                                <Route index element={<AdminDashboard />} />
                                <Route path="ordenes" element={<OrderManagement />} />
                                <Route path="sucursal" element={<BranchManagement />} />
                                <Route path="sucursal-envios" element={<DeliveryManagement />} />
                                <Route path="inventario-productos" element={<ProductStockManagement />} />
                                <Route path="inventario-receta" element={<RecipeManagement />} />
                                <Route path="metricas" element={<MetricsManagement />} />
                            </Route>

                            {/* FABRICA */}
                            <Route path="fabrica"
                                element={
                                    <AuthProvider allowedRole={'FABRICA'}>
                                        <ThemeProvider>
                                            <AdminDataProvider>
                                                <OrdersProvider>
                                                    <AdminLayout />
                                                </OrdersProvider>
                                            </AdminDataProvider>
                                        </ThemeProvider>
                                    </AuthProvider>
                                }
                            >
                                <Route index element={<AdminDashboard />} />
                                <Route path="inventario-productos" element={<ProductStockManagement />} />
                                <Route path="inventario-receta" element={<RecipeManagement />} />
                            </Route>
                        </Route>

                        {/* FALLBACK */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>

                    <Toaster
                        position="bottom-right"
                        toastOptions={{
                            style: { background: '#f7a82a', color: 'white' },
                            className: 'empanada-toast',
                        }}
                    />

                </SessionProvider>
            </QueryClientProvider>
        </BrowserRouter>
    );
}

export default App;