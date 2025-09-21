import axios from "axios";
import { ENDPOINTS } from "@/config/apiEndpoints";

// traer todos los productos
export const getAdminCatalogProductosYCategoriasQueryFunction = async (_accessToken) => {
    const axiosSetup = {
        axiosData: null,
        axiosConfig: {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${_accessToken}`,
            },
        }
    }

    const response = await axios.get(`${ENDPOINTS.catalog}/admin/products`, axiosSetup.axiosConfig);
    return await response.data;
}

// agregar un producto completo
export const postAdminCatalogAddProductQueryFunction = async ({_producto, _accessToken}) => {
    const axiosSetup = {
        axiosData: _producto,
        axiosConfig: {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${_accessToken}`,
            }
        }
    }

    const response = await axios.post(`${ENDPOINTS.catalog}/admin/products`, axiosSetup.axiosData, axiosSetup.axiosConfig);
    return await response.data;
}

// borrar un producto
export const deleteAdminCatalogDeleteProductQueryFunction = async ({_id, _accessToken}) => {
    const axiosSetup = {
        axiosData: null,
        axiosConfig: {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${_accessToken}`,
            }
        }
    }

    const response = await axios.delete(`${ENDPOINTS.catalog}/admin/products/${_id}`, axiosSetup.axiosConfig);
    return await response.data;
}

// borrar la imagen de un producto
export const deleteAdminCatalogDeleteProductImageQueryFunction = async ({_id, _accessToken}) => {
    const axiosSetup = {
        axiosData: null,
        axiosConfig: {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${_accessToken}`,
            }
        }
    }

    const response = await axios.delete(`${ENDPOINTS.catalog}/admin/products/${_id}/image`, axiosSetup.axiosConfig);
    return await response.data;
}

// agregar la imagen de un producto
export const postAdminCatalogAddProductImageQueryFunction = async ({_producto, _accessToken}) => {
    const axiosSetup = {
        axiosData: {
            "imageBase64" : _producto.imageBase64,
        },
        axiosConfig: {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${_accessToken}`,
            }
        }
    }

    const response = await axios.post(`${ENDPOINTS.catalog}/admin/products/${_producto.id}/image`, axiosSetup.axiosData, axiosSetup.axiosConfig);
    return await response.data;
}

// actualizar un producto
export const updateAdminCatalogUpdateProductQueryFunction = async ({_producto, _accessToken}) => {
    const axiosSetup = {
        axiosData: _producto,
        axiosConfig: {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${_accessToken}`,
            }
        }
    }

    const response = await axios.put(`${ENDPOINTS.catalog}/admin/products/${_producto.id}`, axiosSetup.axiosData, axiosSetup.axiosConfig);
    return await response.data;
}

// publicar para sucursal
export const postAdminCatalogAsignarASucursalQueryFunction = async ({_productosCombos, _idSucursal, _accessToken}) => {
    const axiosSetup = {
        axiosData: _productosCombos,
        axiosConfig: {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${_accessToken}`,
            }
        }
    }

    const response = await axios.post(`${ENDPOINTS.catalog}/admin/publish/${_idSucursal}`, axiosSetup.axiosData, axiosSetup.axiosConfig);
    return await response.data;
}