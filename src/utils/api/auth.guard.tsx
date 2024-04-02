import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import authService from './auth.service';

const AuthGuard = () => {
    const authUser = authService.getAuthUser();
    return authUser ? <Outlet/> : <Navigate to={'/login'} replace />
}

export default AuthGuard