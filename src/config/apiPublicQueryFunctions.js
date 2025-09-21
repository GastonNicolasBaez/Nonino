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