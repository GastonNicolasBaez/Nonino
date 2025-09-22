/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */

import { useSession } from "@/context/SessionProvider";
import { Navigate } from "react-router";

const AuthProvider = ({ children, allowedRole }) => {
    const session = useSession();


    // Show loading while session is being restored
    if (session.loading) {
        return (
            <div style={{ backgroundColor: '#111827' }} className="flex items-center justify-center h-full w-full">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-empanada-golden border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <div className="absolute inset-0 w-16 h-16 border-4 border-empanada-golden/20 rounded-full mx-auto"></div>
                    </div>
                    <p className="text-xl font-medium text-white/80">Ingresando al sistema...</p>
                </div>
            </div>
        );
    }

    // After loading, check authentication
    if (!session.userData || !session.isAuthenticated) {
        return <Navigate to="/intranet/login" replace />;
    }

    // If allowedRole is set, check role
    if (allowedRole && session.userData.role !== allowedRole) {
        return <Navigate to="/intranet/login" replace />;
    }

    return children;
};

export default AuthProvider;