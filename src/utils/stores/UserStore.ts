import { makeAutoObservable } from "mobx";
import authService from "../api/auth.service";

class UserStore {
  user: User | null = null;
  subscribers: Function[] = [];

  subscribeToUserChanges(callback: Function) {
    this.subscribers.push(callback);
  }

  notifySubscribers() {
    console.log("dsdsadsdasdas")
    this.subscribers.forEach(callback => callback());
  }

  setUser(userData: User | null) {
    this.user = userData;

  }

  constructor() {
    makeAutoObservable(this);
    this.fetchUser();
  }

  async fetchUser() {
    try {
      const user = await authService.getAuthUser();
      this.setUser(user);
    } catch (error) {
      console.error('Ошибка при получении данных пользователя:', error);
    }
  }


  async login(username:string, password:string) {
    try {
      const user = await authService.login({username, password});
      console.log(user)
      this.setUser(user);
      this.notifySubscribers(); 
    } catch (error) {
      console.error('Ошибка входа:', error);
    }
  }

  async logout() {
    try {
      await authService.logout();
      this.setUser(null);
    } catch (error) {
      console.error('Ошибка выхода:', error);
    }
  }

  get isLoggedIn() {
    return !!this.user;
  }
}

export const userStore = new UserStore();
