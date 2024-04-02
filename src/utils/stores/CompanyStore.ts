import { makeAutoObservable } from "mobx";
import http from "../api/http-client"
//TODO: Fix all stores
class CompanyStore {
    orders: Company[]  = [];
    current_page = 0; //TODO: pagination
    constructor() {
        makeAutoObservable(this);
        this.fetchOrders();
    }

    fetchOrders() {
        http.get('/api/companies')
            .then(response => {this.setOrders(response.data)})
            .catch(error => console.error('Ошибка при получении данных:', error));
    }

    createOrder(newData: any) {
        console.log(newData)
        http.post('/api/companies',newData,  {
            headers: {
                'Content-Type': 'application/json',
            },
    
        })
            .then(response => response.data)
            .then(() => this.fetchOrders()) // Перезагрузка данных после добавления
            .catch(error => console.error('Ошибка при добавлении:', error));
    }

    updateOrder(id: number, updatedData: any) {
        http.post(`/api/companies/${id}`,updatedData, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.data)
            .then(() => this.fetchOrders()) // Перезагрузка данных после обновления
            .catch(error => console.error('Ошибка при обновлении данных:', error));
    }

    deleteOrder(id: number) {
        http.post(`/api/companies/${id}`, {
            method: 'DELETE',
        })
            .then(() => this.fetchOrders()) // Перезагрузка данных после удаления
            .catch(error => console.error('Ошибка при удалении:', error));
    }

    setOrders(data: any) {
        this.orders = data;
    }
}

export const companyStore = new CompanyStore();