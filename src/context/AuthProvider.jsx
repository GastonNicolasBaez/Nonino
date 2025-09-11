/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */

import { useSession } from "@/context/SessionProvider";
import { Navigate } from "react-router";
import Loading from "@/components/common/Loading";

const AuthProvider = ({ children, allowedRole }) => {

    const session = useSession();

    // no tiene userData
    if (!session.userData) {
        return <Navigate to="/intranet/login" replace />;
    }

    // no esta autenticado
    if (!session.isAuthenticated) {
        return <Navigate to="/intranet/login" replace />;
    }

    // rol no permitido
    if (session.userData.roleName !== allowedRole) {
        return <Navigate to="/intranet/login" replace />;
    }

    return children;
};

export default AuthProvider