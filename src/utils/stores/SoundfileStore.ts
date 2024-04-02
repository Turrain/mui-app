import { makeAutoObservable } from "mobx";
import http from "../api/http-client"


class SoundfileStore {
  orders: Soundfile[] = [];

  constructor() {
    makeAutoObservable(this);
    this.fetchOrders();
  }

  fetchOrders() {
    http.get('/api/sound-files')
      .then(response => this.setOrders(response.data))
      .catch(error => console.error('Ошибка при получении данных:', error));
  }
  createOrder(newData: any) {
    http.post('/api/companies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newData),
    })
      .then(response => response.data)
      .then(() => this.fetchOrders()) // Перезагрузка данных после добавления
      .catch(error => console.error('Ошибка при добавлении:', error));
  }
  updateOrder(id: number, updatedData: any) {
    http.post(`/api/sound-files/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    })
      .then(response => response.data)
      .then(() => this.fetchOrders()) // Перезагрузка данных после обновления
      .catch(error => console.error('Ошибка при обновлении данных:', error));
  }

  deleteOrder(id: number) {
    http.post(`/api/sound-files/${id}`, {
      method: 'DELETE',
    })
      .then(() => this.fetchOrders()) // Перезагрузка данных после удаления
      .catch(error => console.error('Ошибка при удалении:', error));
  }

  setOrders(data: any) {
    this.orders = data;
  }
}

export const soundfileStore = new SoundfileStore();