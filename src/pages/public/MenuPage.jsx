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
        combos,
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
        // Throttling para mejor performance
        let timeoutId;
        const throttledResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(checkIfMobile, 100);
        };

        window.addEventListener('resize', throttledResize);

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', throttledResize);
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

    // Las promociones vendrán del backend (PublicDataProvider)
    const promotions = [];

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
                    promotions={promotions}
                    combos={combos}
                    selectedStore={selectedStore}
                />
            ) : (
                <MenuDesktop
                    products={products}
                    categories={categories}
                    promotions={promotions}
                    combos={combos}
                    selectedStore={selectedStore}
                />
            )}
        </>
    );
}
