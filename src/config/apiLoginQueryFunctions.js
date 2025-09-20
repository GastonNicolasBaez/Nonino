import axios from "axios";

const url = 'https://nonino-auth.fly.dev';

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

    const response = await axios.post(`${url}/auth/login`, axiosSetup.axiosData, axiosSetup.axiosConfig);
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

    const response = await axios.post(`${url}/auth/refresh`, axiosSetup.axiosData, axiosSetup.axiosConfig);
    return await response.data;
}