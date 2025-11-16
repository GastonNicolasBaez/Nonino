// PROVIDERS
import AuthProvider from "./context/AuthProvider";
import PublicDataProvider from "./context/PublicDataProvider";
import AdminDataProvider from "./context/AdminDataProvider";
import ThemeProvider from "./context/ThemeProvider";
import AdminThemeProvider from "./context/AdminThemeProvider";
import SessionProvider from "./context/SessionProvider";
import { Toaster } from "sonner";
import { Suspense, lazy } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';

// LAYOUTS (no lazy - necesarios inmediatamente)
import PublicLayout from "@/components/layouts/PublicLayout";
import AdminLayout from "@/components/layouts/AdminLayout";
import TotemLayout from "@/components/layouts/TotemLayout";

// GATES (no lazy - necesarios inmediatamente)
import IntranetPortal from "@/context/IntranetPortal";

// UNIVERSALES (no lazy - pequeño)
import NotFound from "@/pages/NotFound";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

// PUBLICS - CODE SPLITTING con Lazy Loading
const HomePage = lazy(() => import("@/pages/public/HomePage").then(m => ({ default: m.HomePage })));
const MenuPage = lazy(() => import("@/pages/public/MenuPage").then(m => ({ default: m.MenuPage })));
const ComboBuilderPage = lazy(() => import("@/pages/public/ComboBuilderPage").then(m => ({ default: m.ComboBuilderPage })));
const FranchisePage = lazy(() => import("@/pages/public/FranchisePage").then(m => ({ default: m.FranchisePage })));
const StoresPage = lazy(() => import("@/pages/public/StoresPage").then(m => ({ default: m.StoresPage })));
const AboutPage = lazy(() => import("@/pages/public/AboutPage").then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import("@/pages/public/ContactPage").then(m => ({ default: m.ContactPage })));
const CartPage = lazy(() => import("@/pages/public/CartPage").then(m => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import("@/pages/public/CheckoutPage").then(m => ({ default: m.CheckoutPage })));
const OrderTrackingPage = lazy(() => import("@/pages/public/OrderTrackingPage").then(m => ({ default: m.OrderTrackingPage })));
const StoreSelectionPage = lazy(() => import("@/pages/public/StoreSelectionPage").then(m => ({ default: m.StoreSelectionPage })));

// TOTEM - CODE SPLITTING (solo cargan si accedes al totem)
const TotemStoreSelection = lazy(() => import("@/pages/totem/TotemStoreSelection").then(m => ({ default: m.TotemStoreSelection })));
const TotemMenuPage = lazy(() => import("@/pages/totem/TotemMenuPage").then(m => ({ default: m.TotemMenuPage })));
const TotemCheckoutPage = lazy(() => import("@/pages/totem/TotemCheckoutPage").then(m => ({ default: m.TotemCheckoutPage })));
const TotemOrderSuccess = lazy(() => import("@/pages/totem/TotemOrderSuccess").then(m => ({ default: m.TotemOrderSuccess })));

// DASHBOARDS & ADMIN - CODE SPLITTING (solo cargan si accedes al admin)
const AdminLogin = lazy(() => import("@/pages/admin/AdminLogin").then(m => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const FabricaDashboard = lazy(() => import("@/pages/admin/FabricaDashboard").then(m => ({ default: m.FabricaDashboard })));
const LocalDashboard = lazy(() => import("@/pages/admin/LocalDashboard").then(m => ({ default: m.LocalDashboard })));
const OrderManagement = lazy(() => import("@/pages/admin/OrderManagement").then(m => ({ default: m.OrderManagement })));
const ProductManagement = lazy(() => import("@/pages/admin/ProductManagement").then(m => ({ default: m.ProductManagement })));
const RecipeManagement = lazy(() => import("@/pages/admin/RecipeManagement").then(m => ({ default: m.RecipeManagement })));
const CustomerManagement = lazy(() => import("@/pages/admin/CustomerManagement").then(m => ({ default: m.CustomerManagement })));
const SettingsPage = lazy(() => import("@/pages/admin/SettingsPage").then(m => ({ default: m.SettingsPage })));
const BranchManagement = lazy(() => import("@/pages/admin/BranchManagement").then(m => ({ default: m.BranchManagement })));
const DeliveryManagement = lazy(() => import("@/pages/admin/DeliveryManagement").then(m => ({ default: m.DeliveryManagement })));
const ProductStockManagement = lazy(() => import("@/pages/admin/ProductStockManagement").then(m => ({ default: m.ProductStockManagement })));
const ComboManagement = lazy(() => import("@/pages/admin/ComboManagement").then(m => ({ default: m.ComboManagement })));
const MaterialManagement = lazy(() => import("@/pages/admin/MaterialManagement").then(m => ({ default: m.MaterialManagement })));
const MaterialStockManagement = lazy(() => import("@/pages/admin/MaterialStockManagement").then(m => ({ default: m.MaterialStockManagement })));
const MenuManagement = lazy(() => import("@/pages/admin/MenuManagement").then(m => ({ default: m.MenuManagement })));
const MetricsManagement = lazy(() => import("@/pages/admin/MetricsManagement").then(m => ({ default: m.MetricsManagement })));
const FabricaProducir = lazy(() => import("@/pages/admin/FabricaProducir").then(m => ({ default: m.FabricaProducir })));
const FabricaTransferir = lazy(() => import("@/pages/admin/FabricaTransferir").then(m => ({ default: m.FabricaTransferir })));
const CategoryManagement = lazy(() => import("@/pages/admin/CategoryManagement").then(m => ({ default: m.CategoryManagement })));

// Crear cliente de React Query
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: false
        },
    },
});

