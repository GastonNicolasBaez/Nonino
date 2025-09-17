import axios from "axios";

// PUBLIC DATA

export const getPublicDataQueryFunction = async (_idSucursal) => {
    const response = await axios.get(`https://nonino-catalog.fly.dev/public/catalog/stores/${_idSucursal}/menu`);
    return await response.data;
}

export const getLoginQueryFunction = async (_credentials) => {
    const axiosSetup = {
        axiosData: _credentials,
        axiosConfig: {
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true,
        }
    }

    const response = await axios.post(`https://nonino-auth.fly.dev/auth/login`, axiosSetup.axiosData, axiosSetup.axiosConfig);
    return await response.data;
}

export const getRefreshQueryFunction = async (_csrfToken) => {
    const axiosSetup = {
        axiosData: null,
        axiosConfig: {
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": _csrfToken,
            },
            withCredentials: true
        }
    }

    const response = await axios.post(`https://nonino-auth.fly.dev/auth/refresh`, axiosSetup.axiosData, axiosSetup.axiosConfig);
    return await response.data;
}

// ADMIN DATA
// traer todos los productos
export const getAdminCatalogQueryFunction = async (_accessToken) => {
    const axiosSetup = {
        axiosData: null,
        axiosConfig: {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${_accessToken}`,
            },
        }
    }

    const response = await axios.get(`https://nonino-catalog.fly.dev/admin/products`, axiosSetup.axiosConfig);
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

    const response = await axios.post(`https://nonino-catalog.fly.dev/admin/products`, axiosSetup.axiosData, axiosSetup.axiosConfig);
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

    const response = await axios.delete(`https://nonino-catalog.fly.dev/admin/products/${_id}`, axiosSetup.axiosConfig);
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

    const response = await axios.delete(`https://nonino-catalog.fly.dev/admin/products/${_id}/image`, axiosSetup.axiosConfig);
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

    const response = await axios.post(`https://nonino-catalog.fly.dev/admin/products/${_producto.id}/image`, axiosSetup.axiosData, axiosSetup.axiosConfig);
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

    const response = await axios.put(`https://nonino-catalog.fly.dev/admin/products/${_producto.id}`, axiosSetup.axiosData, axiosSetup.axiosConfig);
    return await response.data;
}
