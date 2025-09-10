import { useState, useCallback } from "react";
import axios from "axios";
import { ENDPOINTS } from "../config/api";

const useApiHealthCheck = () => {

    const [healthOk, setHealthOk] = useState(null);
    const [healthError, setHealthError] = useState(null);
    const [healthLoading, setHealthLoading] = useState(false);

    const callHealthCheck = useCallback(async () => {      

        setHealthOk(null);
        setHealthError(null);
        setHealthLoading(true);

        try {

            const response = await axios.get(ENDPOINTS.API_HEALTHCHECK);
            
            const healthy = response.data === "pong";
            setHealthOk(healthy);

            if (healthy) {
                return { success: true, data: response.data };
            } else {
                const err = new Error("API is not healthy");
                setHealthError(err);
                return { success: false, error: err };
            }

        } catch (err) {
            setHealthOk(false);
            setHealthError(err);
            return { success: false, error: err };
        } finally {
            setHealthLoading(false);
        }
    }, []);

    return { healthOk, healthError, healthLoading, callHealthCheck };
};

export default useApiHealthCheck;