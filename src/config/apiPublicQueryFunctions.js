import axios from "axios";
import { ENDPOINTS } from "@/config/apiEndpoints";

// get public catalog
export const getPublicCatalogQueryFunction = async (_idSucursal) => {
    const response = await axios.get(`${ENDPOINTS.catalog}/public/catalog/stores/${_idSucursal}/menu`);
    return await response.data;
}

export const getPublicStoresQueryFunction = async () => {
    const response = await axios.get(`${ENDPOINTS.stores}/public/stores`);
    return await response.data;
}

export const getPublicStoreStatusQueryFunction = async (_storeId) => {
    const response = await axios.get(`${ENDPOINTS.stores}/public/stores/${_storeId}/status`);
    return await response.data;
}

export const getPublicProductosQueryFunction = async () => {
    const response = await axios.get(`${ENDPOINTS.catalog}/public/catalog/products`);
    return await response.data;
}

export const getPublicCombosQueryFunction = async () => {
    const response = await axios.get(`${ENDPOINTS.catalog}/public/catalog/combos`);
    console.log('🔵 [API] Raw combos from backend:', response.data);
    return await response.data;
}

export const getPublicCompanyInfoQueryFunction = async () => {
    const response = await axios.get(`${ENDPOINTS.stores}/public/company`);
    return await response.data;
}

export const getPublicStoreBaseDelayQueryFunction = async (_storeId) => {
    const response = await axios.get(`${ENDPOINTS.stores}/public/stores/baseDelay/${_storeId}`);
    return await response.data;
}



export const postPublicOrdersCreateOrderQueryFunction = async (_order) => {
    const axiosSetup = {
        axiosData: _order,
        axiosConfig: {
            headers: {
                "Content-Type": "application/json",
            }
        }
    }

    const response = await axios.post(`${ENDPOINTS.orders}/public/orders`, axiosSetup.axiosData, axiosSetup.axiosConfig);
    return await response.data;
}

export const getAdminOrdersGetOrderByIdQueryFunction = async (_orderId) => {
    const axiosSetup = {
        axiosData: null,
        axiosConfig: {
            headers: {
                "Content-Type": "application/json",
            },
        }
    }

    const response = await axios.get(`${ENDPOINTS.orders}/public/orders/${_orderId}/public-status`, axiosSetup.axiosConfig);
    return await response.data;
}

export const postPublicOrdersCreatePreferenceQueryFunction = async ({_orderId, _proof}) => {
    const axiosSetup = {
        axiosData: {
            proof: _proof,
        },
        axiosConfig: {
            headers: {
                "Content-Type": "application/json",
            }
        }
    }

    const response = await axios.post(`${ENDPOINTS.orders}/internal/orders/${_orderId}/payment/preference`, axiosSetup.axiosData, axiosSetup.axiosConfig);
    return await response.data;
}

export const postPublicOrdersCreatePrintJobQueryFunction = async (_printJob) => {
    const axiosSetup = {
        axiosData: _printJob,
        axiosConfig: {
            headers: {
                "Content-Type": "application/json",
            }
        }
    }

    const response = await axios.post(`${ENDPOINTS.printer}/public/print-jobs`, axiosSetup.axiosData, axiosSetup.axiosConfig);
    return await response.data;
}

export const putPublicOrdersForcePrintJobQueryFunction = async (_printJobId) => {
    const axiosSetup = {
        axiosData: {
            status: 'PARA_IMPRIMIR'
        },
        axiosConfig: {
            headers: {
                "Content-Type": "application/json",
            }
        }
    }

    const response = await axios.put(`${ENDPOINTS.printer}/public/print-jobs/${_printJobId}`, axiosSetup.axiosData, axiosSetup.axiosConfig);
    return await response.data;
}

