// import { makeAutoObservable } from "mobx";
// import http from "../api/http-client"
// import auth from "../api/auth.service";
// import { userStore } from "./UserStore";
// import { toastStore } from "./ToastStore";

// //TODO: Fix all stores
// class CompanyStore {
//     orders: Company[] = [];
//     current_page = 0; //TODO: pagination
//     constructor() {
//         makeAutoObservable(this);
//         userStore.subscribeToUserChanges(() => this.fetchOrders());

//         this.fetchOrders();
//     }

//     fetchOrders() {
//         if (auth.getAuthUser() !== null)
//             http.get('/api/companies')
//                 .then(response => { this.setOrders(response.data) })
//                 .catch(error => console.error('Ошибка при получении данных:', error));
//     }

//     createOrder(newData: any) {
//         console.log(newData)
//         http.post('/api/companies', newData, {
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         })
//             .then(response => response.data)
//             .then(() => {
//                 this.fetchOrders(); // Перезагрузка данных после добавления
//                 toastStore.show('Запись добавлена', 'success');
//             })
//             .catch(error => {
//                 console.error('Ошибка при добавлении:', error);
//                 toastStore.show('Ошибка при добавлении', 'danger');
//             });
//     }

//     getOrderById(id: number): Company | undefined {
//         return this.orders.find(order => order.id === id);
//     }

//     updateOrder(id: number, updatedData: any) {
//         http.put(`/api/companies/${id}`, updatedData, {
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         })
//             .then(response => response.data)
//             .then(() => {
//                 this.fetchOrders(); // Перезагрузка данных после обновления
//                 toastStore.show('Запись обновлена', 'success');
//             })
//             .catch(error => {
//                 console.error('Ошибка при обновлении данных:', error);
//                 toastStore.show('Ошибка при обновлении данных', 'danger');
//             });
//     }

//     deleteOrder(id: number) {
//         http.delete_(`/api/companies/${id}`)
//             .then(() => {
//                 this.fetchOrders(); // Перезагрузка данных после удаления
//                 toastStore.show('Запись удалена', 'success');
//             })
//             .catch(error => {
//                 console.error('Ошибка при удалении:', error);
//                 toastStore.show('Ошибка при удалении', 'danger');
//             });
//     }

//     setOrders(data: any) {
//         this.orders = data;
//     }
// }

// export const companyStore = new CompanyStore();

import { create } from 'zustand';
import http from '../api/http-client';
import auth from '../api/auth.service';
import { useToastStore } from './ToastStore';

type CompanyState = {
    companies: Company[];
    current_page: number;
    fetchCompanies: () => void;
    createCompany: (newData: any) => void;
    getCompanyById: (id: number) => Company | undefined;
    updateCompany: (id: number, updatedData: any) => void;
    deleteCompany: (id: number) => void;
    setCompanies: (data: Company[]) => void;
};

export const useCompanyStore = create<CompanyState>((set, get) => ({
    companies: [],
    current_page: 0,

    fetchCompanies: () => {
        if (auth.getAuthUser() !== null) {
            http.get('/api/companies')
                .then(response => get().setCompanies(response.data))
                .catch(error => console.error('Ошибка при получении данных:', error));
        }
    },

    createCompany: (newData) => {
        const show = useToastStore.getState().show;
        http.post('/api/companies', newData, {
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => response.data)
            .then(() => {
                get().fetchCompanies(); // Reload data after addition
                show('Запись добавлена', 'success');
            })
            .catch(error => {
                console.error('Ошибка при добавлении:', error);
                show('Ошибка при добавлении', 'danger');
            });
    },

    getCompanyById: (id) => {
        return get().companies.find(order => order.id === id);
    },

    updateCompany: (id, updatedData) => {
        console.log(updatedData)
        const show = useToastStore.getState().show;
        http.put(`/api/companies/${id}`, updatedData, {
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => response.data)
            .then(() => {
                get().fetchCompanies(); // Reload data after update
                show('Запись обновлена', 'success');
            })
            .catch(error => {
                console.error('Ошибка при обновлении данных:', error);
                show('Ошибка при обновлении данных', 'danger');
            });
    },

    deleteCompany: (id) => {
        const show = useToastStore.getState().show;
        http.delete_(`/api/companies/${id}`)
            .then(() => {
                get().fetchCompanies(); // Reload data after deletion
                show('Запись удалена', 'success');
            })
            .catch(error => {
                console.error('Ошибка при удалении:', error);
                show('Ошибка при удалении', 'danger');
            });
    },

    setCompanies: (data) => {
        set({ companies: data });
    },
}));