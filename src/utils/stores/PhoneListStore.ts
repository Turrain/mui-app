import { makeAutoObservable } from "mobx";
import http from "../api/http-client"
import auth from "../api/auth.service";
import { userStore } from "./UserStore";
import { toastStore } from "./ToastStore";

class PhoneListStore {
    orders: PhonesList[] = [];

    constructor() {
        makeAutoObservable(this);
        userStore.subscribeToUserChanges(() => this.fetchOrders());
        this.fetchOrders();
    
    }

    fetchOrders() {
        if(auth.getAuthUser() !== null)
        http.get('/api/phone-lists')
            .then(response => {
                this.setOrders(response.data); 
                console.log(this.orders);
            })
            .catch(error => console.error('Ошибка при получении данных:', error));
    }
    
    createOrder(newData: any) {
        http.post('/api/phone-lists', newData, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.data)
            .then(() => {
                this.fetchOrders() 
                toastStore.show('Запись добавлена', 'success');
            })// Перезагрузка данных после добавления
            .catch(error => {
                console.error('Ошибка при добавлении:', error)
                toastStore.show('Ошибка при добавлении', 'danger');
            });
    }

    updateOrder(id: number, updatedData: any) {
        http.put(`/api/phone-lists/${id}`, updatedData, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.data)
            .then(() => {
                this.fetchOrders();
                toastStore.show('Запись обновлена', 'success');
            }) // Перезагрузка данных после обновления
            .catch(error => {
                console.error('Ошибка при обновлении данных:', error);
                toastStore.show('Ошибка при обновлении данных', 'danger');
            });
    }

    deleteOrder(id: number) {
        http.delete_(`/api/phone-lists/${id}`)
            .then(() => {
                this.fetchOrders();
                toastStore.show('Запись удалена', 'success');
            }) // Перезагрузка данных после удаления
            .catch(error => {
                console.error('Ошибка при удалении:', error);
                toastStore.show('Ошибка при удалении', 'danger');
            });
    }

    getOrderById(id: number): PhonesList | undefined {
        return this.orders.find(order => order.id === id);
    }

    setOrders(data: any) {
        this.orders = data;
    }
}

export const phoneListStore = new PhoneListStore();