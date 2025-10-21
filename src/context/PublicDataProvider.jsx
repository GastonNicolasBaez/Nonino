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
    getPublicStoreBaseDelayQueryFunction,

    getAdminOrdersGetOrderByIdQueryFunction,
    postPublicOrdersCreateOrderQueryFunction,
    postPublicOrdersCreatePreferenceQueryFunction,

    postPublicOrdersCreatePrintJobQueryFunction,
} from '@/config/apiPublicQueryFunctions';
import { getStorageItem, setStorageItem } from '@/lib/utils';
import { STORAGE_KEYS } from '@/constants';
import { ENDPOINTS } from '@/config/apiEndpoints';

const PublicDataContext = createContext();

const PublicDataProvider = ({ children }) => {

    const [productosTodos, setProductosTodos] = useState([]);
    const [combosTodos, setCombosTodos] = useState([]);

    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [combos, setCombos] = useState([]);
    const [promociones, setPromociones] = useState([]);
    const [descuentos, setDescuentos] = useState([]);


    const [sucursales, setSucursales] = useState([]);
    const [sucursalSeleccionada, setSucursalSeleccionada] = useState(() => {
        // Cargar sucursal seleccionada desde localStorage al iniciar
        return getStorageItem(STORAGE_KEYS.SELECTED_STORE, null);
    });
    const [sucursalSeleccionadaDelay, setSucursalSeleccionadaDelay] = useState(0);
    const [companyInfo, setCompanyInfo] = useState([]);

    // sucursales
    const { mutateAsync: callPublicStores, isPending: callPublicStoresLoading } = useMutation({
        mutationKey: ['publicStores'],
        mutationFn: getPublicStoresQueryFunction,
        onSuccess: async (data) => {
            console.log('[PublicData] raw stores from backend:', data);
            const servingStores = ['local', 'franquicia'];
            const usefulStores = data.filter((s) => servingStores.includes(s.code.toLowerCase()));

            const fullStores = await Promise.all(
                usefulStores.map(async (s) => {
                    const statusData = await callPublicStoreStatus(s.id);
                    return { ...s, statusData };
                })
            )
            console.log('[PublicData] fullStores with statusData:', fullStores);
            if (fullStores?.length) {
                console.log('[PublicData] sample store:', fullStores[0]);
                console.log('[PublicData] candidate fields:', {
                    deliveryTimeMinutes: fullStores[0]?.deliveryTimeMinutes,
                    estimatedDeliveryTime: fullStores[0]?.estimatedDeliveryTime,
                    deliveryTime: fullStores[0]?.deliveryTime,
                    statusData: fullStores[0]?.statusData
                });
            }
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
            const gotCategories = data.categories.map((categoria) => ({
                id: categoria.id,
                name: categoria.name
            }));

            if (gotCategories.length > 0)
                setCategorias(gotCategories);

            const gotProducts = data.categories.flatMap(categoria =>
                categoria.products.map((producto) => ({
                    id: producto.productId,
                    name: producto.name,
                    sku: producto.sku,
                    description: producto.description,
                    category: categoria.id,
                    price: producto.price,
                    image: producto.imageBase64 ? `data:image/webp;base64,${producto.imageBase64}` : '',
                })));

            if (gotProducts.length > 0)
                setProductos(gotProducts);

            const seenCombo = new Set();
            const gotCombos = data.categories?.flatMap((categoria) =>
                (categoria.combos || [])
                    .filter(combo => {
                        if (seenCombo.has(combo.comboId)) return false;
                        seenCombo.add(combo.comboId);
                        return true;
                    }).map((combo) => {
                        // SOLUCIÓN: Usar imageBase64 si está disponible, sino intentar URL desde imageHref
                        let imageBase64 = '';
                        
                        if (combo.imageBase64) {
                            // Si el backend devuelve imageBase64, usarlo con el formato correcto
                            imageBase64 = `data:image/webp;base64,${combo.imageBase64}`;
                        } else if (combo.imageHref) {
                            // TEMPORAL: El endpoint de imágenes no existe en el backend
                            // Por ahora, usar imagen placeholder hasta que se arregle el backend
                            // console.warn(`⚠️ Endpoint de imagen no disponible para combo ${combo.comboId}: ${combo.imageHref}`);
                           //  imageBase64 = ''; // Imagen vacía = placeholder
                            
                            // TODO: Cuando el backend esté listo, descomentar esta línea:
                             imageBase64 = `${ENDPOINTS.catalog}${combo.imageHref.startsWith('/') ? '' : '/'}${combo.imageHref}`;
                        }

                        return {
                            id: combo.comboId,
                            code: combo.code,
                            name: combo.name,
                            description: combo.description,
                            price: combo.price,
                            image: imageBase64,
                            imageBase64: imageBase64, // Usar el mismo valor para ambos campos
                            kind: combo.selectionSpec?.kind,
                            components: combo.components || [],
                            selectionSpec: combo.selectionSpec || {},
                        };
                    })) || [];

            if (gotCombos.length > 0) {
                setCombos(gotCombos);
            } else {
                setCombos([]);
            }
        },
        onError: (error) => {
            console.log(error);
            setCombos([]);
            setCategorias([]);
            setProductos([]);
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

    const { mutateAsync: callPublicStoreBaseDelay, isPending: callPublicStoreBaseDelayLoading } = useMutation({
        mutationKey: ['publicStoreBaseDelay'],
        mutationFn: getPublicStoreBaseDelayQueryFunction,
        onSuccess: (data) => {
            setSucursalSeleccionadaDelay(data);
        },
        onError: (error) => {
            console.log(error);
        }
    });

    const { mutateAsync: callPublicCombos, isPending: callPublicCombosLoading } = useMutation({
        mutationKey: ['publicCombos'],
        mutationFn: getPublicCombosQueryFunction,
        onSuccess: (data) => {
            const mappedCombos = (data || []).map(combo => {
                // SOLUCIÓN: Usar imageBase64 si está disponible, sino intentar URL desde imageHref
                let imageBase64 = '';
                
                if (combo.imageBase64) {
                    // Si el backend devuelve imageBase64, usarlo con el formato correcto
                    imageBase64 = `data:image/webp;base64,${combo.imageBase64}`;
                } else if (combo.imageHref) {
                    // TEMPORAL: El endpoint de imágenes no existe en el backend
                    // Por ahora, usar imagen placeholder hasta que se arregle el backend
                  //   console.warn(`⚠️ Endpoint de imagen no disponible para combo ${combo.comboId}: ${combo.imageHref}`);
                  //   imageBase64 = ''; // Imagen vacía = placeholder
                    
                    // TODO: Cuando el backend esté listo, descomentar esta línea:
                     imageBase64 = `${ENDPOINTS.catalog}${combo.imageHref.startsWith('/') ? '' : '/'}${combo.imageHref}`;
                }

                return {
                    id: combo.comboId,
                    code: combo.code,
                    name: combo.name,
                    description: combo.description,
                    price: combo.price,
                    image: imageBase64,
                    imageBase64: imageBase64, // Usar el mismo valor para ambos campos
                    kind: combo.selectionSpec?.kind,
                    components: combo.components || [],
                    selectionSpec: combo.selectionSpec || {},
                };
            });

            setCombosTodos(mappedCombos);
        },
        onError: (error) => {
            console.log(error);
            setCombosTodos([]);
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
    }, []);

    const publicDataLoading =
        callPublicCatalogLoading ||
        callPublicStoresLoading ||
        callPublicProductosLoading ||
        callPublicCombosLoading ||
        callPublicCompanyInfoLoading ||
        callPublicStoreStatusLoading;

    const publicDataCreatingOrderLoading =
        callPublicCreateOrderLoading ||
        callPublicCreatePreferenceLoading ||
        callPublicCreatePrintJobLoading;

    return (
        <PublicDataContext.Provider value={{
            productos,
            categorias,
            sucursales,
            combos,
            sucursalSeleccionada,
            sucursalSeleccionadaDelay,
            productosTodos,
            combosTodos,
            companyInfo,
            setSucursalSeleccionada,

            publicDataLoading,

            // Exponer funciones para prefetch desde la UI
            callPublicCatalog,
            callPublicProductos,
            callPublicCombos,

            callPublicStoreBaseDelay,
            callPublicStoreBaseDelayLoading,

            callPublicOrderById,
            callPublicOrderByIdLoading,

            callPublicCreateOrder,
            callPublicCreatePreference,
            callPublicCreatePrintJob,
            publicDataCreatingOrderLoading
        }}>
            {children}
        </PublicDataContext.Provider>
    )
}

export default PublicDataProvider;

export function usePublicData() {
    return useContext(PublicDataContext);
}