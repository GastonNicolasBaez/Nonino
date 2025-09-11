/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */

import { createContext, useState, useContext, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { getLoginQueryFunction } from "@/config/apiQueryFunctions";
//import { toast } from "react-toastify";


const SessionContext = createContext();

export const SessionProvider = ({ children }) => {

    const [accessToken, setAccessToken] = useState(() => {
        const storedAccessToken = localStorage.getItem("accessToken");
        return storedAccessToken ? storedAccessToken : null;
    });

    const [userData, setUserData] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const { mutate, isPending: loading } = useMutation({
        mutationKey: ['login'],
        mutationFn: getLoginQueryFunction,
        onSuccess: (data) => {
            setUserData(data);
            setIsAdmin(data.role ? data.role === 'ADMIN' : true);
            setIsAuthenticated(true);
            setAccessToken(data.accessToken);
        }
    });

    // guardar en localstorage cada cambio de accesstoken
    useEffect(() => {
        if (accessToken) {
            localStorage.setItem("accessToken", accessToken);
        }
    }, [accessToken]);

    const login = (_email, _password) => {
        mutate({ _email, _password });
    }

    const logout = () => {
        setAccessToken(null);
        setUserData(null);
        setIsAuthenticated(false);
        localStorage.removeItem("accessToken");
    }



    return (
        <SessionContext.Provider value={{
            accessToken,
            setAccessToken,
            userData,
            setUserData,
            isAuthenticated,
            isAdmin,
            loading,
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