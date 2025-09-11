/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */

import { createContext, useState, useContext, useEffect } from "react";
//import { toast } from "react-toastify";

import useApiLoginUserData from "@/hooks/useApiLoginUserData";
import useApiRefreshToken from "@/hooks/useApiRefreshToken";


const SessionContext = createContext();

export const SessionProvider = ({ children }) => {

    const [accessToken, setAccessToken] = useState(() => {
        const storedAccessToken = localStorage.getItem("accessToken");
        return storedAccessToken ? storedAccessToken : null;
    });

    const [userData, setUserData] = useState(() => {
        const storedUserData = localStorage.getItem("userData");
        const parsed = storedUserData ? JSON.parse(storedUserData) : null;
        return parsed;
    });

    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const hasToken = localStorage.getItem("accessToken");
        return hasToken ? true : false;
    });

    useEffect(() => {
        if (userData)
            setIsAdmin(userData.role === 'ADMIN');
    }, [userData]);


    // useEffect(() => {
    //     const fetchUserData = async () => {

    //         setLoading(true);

    //         if (accessToken) {
    //             localStorage.setItem("accessToken", accessToken);

    //             const llamada = callLoginUserData;
    //             const doSuccess = (data) => {
    //                 setUserData(data);
    //             }
    //             const doFailure = (errmsg) => {
    //                 //toast.error("Falló la operación: " + errmsg);
    //             }
    //             const doBadToken = (errmsg) => {
    //                 //toast.error("Falla al refrescar token: " + errmsg);
    //                 logout();
    //             }

    //             // DISPARAR PRIMERA LLAMADA
    //             const result = await llamada(accessToken);
    //             if (result.success) {
    //                 // EXITO LLAMADA
    //                 doSuccess(result.data);
    //             } else if (result.error.status === 401) {
    //                 const response = await callRefreshToken();
    //                 if (response.success) {
    //                     await setAccessToken(response.data.accessToken);
    //                 } else {
    //                     // MSG ERROR TOKEN
    //                     doBadToken(result.error.message);
    //                 }
    //             } else {
    //                 // MSG ERROR GENERAL
    //                 doFailure(result.error.message);
    //             }
    //         } else {
    //             localStorage.removeItem("accessToken");
    //             setUserData(null);
    //         }
    //         setLoading(false);
    //     };
    //     fetchUserData();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [accessToken]);

    const login = (data) => {
        const userInfo = {
            id: data.id,
            name: data.username,
            email: data.email,
            role: data.role
        };
        
        // Guardar en localStorage primero
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("userData", JSON.stringify(userInfo));
        
        // Luego actualizar estado
        setAccessToken(data.accessToken);
        setUserData(userInfo);
        setIsAuthenticated(true);
    }

    const logout = () => {
        setAccessToken(null);
        setUserData(null);
        setIsAuthenticated(false);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userData");
    }

    
    return (
        <SessionContext.Provider value={{
            accessToken,
            setAccessToken,
            userData,
            setUserData,
            isAuthenticated,
            isAdmin,
            login,
            logout,
        }}
        >
            {children}
        </SessionContext.Provider>
    );
}

export const useSession = () => {
    return useContext(SessionContext);
}