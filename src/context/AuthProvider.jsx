/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */

import { useSession } from "@/context/SessionProvider";
import { Navigate } from "react-router";
import Loading from "@/components/common/Loading";

const AuthProvider = ({ children, allowedRole }) => {
    const session = useSession();

    console.log(session);

    // Show loading while session is being restored
    if (session.loading) {
        return <div style={{backgroundColor: '#09090B', height: '100vh'}}></div>;
    }

    // After loading, check authentication
    if (!session.userData || !session.isAuthenticated) {
        return <Navigate to="/intranet/login" replace />;
    }

    // If allowedRole is set, check role
    if (allowedRole && session.userData.roleName !== allowedRole) {
        return <Navigate to="/intranet/login" replace />;
    }

    return children;
};

export default AuthProvider;