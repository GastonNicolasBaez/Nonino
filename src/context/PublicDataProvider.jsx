/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState, useContext, createContext } from 'react'
import { useQuery } from '@tanstack/react-query';
import { getPublicDataQueryFunction } from '@/config/apiQueryFunctions';

const PublicDataContext = createContext();

export const PublicDataProvider = ({ children }) => {

    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [idSucursal, setIdSucursal] = useState(1);

    const { data: publicCatalog, isPending: publicLoading } = useQuery({
        queryKey: ['publicData', idSucursal],
        queryFn: () => getPublicDataQueryFunction(idSucursal),
    });

    useEffect(() => {
        if (publicCatalog && !publicLoading) {
            const gotCategories = publicCatalog.categories.map((categoria) => ({
                id: categoria.id,
                name: categoria.name
            }));

            const gotProducts = publicCatalog.categories.flatMap(categoria =>
                categoria.products.map((producto) => ({
                    id: producto.productId,
                    name: producto.name,
                    description: producto.description,
                    category: categoria.id,
                    price: producto.price,
                    image: producto.imageUrl,
                    // mockdata
                    stock: 45,
                    isPopular: true,
                    isAvailable: true,
                    sku: "EMP-CARNE-001",
                    status: "active",
                    allergens: ["gluten"],
                    nutritionalInfo: {
                        calories: 280,
                        protein: 12,
                        carbs: 35,
                        fat: 8
                    },
                    createdAt: "2024-01-01T00:00:00Z",
                    updatedAt: "2024-01-15T00:00:00Z"
                })));

            setCategorias(gotCategories);
            setProductos(gotProducts);
        }
    }, [publicCatalog])


    return (
        <PublicDataContext.Provider value={{ productos, categorias, publicLoading }}>
            {children}
        </PublicDataContext.Provider>
    )
}

export const usePublicData = () => {
    return useContext(PublicDataContext);
}