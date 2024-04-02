import axios from 'axios';
import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth_token';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// api.interceptors.request.use(
//     (config) => {
//         const token = Cookies.get(TOKEN_KEY);
//         if (token) {
//             config.headers.Authorization = `Bearer ${ token }`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// api.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config;

//         if (error.response.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;

//             try {
//                 const token = await AuthService.refreshToken();
//                 // Update the token in local storage or state
//                 api.defaults.headers.common['Authorization'] = Bearer ${ token };
//                 return api(originalRequest);
//             } catch (err) {
//                 // Handle error
//                 return Promise.reject(err);
//             }
//         }

//         return Promise.reject(error);
//     }
// );

export default api;