import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import AuthService from './AuthService';
import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth_token';

type User = {
    token: string;
    id?: number;
    email?: string;
    is_active?: boolean;
    is_superuser?: boolean;
    is_verified?: boolean;
} | null

export const isAuthenticated = (): boolean => {
    return !!Cookies.get(TOKEN_KEY);
};

interface AuthContextType {
    user: User,
    isAuth: boolean,
    isLoading: boolean,
    login: (credentials: { username: string; password: string }, callback: VoidFunction ) => void;
    logout: (callback: VoidFunction) => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>(null);
    const [isAuth, setIsAuth] = useState<boolean>(isAuthenticated);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = Cookies.get(TOKEN_KEY)
                const userData = await AuthService.getUser(token!);
                setUser(userData!);
            } catch (error) {
                console.error('Ошибка при получении данных пользователя:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, []);

    const login = async (credentials: { username: string; password: string }, callback: VoidFunction) => {
        try {
            const userData = await AuthService.login(credentials);
            setUser(userData);
            callback();
        } catch (error) {
            console.error('Ошибка при получении данных пользователя:', error);
        }
    };

    const logout = async (callback: VoidFunction) => {
        try {
            await AuthService.logout();
            setUser(null);
            callback();
        } catch (error) {
            console.error('Ошибка при получении данных пользователя:', error);
        }
    };
    return (
        <AuthContext.Provider value={{ user, isAuth, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);