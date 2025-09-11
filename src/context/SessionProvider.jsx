/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */

import { createContext, useState, useContext, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import {
    getLoginQueryFunction,
    getRefreshQueryFunction
} from "@/config/apiQueryFunctions";
//import { toast } from "react-toastify";


const SessionContext = createContext();

const mockUser = {
    accessToken: 'accessT',
    id: 0,
    name: 'Admin',
    role: 'ADMIN',
    email: 'admin@noninoempanadas.com'
}

export const SessionProvider = ({ children }) => {

    const [userData, setUserData] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

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
            }
            localStorage.setItem('noninoSys', true);
            setUserData(user);
            setIsAdmin(data.roles[0].name === 'ADMIN');
            setIsAuthenticated(true);
        }
    });

    const { mutate: callRelogin, isPending: callReloginLoading } = useMutation({
        mutationKey: ['relogin'],
        mutationFn: getRefreshQueryFunction,
        onSuccess: (data) => {
            setUserData(mockUser);
            setIsAdmin(data.role ? data.role === 'ADMIN' : true);
            setIsAuthenticated(true);
        },
        onError: () => {
            localStorage.removeItem("noninoSys");
        }
    })

    useEffect(() => {
        if (localStorage.getItem('noninoSys')) {
            callRelogin();
        }
    }, []);

    const login = (_email, _password) => {
        callLogin({ _email, _password });
    }

    const logout = () => {
        setUserData(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
        localStorage.removeItem("noninoSys");
    }

    const loading = callLoginLoading || callReloginLoading;

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