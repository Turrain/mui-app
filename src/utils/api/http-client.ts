import axios from 'axios';
import authService from './auth.service';

const instance = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});


instance.interceptors.request.use((config) => {
  const authUser = authService.getAuthUser();

  if (authUser) {
      config.headers['Authorization'] = `Bearer ${authUser.access_token}`;
  }
  return config;
}, (error) => {

  return Promise.reject(error);
});

instance.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error?.response?.status === 401) { 
      localStorage.removeItem('authUser');
      window.location.reload();
  } else {
      return Promise.reject(error.response);
  }
});

const get = (url: string, params?:any, config = {}) => instance.get(url, { params, ...config });
const post = (url: string, data?:any, config = {}) => instance.post(url, data, config);
const put = (url: string, data?: any, config = {}) => instance.put(url, data, config);
const delete_ = (url: string, config = {}) => instance.delete(url, config);

const methods = { get, post, put, delete_ };

export default methods;

