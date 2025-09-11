import { Outlet } from "react-router";
import { Toaster } from "sonner";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { CartSidebar } from "@/components/common/CartSidebar";
import { PublicDataProvider } from "@/context/PublicDataProvider";

const PublicLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                <CartProvider>
                    <PublicDataProvider>
                        <Outlet />
                    </PublicDataProvider>
                </CartProvider>
            </main>
            <Footer />
            <CartSidebar />
            <Toaster
                position="bottom-right"
                toastOptions={{
                    style: { background: '#f7a82a', color: 'white' },
                    className: 'empanada-toast',
                }}
            />
        </div>
    )
}

export default PublicLayout
