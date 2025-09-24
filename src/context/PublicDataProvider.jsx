/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState, useContext, createContext } from 'react'
import { useMutation } from '@tanstack/react-query';
import {
    getPublicCatalogQueryFunction,
    getPublicStoresQueryFunction,
    getPublicProductosQueryFunction,
    getPublicCombosQueryFunction,
} from '@/config/apiPublicQueryFunctions';

const PublicDataContext = createContext();

export const PublicDataProvider = ({ children }) => {

    const [productosTodos, setProductosTodos] = useState([]);
    const [combosTodos, setCombosTodos] = useState([]);

    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [sucursales, setSucursales] = useState([]);
    const [sucursalSeleccionada, setSucursalSeleccionada] = useState();

    // sucursales
    const { mutateAsync: callPublicStores, isPending: callPublicStoresLoading } = useMutation({
        mutationKey: ['publicStores'],
        mutationFn: getPublicStoresQueryFunction,
        onSuccess: (data) => {
            setSucursales(data);
        },
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
        },
        onError: (error) => {
            console.log(error);
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

    const { mutateAsync: callPublicCombos, isPending: callPublicCombosLoading } = useMutation({
        mutationKey: ['publicCombos'],
        mutationFn: getPublicCombosQueryFunction,
        onSuccess: (data) => {
            setCombosTodos(data);
        },
        onError: (error) => {
            console.log(error);
        }
    });

    useEffect(() => {
        if (sucursalSeleccionada) {
            callPublicCatalog(sucursalSeleccionada);
        }
    }, [sucursalSeleccionada]);

    useEffect(() => {
        callPublicStores();
        callPublicProductos();
        callPublicCombos();
    }, []);

    const publicDataLoading =
        callPublicCatalogLoading ||
        callPublicStoresLoading ||
        callPublicProductosLoading ||
        callPublicCombosLoading;

    return (
        <PublicDataContext.Provider value={{
            productos,
            categorias,
            sucursales,
            sucursalSeleccionada,
            productosTodos,
            combosTodos,
            setSucursalSeleccionada,

            publicDataLoading,
        }}>
            {children}
        </PublicDataContext.Provider>
    )
}

export const usePublicData = () => {
    return useContext(PublicDataContext);
}