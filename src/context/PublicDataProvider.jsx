/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState, useContext, createContext } from 'react'
import { useMutation } from '@tanstack/react-query';
import {
    getPublicCatalogQueryFunction,
    getPublicStoresQueryFunction,
    getPublicProductosQueryFunction,
    getPublicCombosQueryFunction,
    getPublicCompanyInfoQueryFunction,
    getPublicStoreStatusQueryFunction,

    getAdminOrdersGetOrderByIdQueryFunction,
    postPublicOrdersCreateOrderQueryFunction,
    postPublicOrdersCreatePreferenceQueryFunction,

    postPublicOrdersCreatePrintJobQueryFunction,
} from '@/config/apiPublicQueryFunctions';
import { getStorageItem, setStorageItem } from '@/lib/utils';
import { STORAGE_KEYS } from '@/constants';
import { mockCombos, mockProductos } from '@/lib/mockCombos';

const PublicDataContext = createContext();

const PublicDataProvider = ({ children }) => {

    const [productosTodos, setProductosTodos] = useState([]);
    const [combosTodos, setCombosTodos] = useState([]);

    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [sucursales, setSucursales] = useState([]);
    const [sucursalSeleccionada, setSucursalSeleccionada] = useState(() => {
        // Cargar sucursal seleccionada desde localStorage al iniciar
        return getStorageItem(STORAGE_KEYS.SELECTED_STORE, null);
    });
    const [companyInfo, setCompanyInfo] = useState([]);

    // sucursales
    const { mutateAsync: callPublicStores, isPending: callPublicStoresLoading } = useMutation({
        mutationKey: ['publicStores'],
        mutationFn: getPublicStoresQueryFunction,
        onSuccess: async (data) => {
            const servingStores = ['local', 'franquicia'];
            const usefulStores = data.filter((s) => servingStores.includes(s.code.toLowerCase()));

            const fullStores = await Promise.all(
                usefulStores.map(async (s) => {
                    const statusData = await callPublicStoreStatus(s.id);
                    return { ...s, statusData };
                })
            )
            setSucursales(fullStores);
        },
        onError: (error) => {
            console.log(error);
        }
    });

    // status de cada store
    const { mutateAsync: callPublicStoreStatus, isPending: callPublicStoreStatusLoading } = useMutation({
        mutationKey: ['publicStoreStatus'],
        mutationFn: getPublicStoreStatusQueryFunction,
        onError: (error) => {
            console.log(error);
        }
    });

    // catalogo
    const { mutateAsync: callPublicCatalog, isPending: callPublicCatalogLoading } = useMutation({
        mutationKey: ['publicCatalog'],
        mutationFn: getPublicCatalogQueryFunction,
        onSuccess: (data) => {
            if (data && data.categories && data.categories.length > 0) {
                const gotCategories = data.categories.map((categoria) => ({
                    id: categoria.id,
                    name: categoria.name
                }));

                const gotProducts = data.categories.flatMap(categoria =>
                    categoria.products.map((producto) => ({
                        id: producto.productId,
                        name: producto.name,
                        description: producto.description,
                        category: categoria.id,
                        price: producto.price,
                        image: producto.imageBase64 ? `data:image/webp;base64,${producto.imageBase64}` : '',
                    })));

                setCategorias(gotCategories);
                setProductos(gotProducts);
            } else {
                console.log('⚠️ No hay productos del backend, usando datos MOCK');
                setCategorias([
                    { id: 1, name: 'Empanadas Tradicionales' },
                    { id: 2, name: 'Empanadas Especiales' },
                    { id: 3, name: 'Bebidas' },
                    { id: 4, name: 'Postres' }
                ]);
                setProductos(mockProductos);
            }
        },
        onError: (error) => {
            console.log('⚠️ Error al cargar catálogo, usando datos MOCK:', error);
            setCategorias([
                { id: 1, name: 'Empanadas Tradicionales' },
                { id: 2, name: 'Empanadas Especiales' },
                { id: 3, name: 'Bebidas' },
                { id: 4, name: 'Postres' }
            ]);
            setProductos(mockProductos);
        }
    });

    // sucursales
    const { mutateAsync: callPublicProductos, isPending: callPublicProductosLoading } = useMutation({
        mutationKey: ['publicProductos'],
        mutationFn: getPublicProductosQueryFunction,
        onSuccess: (data) => {
            setProductosTodos(data);
        },
        onError: (error) => {
            console.log(error);
        }
    });

    const { mutateAsync: callPublicCombos, isPending: callPublicCombosLoading } = useMutation({
        mutationKey: ['publicCombos'],
        mutationFn: getPublicCombosQueryFunction,
        onSuccess: (data) => {
            // Si hay datos del backend, usarlos; sino usar mocks
            if (data && data.length > 0) {
                setCombosTodos(data);
            } else {
                console.log('⚠️ No hay combos del backend, usando datos MOCK');
                setCombosTodos(mockCombos);
            }
        },
        onError: (error) => {
            console.log('⚠️ Error al cargar combos, usando datos MOCK:', error);
            setCombosTodos(mockCombos);
        }
    });

    const { mutateAsync: callPublicCompanyInfo, isPending: callPublicCompanyInfoLoading } = useMutation({
        mutationKey: ['publicCompanyInfo'],
        mutationFn: getPublicCompanyInfoQueryFunction,
        onSuccess: (data) => {
            setCompanyInfo(data);
        },
        onError: (error) => {
            console.log(error);
        }
    });

    // orders
    const { mutateAsync: callPublicOrderById, isPending: callPublicOrderByIdLoading } = useMutation({
        mutationKey: ['publicOrderById'],
        mutationFn: getAdminOrdersGetOrderByIdQueryFunction,
        onError: (error) => {
            console.log(error);
        }
    });

    const { mutateAsync: callPublicCreateOrder, isPending: callPublicCreateOrderLoading } = useMutation({
        mutationKey: ['publicCreateOrder'],
        mutationFn: postPublicOrdersCreateOrderQueryFunction,
        onError: (error) => {
            console.log(error);
        }
    });

    const { mutateAsync: callPublicCreatePreference, isPending: callPublicCreatePreferenceLoading } = useMutation({
        mutationKey: ['publicCreatePreference'],
        mutationFn: postPublicOrdersCreatePreferenceQueryFunction,
        onError: (error) => {
            console.log(error);
        }
    });

    // print job create
    const { mutateAsync: callPublicCreatePrintJob, isPending: callPublicCreatePrintJobLoading } = useMutation({
        mutationKey: ['publicCreatePrintJob'],
        mutationFn: postPublicOrdersCreatePrintJobQueryFunction,
        onError: (error) => {
            console.log(error);
        }
    });

    useEffect(() => {
        if (sucursalSeleccionada) {
            setStorageItem(STORAGE_KEYS.SELECTED_STORE, sucursalSeleccionada);
            callPublicCatalog(sucursalSeleccionada);
        } else {
            // Limpiar localStorage si no hay sucursal seleccionada
            localStorage.removeItem(STORAGE_KEYS.SELECTED_STORE);
        }
    }, [sucursalSeleccionada]);

    useEffect(() => {
        callPublicStores();
        callPublicProductos();
        callPublicCombos();
        callPublicCompanyInfo();

        // Para testing: Si después de 2 segundos no hay datos, forzar mocks
        setTimeout(() => {
            if ((!combosTodos || combosTodos.length === 0) && !callPublicCombosLoading) {
                console.log('⚠️ Forzando carga de mocks de combos para testing');
                setCombosTodos(mockCombos);
            }
            if ((!productos || productos.length === 0) && !callPublicCatalogLoading) {
                console.log('⚠️ Forzando carga de mocks de productos para testing');
                setCategorias([
                    { id: 1, name: 'Empanadas Tradicionales' },
                    { id: 2, name: 'Empanadas Especiales' },
                    { id: 3, name: 'Bebidas' },
                    { id: 4, name: 'Postres' }
                ]);
                setProductos(mockProductos);
            }
        }, 2000);
    }, []);

    const publicDataLoading =
        callPublicCatalogLoading ||
        callPublicStoresLoading ||
        callPublicProductosLoading ||
        callPublicCombosLoading ||
        callPublicCompanyInfoLoading ||
        callPublicStoreStatusLoading;

    return (
        <PublicDataContext.Provider value={{
            productos,
            categorias,
            sucursales,
            sucursalSeleccionada,
            productosTodos,
            combosTodos,
            companyInfo,
            setSucursalSeleccionada,

            publicDataLoading,

            // Exponer funciones para prefetch desde la UI
            callPublicCatalog,
            callPublicProductos,
            callPublicCombos,

            callPublicOrderById,
            callPublicOrderByIdLoading,
            callPublicCreateOrder,
            callPublicCreateOrderLoading,
            callPublicCreatePreference,
            callPublicCreatePreferenceLoading,

            callPublicCreatePrintJob,
            callPublicCreatePrintJobLoading,
        }}>
            {children}
        </PublicDataContext.Provider>
    )
}

export default PublicDataProvider;

export function usePublicData() {
    return useContext(PublicDataContext);
}