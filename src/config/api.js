import axios from "axios";
import { queryOptions } from "@tanstack/react-query";

const API_LOGIN = `https://nonino-auth.fly.dev/auth/login`;
const API_REFRESH = `https://nonino-auth.fly.dev/auth/refresh`;
const API_CATALOGURL = `https://nonino-catalog.fly.dev/public/catalog/stores/1/menu`;
const API_INVENTORYURL = "";
const API_STOREURL = "";
const API_ORDERURL = "";

export const ENDPOINTS = '';

export function getPublicDataQuery(_idSucursal) {
    return queryOptions({
        queryKey: ['publicData', _idSucursal],
        queryFn: () => getPublicData(_idSucursal),
    })
}

const getPublicData = async (_idSucursal) => {
    const response = await axios.get(`https://nonino-catalog.fly.dev/public/catalog/stores/${_idSucursal}/menu`);
    return await response.data;
}

export function getLoginQuery(_email, _password) {
    return queryOptions({
        queryKey: ['login', _email, _password],
        queryFn: () => getLogin(_email, _password),
        enabled: false
    })
}

const getLogin = async (_email, _password) => {
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
        
    const response = await axios.post(API_LOGIN, axiosSetup.axiosData, axiosSetup.axiosConfig);
    return await response.data;
}