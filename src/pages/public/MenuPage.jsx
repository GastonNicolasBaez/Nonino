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

    const promotions = [
        {
            id: 1,
            title: "2x1 en Empanadas",
            description: "Lleva 2 docenas y paga solo 1",
            discount: "50%",
            image: "/api/placeholder/300/200",
            validUntil: "2025-12-31"
        },
        {
            id: 2,
            title: "Combo Familiar",
            description: "3 docenas + bebida grande",
            discount: "25%",
            image: "/api/placeholder/300/200",
            validUntil: "2025-12-31"
        }
    ];

    const combos = [
        {
            id: 1,
            name: "Combo Ejecutivo",
            description: "6 empanadas + bebida + postre",
            price: 4500,
            originalPrice: 5200,
            image: "/api/placeholder/300/200"
        },
        {
            id: 2,
            name: "Combo Familiar",
            description: "2 docenas + 2 bebidas + ensalada",
            price: 12000,
            originalPrice: 14000,
            image: "/api/placeholder/300/200"
        }
    ];

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
