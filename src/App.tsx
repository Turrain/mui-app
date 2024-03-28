
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import DashboardPage from './components/pages/DashboardPage';
import SignInPage from './components/pages/SignInPage';
import React from 'react';
import Cookies from 'js-cookie';


const TOKEN_KEY = 'auth_token';

export const saveAuthToken = (token: string, expires: number = 7) => {
  Cookies.set(TOKEN_KEY, token, { expires });
};

export const getAuthToken = (): string | undefined => {
  return Cookies.get(TOKEN_KEY);
};

export const removeAuthToken = () => {
  Cookies.remove(TOKEN_KEY);
};

export const isAuthenticated = (): boolean => {
  return !!Cookies.get(TOKEN_KEY);
};


type User = {
  token: string;
  id?: number;
  email?: string;
  is_active?: boolean;
  is_superuser?: boolean;
  is_verified?: boolean;
} | null

type UserLogin = {
  username: string;
  password: string;
}

interface AuthContextType {
  user: User;
  isAuth: boolean;
  isLoading: boolean; // Добавляем новое состояние для отслеживания загрузки
  signin: (user: UserLogin, callback: VoidFunction) => void;
  signout: (callback: VoidFunction) => void;
}
let AuthContext = React.createContext<AuthContextType>(null!);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<User>(null);
  const [isAuth, setIsAuth] = React.useState<boolean>(isAuthenticated)
  const [isLoading, setIsLoading] = React.useState<boolean>(true); // Инициализируем состояние загрузки

  React.useEffect(() => {
    const token = getAuthToken();
    setIsLoading(true); // Начинаем загрузку
    if (token && token.length > 0) {
      setUser({ token }); 
      fetchUserData(token).finally(() => setIsLoading(false)); // Завершаем загрузку после получения данных
    } else {
      setIsLoading(false); // Если токена нет, загрузка также завершается
    }
  }, []);

  const fetchUserData = async (token: string) => {
    setIsLoading(true); 
    try {
      const response = await fetch('http://127.0.0.1:8000/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Ошибка получения данных пользователя');
      }
      const userData = await response.json();
      setUser({
        token: token,
        id: userData.id,
        email: userData.email,
        is_active: userData.is_active,
        is_superuser: userData.is_superuser,
        is_verified: userData.is_verified,
      });
      
    } catch (error) {
      console.error('Ошибка при получении данных пользователя:', error);
    } finally{
      setIsLoading(false);
    }
  };
  const signin = async (userLogin: UserLogin, callback: VoidFunction) => {
    console.log( JSON.stringify(userLogin))
    try {
      const formData = new URLSearchParams();
      formData.append('username', userLogin.username);
      formData.append('password', userLogin.password);
      const response = await fetch('http://127.0.0.1:8000/auth/jwt/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });
      const data = await response.json();
      if (data.access_token) {
        saveAuthToken(data.access_token);
        fetchUserData(data.access_token);
        setUser({ ...user, token: data.access_token }); 
        callback();
      }
    } catch (error) {
      console.error('Ошибка входа', error);
    }
  };
  const signout = async (callback: VoidFunction) => {
    try {
      const token = getAuthToken();
      if (token) {
        await fetch('http://127.0.0.1:8000/auth/jwt/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        removeAuthToken();
        setUser(null);
        callback();
      }
    } catch (error) {
      console.error('Ошибка выхода', error);
    }
  };

  const register = async (userData: { email: string; password: string; is_active: boolean; is_superuser: boolean; is_verified: boolean; }) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Регистрация успешна', data);
      }
    } catch (error) {
      console.error('Ошибка регистрации', error);
    }
  };

  const value = { user, signin, signout, isAuth, isLoading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};



function RequireAuth({ children }: { children: JSX.Element }) {
  let auth = useAuth();
  let location = useLocation();

  if (auth.isLoading) {
    return <div>Загрузка...</div>; // Индикатор загрузки
  }

  if (!auth.isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export const useAuth = () => React.useContext(AuthContext);
 

export default function App() {
  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/"  element={
                <RequireAuth>
                  <DashboardPage />
                </RequireAuth>
              }/>
            <Route path="/login" element={<SignInPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </CssVarsProvider>
  );
}