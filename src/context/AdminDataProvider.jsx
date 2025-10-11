/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect, useContext, createContext, useRef } from 'react'
import { useMutation } from '@tanstack/react-query';
import {
    getAdminCatalogProductosYCategoriasQueryFunction,
    postAdminCatalogAddProductQueryFunction,
    deleteAdminCatalogDeleteProductQueryFunction,
    updateAdminCatalogUpdateProductQueryFunction,
    postAdminCatalogAsignarASucursalQueryFunction,
    getAdminCatalogCombosQueryFunction,
    postAdminCatalogAddComboQueryFunction,
    deleteAdminCatalogDeleteComboQueryFunction,
    getAdminCatalogCategoriesQueryFunction,
    postAdminCatalogAddCategoryQueryFunction,
    putAdminCatalogUpdateCategoryQueryFunction,
    deleteAdminCatalogDeleteCategoryQueryFunction
} from '@/config/apiCatalogQueryFunctions';
import {
    getAdminStoresQueryFunction,
    postAdminStoresAddStoreQueryFunction,
    putAdminStoresUpdateStoreQueryFunction,

    getAdminStoresDeliveryZonesQueryFunction,
    postAdminStoresAddDeliveryZoneQueryFunction,
    putAdminStoresUpdateDeliveryZoneQueryFunction,
    deleteAdminStoresDeleteDeliveryZoneQueryFunction,
    putAdminStoresUpdateScheduleZoneQueryFunction,
    getAdminStoresScheduleQueryFunction,

    getAdminStoresCompanyInfoQueryFunction,
    putAdminStoresUpdateCompanyInfoQueryFunction,
} from '@/config/apiStoresQueryFunctions';
import {
    getPublicCatalogQueryFunction,
    postPublicOrdersCreatePrintJobQueryFunction,
    putPublicOrdersForcePrintJobQueryFunction
} from '@/config/apiPublicQueryFunctions';
import {
    getAdminInventoryMaterialsQueryFunction,
    postAdminInventoryAddMaterialQueryFunction,
    postAdminInventoryAssignRecipeQueryFunction,
    getAdminInventoryGetProductRecipeQueryFunction,

    getAdminInventoryMaterialsOnStoreQueryFunction,
    getAdminInventoryProductsOnStoreQueryFunction,

    postAdminInventoryInboundQueryFunction,

    postAdminInventoryMakeProductsQueryFunction,
    postAdminInventoryTransferProductsQueryFunction,
    postAdminInventoryAdjustProductsQueryFunction,
} from '@/config/apiInventoryQueryFunctions';
import {
    postAdminOrdersCreateOrderQueryFunction,
    getAdminOrdersGetOrdersQueryFunction,
    postAdminOrdersPayCashQueryFunction,
    postAdminOrdersCloseQueryFunction
} from '@/config/apiOrdersQueryFunctions';

import { useSession } from '@/context/SessionProvider';

const AdminDataContext = createContext();

