import axios from "axios";
import { ENDPOINTS } from "@/config/apiEndpoints";

// get sucursales

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