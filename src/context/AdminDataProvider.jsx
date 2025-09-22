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
    putAdminStoresUpdateStoreQueryFunction,

    getAdminStoresDeliveryZonesQueryFunction,
    postAdminStoresAddDeliveryZoneQueryFunction,
    putAdminStoresUpdateDeliveryZoneQueryFunction,
    deleteAdminStoresDeleteDeliveryZoneQueryFunction,
} from '@/config/apiStoresQueryFunctions';
import {
    getPublicCatalogQueryFunction
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
    const [deliverySucursal, setDeliverySucursal] = useState([]);

    //cargar información de admin al montar la vista de administrador
    useEffect(() => {
        if (session.userData?.accessToken) {
            callProductosYCategorias(session.userData.accessToken);
            callSucursales(session.userData.accessToken);
            setSucursalSeleccionada(session.userData.sucursal);
        }
    }, [session.userData?.accessToken]);

    //cargar información de sucursal cuando cambie
    useEffect(() => {
        if (sucursalSeleccionada && session.userData) {
            // zonas de delivery
            callDeliveryZones({
                _storeId: sucursalSeleccionada,
                _accessToken: session.userData.accessToken,
            });

            // productos de sucursal
            callProductosYCategoriasSucursal(sucursalSeleccionada);
        }
    }, [sucursalSeleccionada]);


    // ---------- PRODUCTOS Y CATEGORIAS PÚBLICO
    // listar
    const { mutateAsync: callProductosYCategoriasSucursal, isPending: callProductosYCategoriasSucursalLoading } = useMutation({
        mutationKey: ['publicProductosYCategoriasSucursal'],
        mutationFn: getPublicCatalogQueryFunction,
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
    const { mutateAsync: callActualizarSucursal, isPending: callActualizarSucursalLoading } = useMutation({
        mutationKey: ['adminActualizarSucursal'],
        mutationFn: putAdminStoresUpdateStoreQueryFunction,
    });

    // listar zonas de entrega
    const { mutateAsync: callDeliveryZones, isPending: callDeliveryZonesLoading } = useMutation({
        mutationKey: ['adminDeliveryZones'],
        mutationFn: getAdminStoresDeliveryZonesQueryFunction,
        onSuccess: (data) => {
            setDeliverySucursal(data);
        },
        onError: (error) => {
            console.log(error);
            setDeliverySucursal([]);
        }
    });

    // crear zona de entrega
    const { mutateAsync: callCrearDeliveryZone, isPending: callCrearDeliveryZoneLoading } = useMutation({
        mutationKey: ['adminCrearDeliveryZone'],
        mutationFn: postAdminStoresAddDeliveryZoneQueryFunction,
    });

    // modificar zona de entrega
    const { mutateAsync: callActualizarDeliveryZone, isPending: callActualizarDeliveryZoneLoading } = useMutation({
        mutationKey: ['adminActualizarDeliveryZone'],
        mutationFn: putAdminStoresUpdateDeliveryZoneQueryFunction,
    });

    // eliminar zona de entrega   
    const { mutateAsync: callBorrarDeliveryZone, isPending: callBorrarDeliveryZoneLoading } = useMutation({
        mutationKey: ['adminBorrarDeliveryZone'],
        mutationFn: deleteAdminStoresDeleteDeliveryZoneQueryFunction,
    });




    //

    const adminDataLoading =
        callProductoNuevoLoading ||
        callProductosYCategoriasLoading ||
        callBorrarProductoLoading ||
        callModificarProductoLoading ||
        callSucursalesLoading ||
        callProductosYCategoriasSucursalLoading ||
        callAsignarASucursalLoading ||
        callCrearSucursalLoading ||
        callActualizarSucursalLoading ||
        callDeliveryZonesLoading ||
        callCrearDeliveryZoneLoading ||
        callActualizarDeliveryZoneLoading || 
        callBorrarDeliveryZoneLoading;

    return (
        <AdminDataContext.Provider value={{
            productos,
            categorias,
            sucursales,
            sucursalSeleccionada,
            setSucursalSeleccionada,
            productosSucursal,
            deliverySucursal,

            adminDataLoading,

            callProductosYCategorias,
            callProductoNuevo,
            callBorrarProducto,
            callModificarProducto,
            callSucursales,
            callProductosYCategoriasSucursal,
            callAsignarASucursal,
            callCrearSucursal,
            callActualizarSucursal,

            callDeliveryZones,
            callCrearDeliveryZone,
            callActualizarDeliveryZone,
            callBorrarDeliveryZone
        }}>
            {children}
        </AdminDataContext.Provider>
    )
}

export const useAdminData = () => {
    return useContext(AdminDataContext);
}