const AdminDataProvider = ({ children }) => {
    const session = useSession();
    const reloginPromiseRef = useRef(null);

    // Helper to queue relogin
    const queueRelogin = async () => {
        if (!reloginPromiseRef.current) {
            reloginPromiseRef.current = (async () => {
                try {
                    await session.relogin();
                } finally {
                    reloginPromiseRef.current = null;
                }
            })();
        }
        return reloginPromiseRef.current;
    };

    const handleErrorRelogin = async (failureCount, error) => {
        if (error?.response?.status === 401 && typeof session.relogin === 'function') {
            await queueRelogin();
            return true;
        }
        return false;
    }

    const logErrorsToConsole = true;

    const [adminStartingLoading, setAdminStartingLoading] = useState([true]);

    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [categoriasTodas, setCategoriasTodas] = useState([]);
    const [sucursales, setSucursales] = useState([]);
    const [materiales, setMateriales] = useState([]);
    const [combos, setCombos] = useState([]);

    const [sucursalSeleccionada, setSucursalSeleccionada] = useState();
    const [sucursalSeleccionadaInfo, setSucursalSeleccionadaInfo] = useState();

    const [productosSucursal, setProductosSucursal] = useState([]);
    const [combosSucursal, setCombosSucursal] = useState([]);
    const [deliverySucursal, setDeliverySucursal] = useState([]);
    const [horariosSucursal, setHorariosSucursal] = useState([]);
    const [inventarioMaterialesSucursal, setInventarioMaterialesSucursal] = useState([]);
    const [inventarioProductosSucursal, setInventarioProductosSucursal] = useState([]);
    const [companyInfo, setCompanyInfo] = useState([]);

    const [orders, setOrders] = useState([]);


    //cargar información de admin al montar la vista de administrador
    useEffect(() => {
        const at = session.userData?.accessToken;
        if (at) {
            callProductosYCategorias(at);
            callSucursales(at);
            callMateriales(at);
            callCombos(at);
            callCategorias(at);
            if (session.userData.isAdmin) {
                const adminStore = localStorage.getItem('noninoSysStore');
                setSucursalSeleccionada(adminStore ? Number(adminStore) : '')
            } else {
                setSucursalSeleccionada(session.userData.sucursal);
            }
            setAdminStartingLoading(false);
        }
    }, [session.userData?.accessToken]);

    //cargar información de sucursal cuando cambie
    useEffect(() => {
        if (sucursalSeleccionada && session.userData) {
            const at = session.userData?.accessToken;

            // zonas de delivery
            callDeliveryZones({
                _storeId: sucursalSeleccionada,
                _accessToken: at,
            });

            // productos de sucursal
            callProductosYCategoriasSucursal(sucursalSeleccionada);

            // horarios
            callSchedule({
                _storeId: sucursalSeleccionada,
                _accessToken: at,
            });

            // ordenes activas
            callOrders(at);

            setSucursalSeleccionadaInfo(sucursales.find((s) => s.id == sucursalSeleccionada));
        } else {
            setDeliverySucursal([]);
            setProductosSucursal([]);
            setCombosSucursal([]);
            setHorariosSucursal([]);
            setOrders([]);
            setSucursalSeleccionadaInfo([]);
        }
        // guardar seleccionada en localstorage solo si es admin
        if (session.userData.isAdmin) {
            localStorage.setItem('noninoSysStore', sucursalSeleccionada);
        }
    }, [sucursalSeleccionada]);

    // llamar materiales de sucursal cuando haya materiales y cambie la sucursal
    useEffect(() => {
        if (materiales.length > 0 && session.userData && sucursalSeleccionada) {
            callInventarioMaterialesSucursal({
                _storeId: sucursalSeleccionada,
                _accessToken: session.userData.accessToken,
            });
        }
    }, [materiales, sucursalSeleccionada]);

    // llamar productos de sucursal cuando haya materiales y cambie la sucursal
    useEffect(() => {
        if (productos.length > 0 && session.userData && sucursalSeleccionada) {
            callInventarioProductosSucursal({
                _storeId: sucursalSeleccionada,
                _accessToken: session.userData.accessToken,
            });
        }
    }, [productos, sucursalSeleccionada]);



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
                    sku: producto.sku,
                })));

            // Extraer combos desde categories (igual que PublicDataProvider)
            const seenCombo = new Set();
            const gotCombos = data.categories?.flatMap((categoria) =>
                (categoria.combos || [])
                    .filter(combo => {
                        if (seenCombo.has(combo.comboId)) return false;
                        seenCombo.add(combo.comboId);
                        return true;
                    }).map((combo) => ({
                        id: combo.comboId,
                        name: combo.name,
                        description: combo.description,
                        price: combo.price,
                    }))) || [];

            setProductosSucursal(gotProducts);
            setCombosSucursal(gotCombos);
        },
        onError: (error) => {
            if (logErrorsToConsole) console.log(error);
            setProductosSucursal([]);
            setCombosSucursal([]);
        },
    });

    //asignar a sucursal
    const { mutateAsync: callAsignarASucursal, isPending: callAsignarASucursalLoading } = useMutation({
        mutationKey: ['adminAsignarASucursal'],
        mutationFn: postAdminCatalogAsignarASucursalQueryFunction,
        onError: (error) => { if (logErrorsToConsole) console.log(error); },
        retry: async (failureCount, error) => { return handleErrorRelogin(failureCount, error); },
        retryDelay: 2000
    });

    // ---------- PRODUCTOS Y CATEGORIAS ADMIN
    //crear
    const { mutateAsync: callProductoNuevo, isPending: callProductoNuevoLoading } = useMutation({
        mutationKey: ['adminProductoNuevo'],
        mutationFn: postAdminCatalogAddProductQueryFunction,
        onError: (error) => { if (logErrorsToConsole) console.log(error); },
        retry: async (failureCount, error) => { return handleErrorRelogin(failureCount, error); },
        retryDelay: 2000
    });

    //eliminar
    const { mutateAsync: callBorrarProducto, isPending: callBorrarProductoLoading } = useMutation({
        mutationKey: ['adminBorrarProducto'],
        mutationFn: deleteAdminCatalogDeleteProductQueryFunction,
        onError: (error) => { if (logErrorsToConsole) console.log(error); },
        retry: async (failureCount, error) => { return handleErrorRelogin(failureCount, error); },
        retryDelay: 2000
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
                hasRecipe: producto.hasRecipe,
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
        onError: (error) => { if (logErrorsToConsole) console.log(error); },
        retry: async (failureCount, error) => { return handleErrorRelogin(failureCount, error); },
        retryDelay: 2000
    });

    //modificar producto
    const { mutateAsync: callModificarProducto, isPending: callModificarProductoLoading } = useMutation({
        mutationKey: ['adminModificarProducto'],
        mutationFn: updateAdminCatalogUpdateProductQueryFunction,
        onError: (error) => { if (logErrorsToConsole) console.log(error); },
        retry: async (failureCount, error) => { return handleErrorRelogin(failureCount, error); },
        retryDelay: 2000
    });

    // asignar receta
    const { mutateAsync: callCrearYAsignarReceta, isPending: callCrearYAsignarRecetaLoading } = useMutation({
        mutationKey: ['adminCrearYAsignarReceta'],
        mutationFn: postAdminInventoryAssignRecipeQueryFunction,
        onError: (error) => { if (logErrorsToConsole) console.log(error); },
        retry: async (failureCount, error) => { return handleErrorRelogin(failureCount, error); },
        retryDelay: 2000
    });

    // llamar receta del producto
    const { mutateAsync: callRecetaDelProducto, isPending: callRecetaDelProductoLoading } = useMutation({
        mutationKey: ['adminRecetaDelProducto'],
        mutationFn: getAdminInventoryGetProductRecipeQueryFunction,
        onError: (error) => { if (logErrorsToConsole) console.log(error); },
        retry: async (failureCount, error) => { return handleErrorRelogin(failureCount, error); },
        retryDelay: 2000
    });

    // ---------- SUCURSALES
    // listar
    const { mutateAsync: callSucursales, isPending: callSucursalesLoading } = useMutation({
        mutationKey: ['adminSucursales'],
        mutationFn: getAdminStoresQueryFunction,
        onSuccess: (data) => {
            setSucursales(data);
        },
        onError: (error) => { if (logErrorsToConsole) console.log(error); },
        retry: async (failureCount, error) => { return handleErrorRelogin(failureCount, error); },
        retryDelay: 2000
    });

    // crear
    const { mutateAsync: callCrearSucursal, isPending: callCrearSucursalLoading } = useMutation({
        mutationKey: ['adminCrearSucursal'],
        mutationFn: postAdminStoresAddStoreQueryFunction,
        onError: (error) => { if (logErrorsToConsole) console.log(error); },
        retry: async (failureCount, error) => { return handleErrorRelogin(failureCount, error); },
        retryDelay: 2000
    });

    // modificar
    const { mutateAsync: callActualizarSucursal, isPending: callActualizarSucursalLoading } = useMutation({
        mutationKey: ['adminActualizarSucursal'],
        mutationFn: putAdminStoresUpdateStoreQueryFunction,
        onError: (error) => { if (logErrorsToConsole) console.log(error); },
        retry: async (failureCount, error) => { return handleErrorRelogin(failureCount, error); },
        retryDelay: 2000
    });

    // listar horarios
    const { mutateAsync: callSchedule, isPending: callScheduleLoading } = useMutation({
        mutationKey: ['adminSchedule'],
        mutationFn: getAdminStoresScheduleQueryFunction,
        onSuccess: (data) => {
            setHorariosSucursal(data);
        },
        onError: (error) => { if (logErrorsToConsole) console.log(error); },
        retry: async (failureCount, error) => { return handleErrorRelogin(failureCount, error); },
        retryDelay: 2000
    });

    // modificar horarios
    const { mutateAsync: callUpdateSchedule, isPending: callUpdateScheduleLoading } = useMutation({
        mutationKey: ['adminUpdateSchedule'],
        mutationFn: putAdminStoresUpdateScheduleZoneQueryFunction,
        onError: (error) => { if (logErrorsToConsole) console.log(error); },
        retry: async (failureCount, error) => { return handleErrorRelogin(failureCount, error); },
        retryDelay: 2000
    });

    // listar zonas de entrega
    const { mutateAsync: callDeliveryZones, isPending: callDeliveryZonesLoading } = useMutation({
        mutationKey: ['adminDeliveryZones'],
        mutationFn: getAdminStoresDeliveryZonesQueryFunction,
        onSuccess: (data) => {
            setDeliverySucursal(data);
        },
        onError: (error) => { if (logErrorsToConsole) console.log(error); },
        retry: async (failureCount, error) => { return handleErrorRelogin(failureCount, error); },
        retryDelay: 2000
    });

    // crear zona de entrega
    const { mutateAsync: callCrearDeliveryZone, isPending: callCrearDeliveryZoneLoading } = useMutation({
        mutationKey: ['adminCrearDeliveryZone'],
        mutationFn: postAdminStoresAddDeliveryZoneQueryFunction,
        onError: (error) => { if (logErrorsToConsole) console.log(error); },
        retry: async (failureCount, error) => { return handleErrorRelogin(failureCount, error); },
        retryDelay: 2000
    });

    // modificar zona de entrega
    const { mutateAsync: callActualizarDeliveryZone, isPending: callActualizarDeliveryZoneLoading } = useMutation({
        mutationKey: ['adminActualizarDeliveryZone'],
        mutationFn: putAdminStoresUpdateDeliveryZoneQueryFunction,
        onError: (error) => { if (logErrorsToConsole) console.log(error); },
        retry: async (failureCount, error) => { return handleErrorRelogin(failureCount, error); },
        retryDelay: 2000
    });

    // eliminar zona de entrega   
    const { mutateAsync: callBorrarDeliveryZone, isPending: callBorrarDeliveryZoneLoading } = useMutation({
        mutationKey: ['adminBorrarDeliveryZone'],
        mutationFn: deleteAdminStoresDeleteDeliveryZoneQueryFunction,
        onError: (error) => { if (logErrorsToConsole) console.log(error); },
        retry: async (failureCount, error) => { return handleErrorRelogin(failureCount, error); },
        retryDelay: 2000
    });

    // ---------- COMBOS
    // listar
    const { mutateAsync: callCombos, isPending: callCombosLoading } = useMutation({
        mutationKey: ['adminCombos'],
        mutationFn: getAdminCatalogCombosQueryFunction,
        onSuccess: (data) => {
            setCombos(data);
        },
        onError: (error) => { if (logErrorsToConsole) console.log(error); },
        retry: async (failureCount, error) => { return handleErrorRelogin(failureCount, error); },
        retryDelay: 2000
    });

    // crear
    const { mutateAsync: callCrearCombo, isPending: callCrearComboLoading } = useMutation({
        mutationKey: ['adminCrearCombo'],
        mutationFn: postAdminCatalogAddComboQueryFunction,
        onError: (error) => { if (logErrorsToConsole) console.log(error); },
        retry: async (failureCount, error) => { return handleErrorRelogin(failureCount, error); },
        retryDelay: 2000
    });

    // borrar
    const { mutateAsync: callBorrarCombo, isPending: callBorrarComboLoading } = useMutation({
        mutationKey: ['adminBorrarCombo'],
        mutationFn: deleteAdminCatalogDeleteComboQueryFunction,
        onError: (error) => { if (logErrorsToConsole) console.log(error); },
        retry: async (failureCount, error) => { return handleErrorRelogin(failureCount, error); },
        retryDelay: 2000
    });

    // ---------- CATEGORÍAS
    // listar (ya se obtienen en callProductosYCategorias, pero agregamos uno independiente por si se necesita)
    const { mutateAsync: callCategorias, isPending: callCategoriasLoading } = useMutation({
        mutationKey: ['adminCategorias'],
        mutationFn: getAdminCatalogCategoriesQueryFunction,
        onSuccess: (data) => {
            setCategoriasTodas(data);
        },
        onError: (error) => { if (logErrorsToConsole) console.log(error); },
        retry: async (failureCount, error) => { return handleErrorRelogin(failureCount, error); },
        retryDelay: 2000
    });

    // crear
    const { mutateAsync: callCrearCategoria, isPending: callCrearCategoriaLoading } = useMutation({
        mutationKey: ['adminCrearCategoria'],
        mutationFn: postAdminCatalogAddCategoryQueryFunction,
        onError: (error) => { if (logErrorsToConsole) console.log(error); },
        retry: async (failureCount, error) => { return handleErrorRelogin(failureCount, error); },
        retryDelay: 2000
    });

    // actualizar
    const { mutateAsync: callActualizarCategoria, isPending: callActualizarCategoriaLoading } = useMutation({
        mutationKey: ['adminActualizarCategoria'],
        mutationFn: putAdminCatalogUpdateCategoryQueryFunction,
        onError: (error) => { if (logErrorsToConsole) console.log(error); },
        retry: async (failureCount, error) => { return handleErrorRelogin(failureCount, error); },
        retryDelay: 2000
    });

    // eliminar
    const { mutateAsync: callEliminarCategoria, isPending: callEliminarCategoriaLoading } = useMutation({
        mutationKey: ['adminEliminarCategoria'],
        mutationFn: deleteAdminCatalogDeleteCategoryQueryFunction,
        onError: (error) => { if (logErrorsToConsole) console.log(error); },
        retry: async (failureCount, error) => { return handleErrorRelogin(failureCount, error); },
        retryDelay: 2000
    });


    // ---------- INVENTARIO
    // listar
    const { mutateAsync: callMateriales, isPending: callMaterialesLoading } = useMutation({
        mutationKey: ['adminCallMateriales'],
        mutationFn: getAdminInventoryMaterialsQueryFunction,
        onSuccess: (data) => {
            setMateriales(data);
        },
        onError: (error) => { if (logErrorsToConsole) console.log(error); },
        retry: async (failureCount, error) => { return handleErrorRelogin(failureCount, error); },
        retryDelay: 2000
    });

    // crear
    const { mutateAsync: callCrearMaterial, isPending: callCrearMaterialLoading } = useMutation({
        mutationKey: ['adminCrearMaterial'],
        mutationFn: postAdminInventoryAddMaterialQueryFunction,
        onError: (error) => { if (logErrorsToConsole) console.log(error); },
        retry: async (failureCount, error) => { return handleErrorRelogin(failureCount, error); },
        retryDelay: 2000
    });

    // inventario materiales sucursal
    const { mutateAsync: callInventarioMaterialesSucursal, isPending: callInventarioMaterialesSucursalLoading } = useMutation({
        mutationKey: ['adminCallInventarioMaterialesSucursal'],
        mutationFn: getAdminInventoryMaterialsOnStoreQueryFunction,
        onSuccess: (data) => {
            setInventarioMaterialesSucursal(data);
        },
        onError: (error) => { if (logErrorsToConsole) console.log(error); },
        retry: async (failureCount, error) => { return handleErrorRelogin(failureCount, error); },
        retryDelay: 2000
    });

    // inventario productos sucursal
    const { mutateAsync: callInventarioProductosSucursal, isPending: callInventarioProductosSucursalLoading } = useMutation({
        mutationKey: ['adminCallInventarioProductosSucursal'],
        mutationFn: getAdminInventoryProductsOnStoreQueryFunction,
        onSuccess: (data) => {
            const merged = data.map(sel => {
                const cat = productos.find(c => c.id === sel.productId);
                return {
                    ...sel,      // keep qty
                    ...cat       // bring in name, price
                };
            });

            setInventarioProductosSucursal(merged);
        },
        onError: (error) => { if (logErrorsToConsole) console.log(error); },
        retry: async (failureCount, error) => { return handleErrorRelogin(failureCount, error); },
        retryDelay: 2000
    });

    // inbound
    const { mutateAsync: callInbound, isPending: callInboundLoading } = useMutation({
        mutationKey: ['adminInbound'],
        mutationFn: postAdminInventoryInboundQueryFunction,
        onError: (error) => { if (logErrorsToConsole) console.log(error); },
        retry: async (failureCount, error) => { return handleErrorRelogin(failureCount, error); },
        retryDelay: 2000
    });

    // ---------- FABRICA
    // make
    const { mutateAsync: callMakeProducto, isPending: callMakeProductoLoading } = useMutation({
        mutationKey: ['adminMakeProducto'],
        mutationFn: postAdminInventoryMakeProductsQueryFunction,
        onError: (error) => { if (logErrorsToConsole) console.log(error); },
        retry: async (failureCount, error) => { return handleErrorRelogin(failureCount, error); },
        retryDelay: 2000
    });

    // transfer
    const { mutateAsync: callTransferProducto, isPending: callTransferProductoLoading } = useMutation({
        mutationKey: ['adminTransferProducto'],
        mutationFn: postAdminInventoryTransferProductsQueryFunction,
        onError: (error) => { if (logErrorsToConsole) console.log(error); },
        retry: async (failureCount, error) => { return handleErrorRelogin(failureCount, error); },
        retryDelay: 2000
    });

    // adjust
    const { mutateAsync: callAdjustProducto, isPending: callAdjustProductoLoading } = useMutation({
        mutationKey: ['adminAdjustProducto'],
        mutationFn: postAdminInventoryAdjustProductsQueryFunction,
        onError: (error) => { if (logErrorsToConsole) console.log(error); },
        retry: async (failureCount, error) => { return handleErrorRelogin(failureCount, error); },
        retryDelay: 2000
    });

    // ---------- COMPANY INFO
    // get
    const { mutateAsync: callCompanyInfo, isPending: callCompanyInfoLoading } = useMutation({
        mutationKey: ['adminCallCompanyInfo'],
        mutationFn: getAdminStoresCompanyInfoQueryFunction,
        onSuccess: (data) => {
            setCompanyInfo(data);
        },
        onError: (error) => { if (logErrorsToConsole) console.log(error); },
        retry: async (failureCount, error) => { return handleErrorRelogin(failureCount, error); },
        retryDelay: 2000
    });

    // update
    const { mutateAsync: callActualizarCompanyInfo, isPending: callActualizarCompanyInfoLoading } = useMutation({
        mutationKey: ['adminActualizarCompanyInfo'],
        mutationFn: putAdminStoresUpdateCompanyInfoQueryFunction,
        onError: (error) => { if (logErrorsToConsole) console.log(error); },
        retry: async (failureCount, error) => { return handleErrorRelogin(failureCount, error); },
        retryDelay: 2000
    });

    // --------- ORDERS

    // create
    const { mutateAsync: callCreateOrder, isPending: callCreateOrderLoading } = useMutation({
        mutationKey: ['adminCreateOrder'],
        mutationFn: postAdminOrdersCreateOrderQueryFunction,
        onError: (error) => { if (logErrorsToConsole) console.log(error); },
        retry: async (failureCount, error) => { return handleErrorRelogin(failureCount, error); },
        retryDelay: 2000
    });

    // get
    const { mutateAsync: callOrders, isPending: callOrdersLoading } = useMutation({
        mutationKey: ['adminOrders'],
        mutationFn: getAdminOrdersGetOrdersQueryFunction,
        onSuccess: (data) => {
            const filteredOrdersByStoreId = data.filter((o) => o.storeId == sucursalSeleccionada);
            setOrders(filteredOrdersByStoreId);
        },
        onError: (error) => { if (logErrorsToConsole) console.log(error); },
        retry: async (failureCount, error) => { return handleErrorRelogin(failureCount, error); },
        retryDelay: 2000
    });

    // paycash
    const { mutateAsync: callOrderPayCash, isPending: callOrderPayCashLoading } = useMutation({
        mutationKey: ['adminOrderPayCash'],
        mutationFn: postAdminOrdersPayCashQueryFunction,
        onError: (error) => { if (logErrorsToConsole) console.log(error); },
        retry: async (failureCount, error) => { return handleErrorRelogin(failureCount, error); },
        retryDelay: 2000
    });

    // close
    const { mutateAsync: callOrderClose, isPending: callOrderCloseLoading } = useMutation({
        mutationKey: ['adminOrderClose'],
        mutationFn: postAdminOrdersCloseQueryFunction,
        onError: (error) => { if (logErrorsToConsole) console.log(error); },
        retry: async (failureCount, error) => { return handleErrorRelogin(failureCount, error); },
        retryDelay: 2000
    });

    // public print job
    const { mutateAsync: callPublicCreatePrintJob, isPending: callPublicCreatePrintJobLoading } = useMutation({
        mutationKey: ['publicCreatePrintJob'],
        mutationFn: postPublicOrdersCreatePrintJobQueryFunction,
        onError: (error) => {
            if (logErrorsToConsole) console.log(error);
        },
    });

    const { mutateAsync: callPublicForcePrintJob, isPending: callPublicForcePrintJobLoading } = useMutation({
        mutationKey: ['publicForcePrintJob'],
        mutationFn: putPublicOrdersForcePrintJobQueryFunction,
        onError: (error) => {
            if (logErrorsToConsole) console.log(error);
        },
    });



    const showDebugStateInfo = () => {
        const debugInfo = {
            PRODUCTOS: productos,
            CATEGORIAS: categorias,
            SUCURSALES: sucursales,
            MATERIALES: materiales,
            COMBOS: combos,
            COMPANY_INFO: companyInfo,
            SUCURSAL_SELECCIONADA: sucursalSeleccionada,
            SUCURSAL_SELECCIONADA_INFO: sucursalSeleccionadaInfo,
            PRODUCTOS_SUCURSAL: productosSucursal,
            COMBOS_SUCURSAL: combosSucursal,
            DELIVERY_SUCURSAL: deliverySucursal,
            HORARIOS_SUCURSAL: horariosSucursal,
            INVENTARIO_MATERIALES_SUCURSAL: inventarioMaterialesSucursal,
            INVENTARIO_PROODUCTOS_SUCURSAL: inventarioProductosSucursal,
            USERDATA: session.userData,
            ORDERS: orders,
        }
        console.log(debugInfo);
    }

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
        callBorrarDeliveryZoneLoading ||
        callScheduleLoading ||
        callUpdateScheduleLoading ||
        callMaterialesLoading ||
        callCrearMaterialLoading ||
        callCombosLoading ||
        callCrearComboLoading ||
        callCrearYAsignarRecetaLoading ||
        callBorrarComboLoading ||
        callInventarioMaterialesSucursalLoading ||
        callInventarioProductosSucursalLoading ||
        callMakeProductoLoading ||
        callTransferProductoLoading ||
        callAdjustProductoLoading ||
        callInboundLoading ||
        callCompanyInfoLoading ||
        callActualizarCompanyInfoLoading ||
        callCategoriasLoading ||
        callActualizarCategoriaLoading ||
        callCrearCategoriaLoading ||
        callEliminarCategoriaLoading ||
        callCreateOrderLoading ||
        callOrderCloseLoading ||
        callOrderPayCashLoading ||
        callOrdersLoading;

    return (
        <AdminDataContext.Provider value={{
            productos,
            combos,
            categorias,
            categoriasTodas,
            sucursales,
            materiales,
            orders,

            sucursalSeleccionada,
            sucursalSeleccionadaInfo,
            setSucursalSeleccionada,
            productosSucursal,
            combosSucursal,
            deliverySucursal,
            horariosSucursal,

            inventarioMaterialesSucursal,
            inventarioProductosSucursal,

            showDebugStateInfo,

            adminDataLoading,
            adminStartingLoading,

            callCompanyInfo,
            callActualizarCompanyInfo,

            callInventarioMaterialesSucursal,
            callInventarioProductosSucursal,

            callInbound,

            callMakeProducto,
            callTransferProducto,
            callAdjustProducto,

            callCombos,
            callCrearCombo,
            callBorrarCombo,

            callProductosYCategorias,
            callProductoNuevo,

            callCrearYAsignarReceta,
            callRecetaDelProducto,
            callRecetaDelProductoLoading,

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
            callBorrarDeliveryZone,

            callSchedule,
            callUpdateSchedule,

            callMateriales,
            callCrearMaterial,

            callCategorias,
            callCrearCategoria,
            callActualizarCategoria,
            callEliminarCategoria,

            callOrders,
            callCreateOrder,
            callOrderPayCash,
            callOrderClose,

            callPublicCreatePrintJob,
            callPublicCreatePrintJobLoading,
            callPublicForcePrintJob,
            callPublicForcePrintJobLoading,
        }}>
            {children}
        </AdminDataContext.Provider>
    )
}

export default AdminDataProvider;

export function useAdminData() {
    return useContext(AdminDataContext);
}