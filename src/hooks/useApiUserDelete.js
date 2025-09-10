import { useState, useCallback } from "react";
import axios from "axios";
import { ENDPOINTS } from "../config/api";

const useApiUserDelete = () => {

    const [userDeleteOk, setUserDeleteOk] = useState(null);
    const [userDeleteError, setUserDeleteError] = useState(null);
    const [userDeleteLoading, setUserDeleteLoading] = useState(false);
    const callUserDelete = useCallback(async (
        id,
        accessToken
    ) => {
        
        setUserDeleteOk(null);
        setUserDeleteError(null);
        setUserDeleteLoading(true);

        const axiosSetup = {
            axiosData : {
                // No data needed for DELETE user
            },
            axiosConfig : {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": accessToken,
                },
            }
        }

        try {

            const response = await axios.delete((ENDPOINTS.API_USERS + "/" + id), axiosSetup.axiosConfig);

            setUserDeleteOk(true);
            return { success: true, data: response.data };
        } catch (err) {
            setUserDeleteOk(false);
            setUserDeleteError(err);
            return { success: false, error: err };
        } finally {
            setUserDeleteLoading(false);
        }
    }, []);

    return { userDeleteOk, userDeleteError, userDeleteLoading, callUserDelete };
}

export default useApiUserDelete