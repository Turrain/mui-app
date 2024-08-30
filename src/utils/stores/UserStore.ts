// import { makeAutoObservable } from "mobx";
// import authService from "../api/auth.service";
// import { toastStore } from "./ToastStore";

// class UserStore {
//   user: User | null = null;
//   subscribers: (() => void)[] = [];

//   subscribeToUserChanges(callback: () => void) {
//     this.subscribers.push(callback);
//   }

//   notifySubscribers() {
//     this.subscribers.forEach(callback => callback());
//   }

//   async setUser(userData: User | null) {

//     this.user = userData;
//     console.log("user", this.user)
//     if (this.user !== null && this.user?.user_data == undefined) {
//       this.user.user_data = await authService.profile()
//       console.log("user", this.user.user_data)
//     }
//   }

//   constructor() {
//     makeAutoObservable(this);
//     this.fetchUser();
//   }

//   async fetchUser() {
//     try {
//       const user = await authService.getAuthUser();
//       this.setUser(user);
//     } catch (error) {
//       console.error('Ошибка при получении данных пользователя:', error);
//     }
//   }


//   async login(username: string, password: string) {
//     try {
//       const user = await authService.login({ username, password });
//       console.log(user)
//       this.setUser(user);
//       this.notifySubscribers();
//     } catch (error) {
//       console.error('Ошибка входа:', error);
//       toastStore.show('Неправильно введен логин или пароль', 'danger');
//     }
//   }

//   async logout() {
//     try {
//       await authService.logout();
//       this.setUser(null);
//     } catch (error) {
//       console.error('Ошибка выхода:', error);
//     }
//   }

//   get isLoggedIn() {
//     return !!this.user;
//   }
// }

// export const userStore = new UserStore();

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

useUserStore.subscribe(
    (state) => state.user
)