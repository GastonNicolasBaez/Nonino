/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect, useContext, createContext } from 'react'
import { useMutation } from '@tanstack/react-query';
import {
    getAdminCatalogProductosYCategoriasQueryFunction,
    postAdminCatalogAddProductQueryFunction,
    deleteAdminCatalogDeleteProductQueryFunction,
    updateAdminCatalogUpdateProductQueryFunction,
    postAdminCatalogAsignarASucursalQueryFunction,
} from '@/config/apiCatalogQueryFunctions';
import {
    getAdminStoresQueryFunction,
    postAdminStoresAddStoreQueryFunction,
} from '@/config/apiStoresQueryFunctions';
import {
    getPublicDataQueryFunction
} from '@/config/apiPublicQueryFunctions';

import { useSession } from '@/context/SessionProvider';

const AdminDataContext = createContext();

export const AdminDataProvider = ({ children }) => {

    const session = useSession();

    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [sucursales, setSucursales] = useState([]);

    const [sucursalSeleccionada, setSucursalSeleccionada] = useState([]);

    const [productosSucursal, setProductosSucursal] = useState([]);

    //cargar información de admin al montar la vista de administrador
    useEffect(() => {
        if (session.userData?.accessToken) {
            callProductosYCategorias(session.userData.accessToken);
            callSucursales(session.userData.accessToken);
            setSucursalSeleccionada(session.userData.sucursal);
        }
    }, [session.userData?.accessToken]);

    // ---------- PRODUCTOS Y CATEGORIAS PÚBLICO
    // listar
    const { mutateAsync: callProductosYCategoriasSucursal, isPending: callProductosYCategoriasSucursalLoading } = useMutation({
        mutationKey: ['publicProductosYCategoriasSucursal'],
        mutationFn: getPublicDataQueryFunction,
        onSuccess: (data) => {
            const gotProducts = data.categories.flatMap(categoria =>
                categoria.products.map((producto) => ({
                    id: producto.productId,
                    name: producto.name,
                    description: producto.description,
                    category: categoria.id,
                    price: producto.price,
                    image: producto.imageBase64 ? `data:image/webp;base64,${producto.imageBase64}` : '',
                })));

            setProductosSucursal(gotProducts);
        },
        onError: (error) => {
            console.log(error);
            setProductosSucursal([]);
        }
    });

    //asignar a sucursal
    const { mutateAsync: callAsignarASucursal, isPending: callAsignarASucursalLoading } = useMutation({
        mutationKey: ['adminAsignarASucursal'],
        mutationFn: postAdminCatalogAsignarASucursalQueryFunction,
    });

    // ---------- PRODUCTOS Y CATEGORIAS ADMIN
    //crear
    const { mutateAsync: callProductoNuevo, isPending: callProductoNuevoLoading } = useMutation({
        mutationKey: ['adminProductoNuevo'],
        mutationFn: postAdminCatalogAddProductQueryFunction,
    });

    //eliminar
    const { mutateAsync: callBorrarProducto, isPending: callBorrarProductoLoading } = useMutation({
        mutationKey: ['adminBorrarProducto'],
        mutationFn: deleteAdminCatalogDeleteProductQueryFunction,
    });

    //listar
    const { mutateAsync: callProductosYCategorias, isPending: callProductosYCategoriasLoading } = useMutation({
        mutationKey: ['adminProductosYCategorias'],
        mutationFn: getAdminCatalogProductosYCategoriasQueryFunction,
        onSuccess: (data) => {
            const gotProducts = data.map((producto) => ({
                id: producto.id,
                name: producto.name,
                description: producto.description,
                categoryName: producto.categoryName,
                category: producto.categoryId,
                price: producto.basePrice,
                imageUrl: producto.imageBase64 ? `data:image/webp;base64,${producto.imageBase64}` : '',
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
            setProductos([]);
            setCategorias([]);
        }
    });

    //modificar producto
    const { mutateAsync: callModificarProducto, isPending: callModificarProductoLoading } = useMutation({
        mutationKey: ['adminModificarProducto'],
        mutationFn: updateAdminCatalogUpdateProductQueryFunction,
    });

    // ---------- SUCURSALES
    // listar
    const { mutateAsync: callSucursales, isPending: callSucursalesLoading } = useMutation({
        mutationKey: ['adminSucursales'],
        mutationFn: getAdminStoresQueryFunction,
        onSuccess: (data) => {
            if (session.userData.sucursal) {
                setSucursales(data.filter((s) => s.id == session.userData.sucursal));
            } else {
                setSucursales(data);
            }
        },
        onError: (error) => {
            console.log(error);
            setSucursales([]);
        }
    });

    // crear
    const { mutateAsync: callCrearSucursal, isPending: callCrearSucursalLoading } = useMutation({
        mutationKey: ['adminCrearSucursal'],
        mutationFn: postAdminStoresAddStoreQueryFunction,
    });

    // modificar

    // eliminar





    //

    const adminDataLoading =
        callProductoNuevoLoading ||
        callProductosYCategoriasLoading ||
        callBorrarProductoLoading ||
        callModificarProductoLoading ||
        callSucursalesLoading ||
        callProductosYCategoriasSucursalLoading ||
        callAsignarASucursalLoading ||
        callCrearSucursalLoading;

    return (
        <AdminDataContext.Provider value={{
            productos,
            categorias,
            sucursales,
            sucursalSeleccionada,
            setSucursalSeleccionada,
            productosSucursal,

            adminDataLoading,

            callProductosYCategorias,
            callProductoNuevo,
            callBorrarProducto,
            callModificarProducto,
            callSucursales,
            callProductosYCategoriasSucursal,
            callAsignarASucursal,
            callCrearSucursal
        }}>
            {children}
        </AdminDataContext.Provider>
    )
}

export const useAdminData = () => {
    return useContext(AdminDataContext);
}