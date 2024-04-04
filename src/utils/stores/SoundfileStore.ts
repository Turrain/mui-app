import { makeAutoObservable } from "mobx";
import http from "../api/http-client"
import auth from "../api/auth.service";
import { userStore } from "./UserStore";

class SoundfileStore {
  orders: Soundfile[] = [];

  constructor() {
    makeAutoObservable(this);
    userStore.subscribeToUserChanges(()=>this.fetchOrders());
   
    this.fetchOrders();
  }

  fetchOrders() {
    if(auth.getAuthUser() !== null)
    http.get('/api/sound-files')
      .then(response => this.setOrders(response.data))
      .catch(error => console.error('Ошибка при получении данных:', error));
  }
  createOrder(newData: any) {
    http.post('/api/sound-files', newData, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
 
    })
      .then(response => response.data)
      .then(() => this.fetchOrders()) // Перезагрузка данных после добавления
      .catch(error => console.error('Ошибка при добавлении:', error));
  }
  updateOrder(id: number, updatedData: any) {
    http.put(`/api/sound-files/${id}`,updatedData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.data)
      .then(() => this.fetchOrders()) // Перезагрузка данных после обновления
      .catch(error => console.error('Ошибка при обновлении данных:', error));
  }

  deleteOrder(id: number) {
    http.delete_(`/api/sound-files/${id}`)
      .then(() => this.fetchOrders()) // Перезагрузка данных после удаления
      .catch(error => console.error('Ошибка при удалении:', error));
  }

  getOrderById(id: number): Soundfile | undefined {
    return this.orders.find(order => order.id === id);
  }

  setOrders(data: any) {
    this.orders = data;
  }
}

export const soundfileStore = new SoundfileStore();