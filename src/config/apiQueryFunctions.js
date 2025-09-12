import axios from "axios";

const API_LOGIN = `https://nonino-auth.fly.dev/auth/login`;
const API_REFRESH = `https://nonino-auth.fly.dev/auth/refresh`;
const API_CATALOGURL = `https://nonino-catalog.fly.dev/public/catalog/stores/1/menu`;
const API_INVENTORYURL = "";
const API_STOREURL = "";
const API_ORDERURL = "";

export const ENDPOINTS = '';

export const getPublicDataQueryFunction = async (_idSucursal) => {
    const response = await axios.get(`https://nonino-catalog.fly.dev/public/catalog/stores/${_idSucursal}/menu`);
    return await response.data;
}

export const getLoginQueryFunction = async ({ _email, _password }) => {
    const axiosSetup = {
        axiosData: {
            email: _email,
            password: _password,
        },
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
        axiosData: {
        },
        axiosConfig: {
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": _csrfToken,
            },
            withCredentials: true
        }
    }

    const response = await axios.post(`https://nonino-auth.fly.dev/auth/refresh`, null, axiosSetup.axiosConfig);
    return await response.data;
}





