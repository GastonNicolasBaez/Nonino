import { useState, useCallback } from "react";
import axios from "axios";
import { ENDPOINTS } from "../config/api.js";

const useApiUserNew = () => {

    const [userNewOk, setUserNewOk] = useState(null);
    const [userNewError, setUserNewError] = useState(null);
    const [userNewLoading, setUserNewLoading] = useState(false);

    const callUserNew = useCallback(async (
        formData,
        accessToken = null
    ) => {

        setUserNewOk(null);
        setUserNewError(null);
        setUserNewLoading(true);

        const axiosSetup = {
            axiosData: {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                roleId: formData.roleId,
            },
            axiosConfig: {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": accessToken,
                },
            }
        }

        try {

            const response = await axios.post((ENDPOINTS.API_USERS), axiosSetup.axiosData, axiosSetup.axiosConfig);

            setUserNewOk(true);
            return { success: true, data: response.data };
        } catch (err) {
            setUserNewOk(false);
            setUserNewError(err);
            return { success: false, error: err };
        } finally {
            setUserNewLoading(false);
        }
    }, []);

    return { userNewOk, userNewError, userNewLoading, callUserNew };
};

export default useApiUserNew;
