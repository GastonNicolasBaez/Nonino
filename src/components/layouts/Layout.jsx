import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { Header } from "../common/Header";
import { Footer } from "../common/Footer";
import { CartSidebar } from "../common/CartSidebar";

export function Layout() {
  return (
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
    </div>
  );
}
