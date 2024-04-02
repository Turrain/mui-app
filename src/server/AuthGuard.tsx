import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuth } from './UseAuth';

export const AuthGuard = ({ children }: { children: ReactNode }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};