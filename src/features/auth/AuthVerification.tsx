import useAuth from 'src/hooks/useAuth';
import { Outlet, Navigate } from 'react-router-dom';

const AuthVerification = () => {
    const isAuthenticated = useAuth();

    return (
        !isAuthenticated ?
            <Navigate to="/login" replace />
            :
            <Outlet />
    );
};

export default AuthVerification;