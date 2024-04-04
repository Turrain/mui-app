import { makeAutoObservable } from "mobx";
import http from "../api/http-client"
import auth from "../api/auth.service";
import { userStore } from "./UserStore";


//TODO: Fix all stores
class CompanyStore {
    orders: Company[] = [];
    current_page = 0; //TODO: pagination
    constructor() {
        makeAutoObservable(this);
        userStore.subscribeToUserChanges(() => this.fetchOrders());

        this.fetchOrders();
    }

    fetchOrders() {
        if (auth.getAuthUser() !== null)
            http.get('/api/companies')
                .then(response => { this.setOrders(response.data) })
                .catch(error => console.error('Ошибка при получении данных:', error));
    }

    createOrder(newData: any) {
        console.log(newData)
        http.post('/api/companies', newData, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.data)
            .then(() => this.fetchOrders()) // Перезагрузка данных после добавления
            .catch(error => console.error('Ошибка при добавлении:', error));
    }

    getOrderById(id: number): Company | undefined {
        return this.orders.find(order => order.id === id);
    }

    updateOrder(id: number, updatedData: any) {
        http.put(`/api/companies/${id}`, updatedData, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.data)
            .then(() => this.fetchOrders()) // Перезагрузка данных после обновления
            .catch(error => console.error('Ошибка при обновлении данных:', error));
    }

    deleteOrder(id: number) {
        http.delete_(`/api/companies/${id}`)
            .then(() => this.fetchOrders()) // Перезагрузка данных после удаления
            .catch(error => console.error('Ошибка при удалении:', error));
    }

    setOrders(data: any) {
        this.orders = data;
    }
}

export const companyStore = new CompanyStore();