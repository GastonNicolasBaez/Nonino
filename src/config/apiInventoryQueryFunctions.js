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