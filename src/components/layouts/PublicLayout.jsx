import { Outlet } from "react-router";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { CartSidebar } from "@/components/common/CartSidebar";
import { StatsFooterSeparator } from "@/components/common/StatsFooterSeparator";
import { CartProvider } from "@/context/CartProvider";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { ScrollIndicator } from "@/components/ui/scroll-indicator";

const PublicLayout = () => {
    // Automatically scroll to top when route changes
    useScrollToTop();

    return (
        <CartProvider>
            <div className="min-h-screen flex flex-col">
                <ScrollIndicator />
                <Header />
                <main className="flex-1">
                    <Outlet />
                </main>
                <StatsFooterSeparator />
                <Footer />
                <CartSidebar />
            </div >
        </CartProvider>
    )
}

export default PublicLayout
