import axios from "axios";
import { ENDPOINTS } from "@/config/apiEndpoints";

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

    const response = await axios.post(`${ENDPOINTS.auth}/auth/login`, axiosSetup.axiosData, axiosSetup.axiosConfig);
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

    const response = await axios.post(`${ENDPOINTS.auth}/auth/refresh`, axiosSetup.axiosData, axiosSetup.axiosConfig);
    return await response.data;
}