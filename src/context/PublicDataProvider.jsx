/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState, useContext, createContext } from 'react'
import { useMutation } from '@tanstack/react-query';
import {
    getPublicCatalogQueryFunction,
    getPublicStoresQueryFunction,
} from '@/config/apiPublicQueryFunctions';

const PublicDataContext = createContext();

export const PublicDataProvider = ({ children }) => {

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

    useEffect(() => {
        if (sucursalSeleccionada) {
            callPublicCatalog(sucursalSeleccionada);
        }
    }, [sucursalSeleccionada]);

    useEffect(() => {
        callPublicStores();
    }, []);

    const publicDataLoading =
        callPublicCatalogLoading ||
        callPublicStoresLoading;

    return (
        <PublicDataContext.Provider value={{
            productos,
            categorias,
            sucursales,
            sucursalSeleccionada,
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