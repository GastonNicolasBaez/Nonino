/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState, useContext, createContext } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query';
import {
    getAdminCatalogQueryFunction,
    postAdminCatalogAddProductQueryFunction
} from '@/config/apiQueryFunctions';

const AdminDataContext = createContext();

export const AdminDataProvider = ({ children }) => {

    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [idSucursal, setIdSucursal] = useState(1);

    //crear producto
    const { mutateAsync: callProductoNuevo, isPending: callProductoNuevoLoading } = useMutation({
        mutationKey: ['adminProductoNuevo'],
        mutationFn: postAdminCatalogAddProductQueryFunction,
    });

    //listar productos

    const { mutate: callProductosYCategorias, isPending: callProductosYCategoriasLoading } = useMutation({
        mutationKey: ['adminCatalog'],
        mutationFn: getAdminCatalogQueryFunction,
        onSuccess: (data) => {
            const gotProducts = data.map((producto) => ({
                id: producto.id,
                name: producto.name,
                description: producto.description,
                categoryId: producto.categoryId,
                category: producto.categoryName,
                price: producto.basePrice,
                image: producto.imageId,
                isAvailable: producto.active,
                sku: producto.sku,
                cost: 0,
                stock: 45,
                // mockdata
                isPopular: true,
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
            }));

            const categoryMap = new Map();
            data.forEach((producto) => {
                if (!categoryMap.has(producto.categoryId)) {
                    categoryMap.set(producto.categoryId, {
                        id: producto.categoryId,
                        name: producto.categoryName,
                    });
                }
            });
            const gotCategories = Array.from(categoryMap.values());

            setProductos(gotProducts);
            setCategorias(gotCategories);
        },
        onError: (error) => {
            console.log(error);
        }
    });

    //listar un producto

    //modificar producto

    //modificar imagen

    //modificar disponible

    //eliminar producto

    const adminDataLoading =
        callProductoNuevoLoading ||
        callProductosYCategoriasLoading;

    return (
        <AdminDataContext.Provider value={{
            productos,
            categorias,
            adminDataLoading,
            callProductosYCategorias,

            callProductoNuevo,

        }}>
            {children}
        </AdminDataContext.Provider>
    )
}

export const useAdminData = () => {
    return useContext(AdminDataContext);
}