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
    return await response.data;
}

export const getPublicCompanyInfoQueryFunction = async () => {
    const response = await axios.get(`${ENDPOINTS.stores}/public/company`);
    return await response.data;
}