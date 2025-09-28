/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */

import { createContext, useState, useContext, useLayoutEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import {
    getLoginQueryFunction,
    getRefreshQueryFunction
} from "@/config/apiLoginQueryFunctions";

const csrfLocalStorageKeyName = 'noninoSysCsrf';

// integrar dependencia con el rol

const userPrivilegesByEmail = {
    'admin@nonino': { role: 'ADMIN', sucursal: '' },
    'fabrica@nonino': { role: 'FABRICA', sucursal: 10 },
    'local1@nonino': { role: 'LOCAL', sucursal: 1 },
    'local2@nonino': { role: 'LOCAL', sucursal: 1 },
}

const SessionContext = createContext();

const userDataTransform = (data) => {
    const userPrivileges = userPrivilegesByEmail[data.email];
    const user = {
        id: data.id,
        email: data.email,
        name: data.fullName,
        role: userPrivileges.role,
        accessToken: data.accessToken,
        csrfToken: data.csrfToken,
        sucursal: userPrivileges.sucursal,
        isAdmin: userPrivileges.role == 'ADMIN',
        isLocal: userPrivileges.role == 'LOCAL',
        isFabrica: userPrivileges.role == 'FABRICA',
        isUser: userPrivileges.role == 'USER'
    }
    return user;
}

export const SessionProvider = ({ children }) => {

    const [userData, setUserData] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [componentLoading, setComponentLoading] = useState(true);

    const { mutate: callLogin, isPending: callLoginLoading } = useMutation({
        mutationKey: ['login'],
        mutationFn: getLoginQueryFunction,
        onSuccess: (data) => {
            setUserData(userDataTransform(data));
            setIsAuthenticated(true);
            localStorage.setItem(csrfLocalStorageKeyName, data.csrfToken);
        }
    });

    const { mutate: callRelogin, isPending: callReloginLoading } = useMutation({
        mutationKey: ['relogin'],
        mutationFn: getRefreshQueryFunction,
        onSuccess: (data) => {
            setUserData(userDataTransform(data));
            setIsAuthenticated(true);
            localStorage.setItem(csrfLocalStorageKeyName, data.csrfToken);
        },
        onError: () => {
            localStorage.removeItem(csrfLocalStorageKeyName);
        }
    });

    useLayoutEffect(() => {
        const csrf = localStorage.getItem(csrfLocalStorageKeyName);
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
        localStorage.removeItem(csrfLocalStorageKeyName);
    };

    const loading = componentLoading || callLoginLoading || callReloginLoading;

    return (
        <SessionContext.Provider value={{
            userData,
            isAuthenticated,
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