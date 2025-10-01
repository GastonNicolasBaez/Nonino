import { useState, useEffect } from "react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { usePublicData } from "@/context/PublicDataProvider";
import { useCart } from "@/context/CartProvider";
import { MenuDesktop } from "@/components/menu/MenuDesktop";
import { MenuMobile } from "@/components/menu/MenuMobile";

export function MenuPage() {
    const {
        productos: products,
        categorias: categories,
        sucursales: stores,
        sucursalSeleccionada: selectedStoreId,
        publicDataLoading: loading
    } = usePublicData();

    const { updateStore } = useCart();

    const [isMobile, setIsMobile] = useState(false);

    // Detectar tamaño de pantalla
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 1024); // lg breakpoint
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
    }, []);

    // Encontrar la sucursal seleccionada
    const selectedStore = stores.find(store => store.id === selectedStoreId);

    // Sincronizar sucursal seleccionada con el carrito
    useEffect(() => {
        if (selectedStore) {
            updateStore(selectedStore);
        }
    }, [selectedStore, updateStore]);

    // Datos para las nuevas secciones
    const todaysPicks = products.slice(0, 6); // Los primeros 6 productos como destacados

    // Las promociones y combos vendrán del backend (PublicDataProvider)
    const promotions = [];
    const combos = [];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="xl" />
            </div>
        );
    }

    return (
        <>
            {isMobile ? (
                <MenuMobile
                    products={products}
                    categories={categories}
                    todaysPicks={todaysPicks}
                    promotions={promotions}
                    combos={combos}
                    selectedStore={selectedStore}
                />
            ) : (
                <MenuDesktop
                    products={products}
                    categories={categories}
                    todaysPicks={todaysPicks}
                    promotions={promotions}
                    combos={combos}
                    selectedStore={selectedStore}
                />
            )}
        </>
    );
}
