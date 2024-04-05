import { makeAutoObservable } from "mobx";
import http from "../api/http-client"
import auth from "../api/auth.service";
import { userStore } from "./UserStore";
import { toastStore } from "./ToastStore"; // Добавлен импорт toastStore

class SoundfileStore {
  orders: Soundfile[] = [];

  constructor() {
    makeAutoObservable(this);
    userStore.subscribeToUserChanges(() => this.fetchOrders());

    this.fetchOrders();
  }

  fetchOrders() {
    if (auth.getAuthUser() !== null)
      http.get('/api/sound-files')
        .then(response => this.setOrders(response.data))
        .catch(error => console.error('Ошибка при получении данных:', error));
  }

  async createOrderFromBlob(audioBlobUrl: string, key: string) {
    const response = await fetch(audioBlobUrl);
    const blob = await response.blob();

    const file = new File([blob], `audio-${key}.ogg`, { type: "audio/ogg" });

    const formData = new FormData();
    formData.append("file", file);

    http.post('/api/sound-files', formData, {
      headers: {
          'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => response.data)
    .then(() => {
        this.fetchOrders();
        console.log('Upload successful');
        toastStore.show('Файл добавлен', 'success'); // Показ сообщения при успешном добавлении данных
        // Handle successful upload here (e.g., show a success message)
    })
    .catch(error => {
        console.error('Error uploading file', error);
        toastStore.show('Ошибка при добавлении файла', 'danger'); // Показ сообщения при ошибке добавления данных
        // Handle upload error here (e.g., show an error message)
    });
    
  }

  createOrderFromFile(file: any) {
    const formData = new FormData();
    formData.append("file", file);

    http.post('/api/sound-files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },

    })
      .then(response => response.data)
      .then(() => {
        this.fetchOrders();
        toastStore.show('Файл добавлен', 'success'); // Показ сообщения при успешном добавлении данных
      })
      .catch(error => {
        console.error('Ошибка при добавлении:', error);
        toastStore.show('Ошибка при добавлении файла', 'danger'); // Показ сообщения при ошибке добавления данных
      });
  }
  updateOrder(id: number, updatedData: any) {
    http.put(`/api/sound-files/${id}`, updatedData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.data)
      .then(() => {
        this.fetchOrders();
        toastStore.show('Данные обновлены', 'success'); // Показ сообщения при успешном обновлении данных
      })
      .catch(error => {
        console.error('Ошибка при обновлении данных:', error);
        toastStore.show('Ошибка при обновлении данных', 'danger'); // Показ сообщения при ошибке обновления данных
      });
  }

  deleteOrder(id: number) {
    http.delete_(`/api/sound-files/${id}`)
      .then(() => {
        this.fetchOrders();
        toastStore.show('Данные удалены', 'success'); // Показ сообщения при успешном удалении данных
      })
      .catch(error => {
        console.error('Ошибка при удалении:', error);
        toastStore.show('Ошибка при удалении данных', 'danger'); // Показ сообщения при ошибке удаления данных
      });
  }

  getOrderById(id: number): Soundfile | undefined {
    return this.orders.find(order => order.id === id);
  }

  setOrders(data: any) {
    this.orders = data;
  }
}

export const soundfileStore = new SoundfileStore();