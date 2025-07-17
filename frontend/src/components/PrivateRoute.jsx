import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ user, allowedRoles }) => {
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />; // Or to an unauthorized page
    }

    return <Outlet />;
};

export default PrivateRoute;