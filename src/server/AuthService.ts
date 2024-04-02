import api from './api';
import Cookies from 'js-cookie';
import qs from 'qs';

const TOKEN_KEY = 'auth_token';

type User = {
    token: string;
    id?: number;
    email?: string;
    is_active?: boolean;
    is_superuser?: boolean;
    is_verified?: boolean;
} | null

var user: User = null;

const AuthService = {
    async login(credentials: { username: string; password: string }) {
        const response = await api.post('/auth/jwt/login', qs.stringify(credentials), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });
        // Store the token or user data in local storage or state
        const data = await response.data;
        if (data.access_token) {
            Cookies.set(TOKEN_KEY, data.access_token, { expires: 7 });
            this.getUser(data.access_token);
            user = { token: data.access_token };
        }
        return user;
    },

    async getUser(token: string) {
        try {
            const response = await api.get('/users/me', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.status >= 200 && response.status < 300) {
                const userData = await response.data;
                user = {
                    token: token,
                    id: userData.id,
                    email: userData.email,
                    is_active: userData.is_active,
                    is_superuser: userData.is_superuser,
                    is_verified: userData.is_verified,
                };
            }
            return user;
        } catch (error) {
            console.error('Ошибка при получении данных пользователя:', error);
        }
    },

    async logout() {
        try {
            const token = Cookies.get(TOKEN_KEY);
            
            if(token) {
                await api.post('/auth/jwt/logout', null, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                user = null;
                // Remove the token or user data from local storage or state
            }
            
        } catch (error) {
            console.error('Ошибка выхода', error);
        }

    },
};

export default AuthService;