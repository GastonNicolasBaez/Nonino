import axios from "axios";

const url = 'https://nonino-catalog.fly.dev';

// get public catalog
export const getPublicDataQueryFunction = async (_idSucursal) => {
    const response = await axios.get(`${url}/public/catalog/stores/${_idSucursal}/menu`);
    return await response.data;
}