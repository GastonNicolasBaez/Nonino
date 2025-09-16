/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */

import { createContext, useState, useContext, useLayoutEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import {
    getLoginQueryFunction,
    getRefreshQueryFunction
} from "@/config/apiQueryFunctions";
//import { toast } from "react-toastify";


const SessionContext = createContext();

export const SessionProvider = ({ children }) => {

    const [userData, setUserData] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [componentLoading, setComponentLoading] = useState(true);

    const { mutate: callLogin, isPending: callLoginLoading } = useMutation({
        mutationKey: ['login'],
        mutationFn: getLoginQueryFunction,
        onSuccess: (data) => {
            const user = {
                id: data.id,
                email: data.email,
                name: data.fullName,
                roleId: data.roles[0].id,
                roleName: data.roles[0].name,
                accessToken: data.accessToken,
                csrfToken: data.csrfToken,
            }
            setUserData(user);
            setIsAdmin(data.roles[0].name === 'ADMIN');
            setIsAuthenticated(true);
            localStorage.setItem('noninoSysCsrf', data.csrfToken);
        }
    });

    const { mutate: callRelogin, isPending: callReloginLoading } = useMutation({
        mutationKey: ['relogin'],
        mutationFn: getRefreshQueryFunction,
        onSuccess: (data) => {
            const user = {
                id: data.id,
                email: data.email,
                name: data.fullName,
                roleId: data.roles[0].id,
                roleName: data.roles[0].name,
                accessToken: data.accessToken,
                csrfToken: data.csrfToken,
            }
            setUserData(user);
            setIsAdmin(data.roles[0].name === 'ADMIN');
            setIsAuthenticated(true);
            localStorage.setItem('noninoSysCsrf', data.csrfToken);
        },
        onError: () => {
            localStorage.removeItem('noninoSysCsrf');
        }
    });

    useLayoutEffect(() => {
        const csrf = localStorage.getItem('noninoSysCsrf');
        if (csrf) {
            callRelogin(csrf);
        }
        setComponentLoading(false);
    }, []);

    const login = (_credentials) => {
        callLogin(_credentials);
    };

    const logout = () => {
        setUserData(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
        localStorage.removeItem("noninoSys");
    };

    const loading = componentLoading || callLoginLoading || callReloginLoading;

    return (
        <SessionContext.Provider value={{
            userData,
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