import axios from "axios";
import { ENDPOINTS } from "@/config/apiEndpoints";

// listar inventario general

export const getAdminInventoryMaterialsQueryFunction = async (_accessToken) => {
    const axiosSetup = {
        axiosData: null,
        axiosConfig: {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${_accessToken}`,
            },
        }
    }

    const response = await axios.get(`${ENDPOINTS.inventory}/admin/materials`, axiosSetup.axiosConfig);
    return await response.data;
}

// crear material

export const postAdminInventoryAddMaterialQueryFunction = async ({_material, _accessToken}) => {
    const axiosSetup = {
        axiosData: _material,
        axiosConfig: {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${_accessToken}`,
            }
        }
    }

    console.log(axiosSetup);

    const response = await axios.post(`${ENDPOINTS.inventory}/admin/materials`, axiosSetup.axiosData, axiosSetup.axiosConfig);
    return await response.data;
}


export const postAdminInventoryAssignRecipeQueryFunction = async ({_recipe, _accessToken}) => {
    const axiosSetup = {
        axiosData: _recipe,
        axiosConfig: {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${_accessToken}`,
            }
        }
    }

    console.log(axiosSetup);

    const response = await axios.post(`${ENDPOINTS.inventory}/admin/recipes`, axiosSetup.axiosData, axiosSetup.axiosConfig);
    return await response.data;
}

// llamar receta del producto
export const getAdminInventoryGetProductRecipeQueryFunction = async ({_productId, _accessToken}) => {
    const axiosSetup = {
        axiosData: null,
        axiosConfig: {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${_accessToken}`,
            },
        }
    }

    const response = await axios.get(`${ENDPOINTS.inventory}/admin/recipes/${_productId}`, axiosSetup.axiosConfig);
    return await response.data;
}

// ---------- INVENTARIO DE SUCURSAL

// materiales de sucursal
export const getAdminInventoryMaterialsOnStoreQueryFunction = async ({_storeId, _accessToken}) => {
    const axiosSetup = {
        axiosData: null,
        axiosConfig: {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${_accessToken}`,
            },
        }
    }

    const response = await axios.get(`${ENDPOINTS.inventory}/admin/materials/stock/${_storeId}`, axiosSetup.axiosConfig);
    return await response.data;
}

// productos de sucursal
export const getAdminInventoryProductsOnStoreQueryFunction = async ({_storeId, _accessToken}) => {
    const axiosSetup = {
        axiosData: null,
        axiosConfig: {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${_accessToken}`,
            },
        }
    }

    const response = await axios.get(`${ENDPOINTS.inventory}/admin/product-stock/${_storeId}`, axiosSetup.axiosConfig);
    return await response.data;
}

// inbound
export const postAdminInventoryInboundQueryFunction = async ({_inbound, _accessToken}) => {
    const axiosSetup = {
        axiosData: _inbound,
        axiosConfig: {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${_accessToken}`,
            }
        }
    }

    console.log(axiosSetup);

    const response = await axios.post(`${ENDPOINTS.inventory}/admin/product-stock/produce`, axiosSetup.axiosData, axiosSetup.axiosConfig);
    return await response.data;
}

// ---------- OPERACIONES DE FABRICA
// transferir
export const postAdminInventoryTransferProductsQueryFunction = async ({_transfer, _accessToken}) => {
    const axiosSetup = {
        axiosData: _transfer,
        axiosConfig: {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${_accessToken}`,
            }
        }
    }

    console.log(axiosSetup);

    const response = await axios.post(`${ENDPOINTS.inventory}/admin/product-stock/transfer`, axiosSetup.axiosData, axiosSetup.axiosConfig);
    return await response.data;
}

// producir
export const postAdminInventoryMakeProductsQueryFunction = async ({_produce, _accessToken}) => {
    const axiosSetup = {
        axiosData: _produce,
        axiosConfig: {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${_accessToken}`,
            }
        }
    }

    console.log(axiosSetup);

    const response = await axios.post(`${ENDPOINTS.inventory}/admin/product-stock/produce`, axiosSetup.axiosData, axiosSetup.axiosConfig);
    return await response.data;
}

// ajustar
export const postAdminInventoryAdjustProductsQueryFunction = async ({_adjust, _accessToken}) => {
    const axiosSetup = {
        axiosData: _adjust,
        axiosConfig: {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${_accessToken}`,
            }
        }
    }

    console.log(axiosSetup);

    const response = await axios.post(`${ENDPOINTS.inventory}/admin/product-stock/adjust`, axiosSetup.axiosData, axiosSetup.axiosConfig);
    return await response.data;
}