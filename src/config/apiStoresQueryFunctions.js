import axios from "axios";

const url = 'https://nonino-store.fly.dev';

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

    const response = await axios.get(`${url}/admin/stores`, axiosSetup.axiosConfig);
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

    const response = await axios.post(`${url}/admin/store`, axiosSetup.axiosData, axiosSetup.axiosConfig);
    return await response.data;
}