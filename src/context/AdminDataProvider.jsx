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

import { useSession } from '@/context/SessionProvider';

const AdminDataContext = createContext();

export const AdminDataProvider = ({ children }) => {

    const session = useSession();

    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [categoriasTodas, setCategoriasTodas] = useState([]);
    const [sucursales, setSucursales] = useState([]);
    const [materiales, setMateriales] = useState([]);
    const [combos, setCombos] = useState([]);

    const [sucursalSeleccionada, setSucursalSeleccionada] = useState();

    const [productosSucursal, setProductosSucursal] = useState([]);
    const [combosSucursal, setCombosSucursal] = useState([]);
    const [deliverySucursal, setDeliverySucursal] = useState([]);
    const [horariosSucursal, setHorariosSucursal] = useState([]);
    const [inventarioMaterialesSucursal, setInventarioMaterialesSucursal] = useState([]);
    const [inventarioProductosSucursal, setInventarioProductosSucursal] = useState([]);
    const [companyInfo, setCompanyInfo] = useState([]);


    //cargar información de admin al montar la vista de administrador
    useEffect(() => {
        const at = session.userData?.accessToken;
        if (at) {
            callProductosYCategorias(at);
            callSucursales(at);
            callMateriales(at);
            callCombos(at);
            callCategorias(at);
            setSucursalSeleccionada(session.userData.sucursal);
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

            //inventario de sucursal
            callInventarioMaterialesSucursal({
                _storeId: sucursalSeleccionada,
                _accessToken: at,
            });
            callInventarioProductosSucursal({
                _storeId: sucursalSeleccionada,
                _accessToken: at,
            });
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

            const gotCombos = data.combos;

            setProductosSucursal(gotProducts);
            setCombosSucursal(gotCombos);
        },
        onError: (error) => {
            console.log(error);
            setProductosSucursal([]);
            setCombosSucursal([]);
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

    // asignar receta
    const { mutateAsync: callCrearYAsignarReceta, isPending: callCrearYAsignarRecetaLoading } = useMutation({
        mutationKey: ['adminCrearYAsignarReceta'],
        mutationFn: postAdminInventoryAssignRecipeQueryFunction,
    });

    // llamar receta del producto
    const { mutateAsync: callRecetaDelProducto, isPending: callRecetaDelProductoLoading } = useMutation({
        mutationKey: ['adminRecetaDelProducto'],
        mutationFn: getAdminInventoryGetProductRecipeQueryFunction,
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

    // listar horarios
    const { mutateAsync: callSchedule, isPending: callScheduleLoading } = useMutation({
        mutationKey: ['adminSchedule'],
        mutationFn: getAdminStoresScheduleQueryFunction,
        onSuccess: (data) => {
            setHorariosSucursal(data);
        },
        onError: (error) => {
            console.log(error);
            setHorariosSucursal([]);
        }
    });

    // modificar horarios
    const { mutateAsync: callUpdateSchedule, isPending: callUpdateScheduleLoading } = useMutation({
        mutationKey: ['adminUpdateSchedule'],
        mutationFn: putAdminStoresUpdateScheduleZoneQueryFunction,
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

    // ---------- COMBOS
    // listar
    const { mutateAsync: callCombos, isPending: callCombosLoading } = useMutation({
        mutationKey: ['adminCombos'],
        mutationFn: getAdminCatalogCombosQueryFunction,
        onSuccess: (data) => {
            setCombos(data);
        },
        onError: (error) => {
            console.log(error);
            setCombos([]);
        }
    });

    // crear
    const { mutateAsync: callCrearCombo, isPending: callCrearComboLoading } = useMutation({
        mutationKey: ['adminCrearCombo'],
        mutationFn: postAdminCatalogAddComboQueryFunction,
    });

    // borrar
    const { mutateAsync: callBorrarCombo, isPending: callBorrarComboLoading } = useMutation({
        mutationKey: ['adminBorrarCombo'],
        mutationFn: deleteAdminCatalogDeleteComboQueryFunction,
    });

    // ---------- CATEGORÍAS
    // listar (ya se obtienen en callProductosYCategorias, pero agregamos uno independiente por si se necesita)
    const { mutateAsync: callCategorias, isPending: callCategoriasLoading } = useMutation({
        mutationKey: ['adminCategorias'],
        mutationFn: getAdminCatalogCategoriesQueryFunction,
        onSuccess: (data) => {
            setCategoriasTodas(data);
        },
        onError: (error) => {
            console.log(error);
            setCategoriasTodas([]);
        }
    });

    // crear
    const { mutateAsync: callCrearCategoria, isPending: callCrearCategoriaLoading } = useMutation({
        mutationKey: ['adminCrearCategoria'],
        mutationFn: postAdminCatalogAddCategoryQueryFunction,
    });

    // actualizar
    const { mutateAsync: callActualizarCategoria, isPending: callActualizarCategoriaLoading } = useMutation({
        mutationKey: ['adminActualizarCategoria'],
        mutationFn: putAdminCatalogUpdateCategoryQueryFunction,
    });

    // eliminar
    const { mutateAsync: callEliminarCategoria, isPending: callEliminarCategoriaLoading } = useMutation({
        mutationKey: ['adminEliminarCategoria'],
        mutationFn: deleteAdminCatalogDeleteCategoryQueryFunction,
    });


    // ---------- INVENTARIO
    // listar
    const { mutateAsync: callMateriales, isPending: callMaterialesLoading } = useMutation({
        mutationKey: ['adminCallMateriales'],
        mutationFn: getAdminInventoryMaterialsQueryFunction,
        onSuccess: (data) => {
            setMateriales(data);
        },
        onError: (error) => {
            console.log(error);
            setMateriales([]);
        }
    });

    // crear
    const { mutateAsync: callCrearMaterial, isPending: callCrearMaterialLoading } = useMutation({
        mutationKey: ['adminCrearMaterial'],
        mutationFn: postAdminInventoryAddMaterialQueryFunction,
    });

    // inventario materiales sucursal
    const { mutateAsync: callInventarioMaterialesSucursal, isPending: callInventarioMaterialesSucursalLoading } = useMutation({
        mutationKey: ['adminCallInventarioMaterialesSucursal'],
        mutationFn: getAdminInventoryMaterialsOnStoreQueryFunction,
        onSuccess: (data) => {
            setInventarioMaterialesSucursal(data);
        },
        onError: (error) => {
            console.log(error);
            setInventarioMaterialesSucursal([]);
        }
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
        onError: (error) => {
            console.log(error);
            setInventarioProductosSucursal([]);
        }
    });

    // inbound
    const { mutateAsync: callInbound, isPending: callInboundLoading } = useMutation({
        mutationKey: ['adminInbound'],
        mutationFn: postAdminInventoryInboundQueryFunction,
    });

    // ---------- FABRICA
    // make
    const { mutateAsync: callMakeProducto, isPending: callMakeProductoLoading } = useMutation({
        mutationKey: ['adminMakeProducto'],
        mutationFn: postAdminInventoryMakeProductsQueryFunction,
    });

    // transfer
    const { mutateAsync: callTransferProducto, isPending: callTransferProductoLoading } = useMutation({
        mutationKey: ['adminTransferProducto'],
        mutationFn: postAdminInventoryTransferProductsQueryFunction,
    });

    // adjust
    const { mutateAsync: callAdjustProducto, isPending: callAdjustProductoLoading } = useMutation({
        mutationKey: ['adminAdjustProducto'],
        mutationFn: postAdminInventoryAdjustProductsQueryFunction,
    });

    // ---------- COMPANY INFO
    // get
    const { mutateAsync: callCompanyInfo, isPending: callCompanyInfoLoading } = useMutation({
        mutationKey: ['adminCallCompanyInfo'],
        mutationFn: getAdminStoresCompanyInfoQueryFunction,
        onSuccess: (data) => {
            setCompanyInfo(data);
        },
        onError: (error) => {
            console.log(error);
            setCompanyInfo([]);
        }
    });

    // update
    const { mutateAsync: callActualizarCompanyInfo, isPending: callActualizarCompanyInfoLoading } = useMutation({
        mutationKey: ['adminActualizarCompanyInfo'],
        mutationFn: putAdminStoresUpdateCompanyInfoQueryFunction,
    });

    //

    const showDebugStateInfo = () => {
        console.log('SUCURSAL:', sucursalSeleccionada);
        console.log('PRODUCTOS:', productos);
        console.log('CATEGORIAS:', categorias);
        console.log('SUCURSALES:', sucursales);
        console.log('MATERIALES:', materiales);
        console.log('COMBOS:', combos);
        console.log('COMPANY INFO:', companyInfo);
        console.log('--- --- ---');
        console.log('SUCURSAL SELECCIONADA:', sucursalSeleccionada);
        console.log('PRODUCTOS SUCURSAL:', productosSucursal);
        console.log('COMBOS SUCURSAL:', combosSucursal);
        console.log('DELIVERY SUCURSAL:', deliverySucursal);
        console.log('HORARIOS SUCURSAL:', horariosSucursal);
        console.log('INVENTARIO MATERIALES SUCURSAL:', inventarioMaterialesSucursal);
        console.log('INVENTARIO PRODUCTOS SUCURSAL:', inventarioProductosSucursal);
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
        callEliminarCategoriaLoading;

    return (
        <AdminDataContext.Provider value={{
            productos,
            combos,
            categorias,
            categoriasTodas,
            sucursales,
            materiales,

            sucursalSeleccionada,
            setSucursalSeleccionada,
            productosSucursal,
            combosSucursal,
            deliverySucursal,
            horariosSucursal,

            inventarioMaterialesSucursal,
            inventarioProductosSucursal,

            showDebugStateInfo,

            adminDataLoading,

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
        }}>
            {children}
        </AdminDataContext.Provider>
    )
}

export const useAdminData = () => {
    return useContext(AdminDataContext);
}