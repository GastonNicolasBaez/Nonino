import axios from "axios";

const API_BASEURL = "";
const API_AUTHURL = "";
const API_CATALOGURL = "https://nonino-catalog.fly.dev";
const API_INVENTORYURL = "";
const API_STOREURL = "";
const API_ORDERURL = "";

const apiCatalog = axios.create({
    baseURL: 'https://nonino-catalog.fly.dev',
    // headers and interceptors
});

export const catalogFetchAll = async (storeId) => {
    const response = await apiCatalog.get(`/public/catalog/stores/${storeId}/menu`);
    return response.data;
};