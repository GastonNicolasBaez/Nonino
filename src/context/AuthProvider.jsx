import { useSession } from "@/context/SessionProvider";
import { Navigate } from "react-router";
import Loading from "@/components/common/Loading";

const AuthProvider = ({ children, allowedRole }) => {

    // const session = useSession();

    // // Show loading if we have a token but userData is not loaded yet
    // if (session.accessToken && session.userData === null) {
    //     return <Loading />; // or a spinner component
    // }

    // // If no token, redirect to login
    // if (!session.accessToken) {
    //     return <Navigate to="/intranet/login" replace />;
    // }

    // // If userData is loaded, check role
    // const userOk = session.userData && allowedRole && session.userData.role === allowedRole;
    // if (!userOk) {
    //     return <Navigate to="/intranet/login" replace />;
    // }

    return children;
};

export default AuthProvider