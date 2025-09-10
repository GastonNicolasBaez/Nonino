import { useState, useCallback } from "react";
import axios from "axios";
import { ENDPOINTS } from "../config/api";

const useApiUserGetAll = () => {

    const [userGetAllOk, setUserGetAllOk] = useState(null);
    const [userGetAllError, setUserGetAllError] = useState(null);
    const [userGetAllLoading, setUserGetAllLoading] = useState(false);

    const callUserGetAll = useCallback(async (
        accessToken
    ) => {

        setUserGetAllOk(null);
        setUserGetAllError(null);
        setUserGetAllLoading(true);

        const axiosSetup = {
            axiosData: {},
            axiosConfig: {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": accessToken,
                },
                withCredentials: true,
            }
        }

        try {
            const response = await axios.get((ENDPOINTS.API_USERS), axiosSetup.axiosConfig);
            
            setUserGetAllOk(true);
            return { success: true, data: response.data };
        } catch (err) {
            setUserGetAllOk(false);
            setUserGetAllError(err);
            return { success: false, error: err };
        } finally {
            setUserGetAllLoading(false);
        }
    }, []);

    return { userGetAllOk, userGetAllError, userGetAllLoading, callUserGetAll };
};

export default useApiUserGetAll;
