import { useState, useCallback } from "react";
import axios from "axios";
import { ENDPOINTS } from "../config/api";

const useApiRefreshToken = () => {

    const [refreshTokenOk, setRefreshTokenOk] = useState(null);
    const [refreshTokenError, setRefreshTokenError] = useState(null);
    const [refreshTokenLoading, setRefreshTokenLoading] = useState(false);

    const callRefreshToken = useCallback(async () => {

        setRefreshTokenOk(null);
        setRefreshTokenError(null);
        setRefreshTokenLoading(true);

        const axiosSetup = {
            axiosData: {
            },
            axiosConfig: {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true, // Ensure cookies are sent with the request
            }
        }

        try {

            const response = await axios.post((ENDPOINTS.API_LOGIN_REFRESH), null, axiosSetup.axiosConfig);

            setRefreshTokenOk(true);
            return { success: true, data: response.data };
        } catch (err) {
            setRefreshTokenOk(false);
            setRefreshTokenError(err);
            return { success: false, error: err };
        } finally {
            setRefreshTokenLoading(false);
        }
    }, []);

    return { refreshTokenOk, refreshTokenError, refreshTokenLoading, callRefreshToken };
};

export default useApiRefreshToken;
