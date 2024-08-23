import { create } from 'zustand';
import authService from '../api/auth.service';
import { useToastStore } from './ToastStore';

type UserState = {
    user: User | null;
    setUser: (user: User) => Promise<void>;
    fetchUser: () => Promise<void>;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isLoggedIn: () => boolean;
};

export const useUserStore = create<UserState>((set, get) => ({
    user: null,

    setUser: async (userData: User | null) => {
        if (userData && !userData.user_data) {
            userData.user_data = await authService.profile();
        }
        set({ user: userData });
    },

    fetchUser: async () => {
        try {
            const user = await authService.getAuthUser();
            await get().setUser(user);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    },


    login: async (username, password) => {
        const { show } = useToastStore.getState();
        try {
            const user = await authService.login({ username, password });
            await get().setUser(user);
        } catch (error) {
            console.error('Login error:', error);
            show('Неправильно введен логин или пароль', 'danger');
        }
    },

    logout: async () => {
        try {
            await authService.logout();
            set({ user: null });
        } catch (error) {
            console.error('Logout error:', error);
        }
    },

    isLoggedIn: () => !!get().user,
}));