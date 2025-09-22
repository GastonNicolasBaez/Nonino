import axios from "axios";
import { ENDPOINTS } from "@/config/apiEndpoints";

// listar sucursales
export const getAdminStoresQueryFunction = async (_accessToken) => {
    const axiosSetup = {
        axiosData: null,
        axiosConfig: {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${_accessToken}`,
            }
        }
    }

    const response = await axios.get(`${ENDPOINTS.stores}/admin/stores`, axiosSetup.axiosConfig);
    return await response.data;
}

// crear sucursal
export const postAdminStoresAddStoreQueryFunction = async ({_store, _accessToken}) => {
    const axiosSetup = {
        axiosData: _store,
        axiosConfig: {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${_accessToken}`,
            }
        }
    }

    console.log(axiosSetup);

    const response = await axios.post(`${ENDPOINTS.stores}/admin/stores`, axiosSetup.axiosData, axiosSetup.axiosConfig);
    return await response.data;
}

// modificar sucursal
export const putAdminStoresUpdateStoreQueryFunction = async ({_store, _accessToken}) => {
    const axiosSetup = {
        axiosData: _store,
        axiosConfig: {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${_accessToken}`,
            }
        }
    }

    const response = await axios.put(`${ENDPOINTS.stores}/admin/stores/${_store.id}`, axiosSetup.axiosData, axiosSetup.axiosConfig);
    return await response.data;
}

// listar zona de entrega de sucursal
export const getAdminStoresDeliveryZonesQueryFunction = async ({_storeId, _accessToken}) => {
    const axiosSetup = {
        axiosData: null,
        axiosConfig: {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${_accessToken}`,
            }
        }
    }

    const response = await axios.get(`${ENDPOINTS.stores}/admin/stores/${_storeId}/neighborhoods`, axiosSetup.axiosConfig);
    return await response.data;
}

// crear zona de entrega de sucursal
export const postAdminStoresAddDeliveryZoneQueryFunction = async ({_storeId, _deliveryZone, _accessToken}) => {
    const axiosSetup = {
        axiosData: _deliveryZone,
        axiosConfig: {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${_accessToken}`,
            }
        }
    }

    console.log(axiosSetup);

    const response = await axios.post(`${ENDPOINTS.stores}/admin/stores/${_storeId}/neighborhoods`, axiosSetup.axiosData, axiosSetup.axiosConfig);
    return await response.data;
}

// modificar sucursal
export const putAdminStoresUpdateDeliveryZoneQueryFunction = async ({_storeId, _deliveryZone, _accessToken}) => {
    const axiosSetup = {
        axiosData: _deliveryZone,
        axiosConfig: {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${_accessToken}`,
            }
        }
    }

    const response = await axios.put(`${ENDPOINTS.stores}/admin/stores/${_storeId}/neighborhoods/${_deliveryZone.id}`, axiosSetup.axiosData, axiosSetup.axiosConfig);
    return await response.data;
}

// eliminar zona de entrega de sucursal
export const deleteAdminStoresDeleteDeliveryZoneQueryFunction = async ({_storeId, _deliveryZoneId, _accessToken}) => {
    const axiosSetup = {
        axiosData: null,
        axiosConfig: {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${_accessToken}`,
            }
        }
    }

    const response = await axios.delete(`${ENDPOINTS.stores}/admin/stores/${_storeId}/neighborhoods/${_deliveryZoneId}`, axiosSetup.axiosConfig);
    return await response.data;
}