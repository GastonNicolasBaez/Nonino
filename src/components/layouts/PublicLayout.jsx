import { Outlet } from "react-router";
import { Toaster } from "sonner";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { CartSidebar } from "@/components/common/CartSidebar";
import { CartProvider } from "@/context/CartProvider";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const PublicLayout = () => {
    // Automatically scroll to top when route changes
    useScrollToTop();

    return (
        <CartProvider>
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">                    
                    <Outlet />
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
            </div >
        </CartProvider>
    )
}

export default PublicLayout
