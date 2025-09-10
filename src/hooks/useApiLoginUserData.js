import { useState, useCallback } from "react";
import axios from "axios";
import { ENDPOINTS } from "../config/api";

const useApiLoginUserData = () => {

    const [loginUserDataOk, setLoginUserDataOk] = useState(null);
    const [loginUserDataError, setLoginUserDataError] = useState(null);
    const [loginUserDataLoading, setLoginUserDataLoading] = useState(false);

    const callLoginUserData = useCallback(async (
        accessToken
    ) => {

        setLoginUserDataOk(null);
        setLoginUserDataError(null);
        setLoginUserDataLoading(true);

        const axiosSetup = {
            axiosData: {
            },
            axiosConfig: {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": accessToken,
                },
                withCredentials: true,
            }
        }

        try {

            const response = await axios.get(ENDPOINTS.API_LOGIN_USERDATA, axiosSetup.axiosConfig);

            setLoginUserDataOk(true);
            return { success: true, data: response.data };
        } catch (err) {
            setLoginUserDataOk(false);
            setLoginUserDataError(err);
            return { success: false, error: err };
        } finally {
            setLoginUserDataLoading(false);
        }
    }, []);

    return { loginUserDataOk, loginUserDataError, loginUserDataLoading, callLoginUserData };
};

export default useApiLoginUserData;