function App() {
    return (
        // <BrowserRouter basename="/demo/nonino/">
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <SessionProvider>

                    <Routes>
                        {/* PUBLIC - Con Suspense para Code Splitting */}
                        <Route
                            element={
                                <PublicDataProvider>
                                    <PublicLayout />
                                </PublicDataProvider>
                            }
                        >
                            <Route index element={
                                <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black"><LoadingSpinner size="xl" /></div>}>
                                    <HomePage />
                                </Suspense>
                            } />
                            <Route path="/menu" element={
                                <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black"><LoadingSpinner size="xl" /></div>}>
                                    <MenuPage />
                                </Suspense>
                            } />
                            <Route path="/menu/combo-builder" element={
                                <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black"><LoadingSpinner size="xl" /></div>}>
                                    <ComboBuilderPage />
                                </Suspense>
                            } />
                            <Route path="/franquicias" element={
                                <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black"><LoadingSpinner size="xl" /></div>}>
                                    <FranchisePage />
                                </Suspense>
                            } />
                            <Route path="/locales" element={
                                <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black"><LoadingSpinner size="xl" /></div>}>
                                    <StoresPage />
                                </Suspense>
                            } />
                            <Route path="/nosotros" element={
                                <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black"><LoadingSpinner size="xl" /></div>}>
                                    <AboutPage />
                                </Suspense>
                            } />
                            <Route path="/contacto" element={
                                <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black"><LoadingSpinner size="xl" /></div>}>
                                    <ContactPage />
                                </Suspense>
                            } />
                            <Route path="/pedir" element={
                                <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black"><LoadingSpinner size="xl" /></div>}>
                                    <StoreSelectionPage />
                                </Suspense>
                            } />
                            <Route path="/carrito" element={
                                <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black"><LoadingSpinner size="xl" /></div>}>
                                    <CartPage />
                                </Suspense>
                            } />
                            <Route path="/checkout" element={
                                <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black"><LoadingSpinner size="xl" /></div>}>
                                    <CheckoutPage />
                                </Suspense>
                            } />
                            <Route path="/tracking/:orderId" element={
                                <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black"><LoadingSpinner size="xl" /></div>}>
                                    <OrderTrackingPage />
                                </Suspense>
                            } />
                            <Route path="/failed/:orderId" element={
                                <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black"><LoadingSpinner size="xl" /></div>}>
                                    <OrderTrackingPage />
                                </Suspense>
                            } />
                        </Route>

                        {/* TOTEM - Modo kiosko para autoatención */}
                        <Route
                            path="/totem"
                            element={
                                <PublicDataProvider>
                                    <TotemLayout />
                                </PublicDataProvider>
                            }
                        >
                            <Route index element={
                                <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black"><LoadingSpinner size="xl" /></div>}>
                                    <TotemStoreSelection />
                                </Suspense>
                            } />
                            <Route path="menu" element={
                                <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black"><LoadingSpinner size="xl" /></div>}>
                                    <TotemMenuPage />
                                </Suspense>
                            } />
                            <Route path="checkout" element={
                                <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black"><LoadingSpinner size="xl" /></div>}>
                                    <TotemCheckoutPage />
                                </Suspense>
                            } />
                            <Route path="order-success/:orderId" element={
                                <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black"><LoadingSpinner size="xl" /></div>}>
                                    <TotemOrderSuccess />
                                </Suspense>
                            } />
                        </Route>

                        {/* INTRANET */}
                        <Route path="/intranet" element={<Navigate to="/intranet/login" replace />} />
                        <Route path="/intranet/*" element={<IntranetPortal />} >
                            <Route path="login" element={<AdminLogin />} />

                            {/* ADMIN */}
                            <Route path="admin"
                                element={
                                    <AuthProvider allowedRole={'ADMIN'}>
                                        <AdminThemeProvider>
                                            <AdminDataProvider>
                                                <AdminLayout />
                                            </AdminDataProvider>
                                        </AdminThemeProvider>
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
                                {/* <Route path="sucursal-menu" element={<MenuManagement />} /> */}
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
                                        <AdminThemeProvider>
                                            <AdminDataProvider>
                                                <AdminLayout />
                                            </AdminDataProvider>
                                        </AdminThemeProvider>
                                    </AuthProvider>
                                }
                            >
                                <Route index element={<LocalDashboard />} />
                                <Route path="ordenes" element={<OrderManagement />} />
                                <Route path="menu" element={<MenuManagement />} />
                                <Route path="sucursal-configurar" element={<BranchManagement />} />
                                <Route path="sucursal-delivery" element={<DeliveryManagement />} />
                                <Route path="inventario-productos" element={<ProductStockManagement />} />
                                <Route path="clientes" element={<CustomerManagement />} />
                                <Route path="metricas" element={<MetricsManagement />} />
                            </Route>

                            {/* FABRICA */}
                            <Route path="fabrica"
                                element={
                                    <AuthProvider allowedRole={'FABRICA'}>
                                        <AdminThemeProvider>
                                            <AdminDataProvider>
                                                <AdminLayout />
                                            </AdminDataProvider>
                                        </AdminThemeProvider>
                                    </AuthProvider>
                                }
                            >
                                <Route index element={<FabricaDashboard />} />
                                <Route path="inventario-productos" element={<ProductStockManagement />} />
                                <Route path="inventario-materiales" element={<MaterialStockManagement />} />
                                <Route path="fabrica-producir" element={<FabricaProducir />} />
                                <Route path="fabrica-transferir" element={<FabricaTransferir />} />
                            </Route>
                        </Route>

                        {/* FALLBACK */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>

                    {/* Toaster deshabilitado para una UX más limpia */}
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