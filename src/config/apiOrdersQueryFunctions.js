import axios from "axios";
import { ENDPOINTS } from "@/config/apiEndpoints";

export const postAdminOrdersCreateOrderQueryFunction = async ({_order, _accessToken}) => {
    const axiosSetup = {
        axiosData: _order,
        axiosConfig: {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${_accessToken}`,
            }
        }
    }

    const response = await axios.post(`${ENDPOINTS.orders}///`, axiosSetup.axiosData, axiosSetup.axiosConfig);
    return await response.data;
}

export const getAdminOrdersGetOrdersQueryFunction = async (_accessToken) => {
    const axiosSetup = {
        axiosData: null,
        axiosConfig: {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${_accessToken}`,
            },
        }
    }

    const response = await axios.get(`${ENDPOINTS.orders}///`, axiosSetup.axiosConfig);
    return await response.data;
}
