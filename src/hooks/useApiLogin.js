import { useState } from "react";
import axios from "axios";
import { ENDPOINTS } from "../config/api";

const useApiLogin = () => {

    const [loginOk, setLoginOk] = useState(null);
    const [loginError, setLoginError] = useState(null);
    const [loginLoading, setLoginLoading] = useState(false);

    const callLogin = async ({ email, password }) => {

        setLoginOk(null);
        setLoginError(null);
        setLoginLoading(true);

        const axiosSetup = {
            axiosData: {
                email,
                password
            },
            axiosConfig: {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            }
        }

        try {

            const response = await axios.post(ENDPOINTS.API_LOGIN, axiosSetup.axiosData, axiosSetup.axiosConfig);

            setLoginOk(true);
            return { success: true, data: response.data };
        } catch (err) {
            setLoginOk(false);
            setLoginError(err);
            return { success: false, error: err };
        } finally {
            setLoginLoading(false);
        }
    };

    return { loginOk, loginError, loginLoading, callLogin };
};

export default useApiLogin;