import { Navigate, Outlet } from "react-router-dom";
import { useAppContext } from '../Hooks/AppContext';


export function ProtectedRoute() {
    const { isLoggedIn } = useAppContext();

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />;
};