import { makeAutoObservable } from "mobx";
import http from "../api/http-client"
import auth from "../api/auth.service";
import { userStore } from "./UserStore";
class PhoneListStore {
    orders: PhonesList[] = [];

    constructor() {
        makeAutoObservable(this);
        userStore.subscribeToUserChanges(()=>this.fetchOrders());
        this.fetchOrders();
    
    }

    fetchOrders() {
        if(auth.getAuthUser() !== null)
        http.get('/api/phone-lists')
            .then(response => {this.setOrders(response.data); console.log(this.orders)})
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
        http.post(`/api/phone-lists/${id}`, {
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
        http.post(`/api/phone-lists/${id}`, {
            method: 'DELETE',
        })
            .then(() => this.fetchOrders()) // Перезагрузка данных после удаления
            .catch(error => console.error('Ошибка при удалении:', error));
    }


    setOrders(data: any) {
        this.orders = data;
    }
}

export const phoneListStore = new PhoneListStore();