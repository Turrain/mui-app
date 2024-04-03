import http from "./http-client";



const login = async (data: UserLogin) => {
    try {
        console.log('as')
        const formData = new URLSearchParams();
        formData.append('username', data.username);
        formData.append('password', data.password);
        const response = await http.post('/auth/jwt/login', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        const parsed = response.data;
      
        localStorage.setItem('authUser', JSON.stringify(parsed));
       
        return parsed;
    } catch (error) {
        console.error('Ошибка входа', error);
        throw error;
    }
}

const register = (data:UserCreate) => {
    return http.post('/auth/register', data);
}

const profile = async () => {
    let res = (await http.get('/users/me')).data as UserCreate;
    let i = localStorage.getItem('authUser')
    if(i !== null){
        const item: User = JSON.parse(i);
        item.user_data = res
        localStorage.setItem('authUser', JSON.stringify(item));
    }
    return res;
}

const logout = () => {
    http.post('/auth/jwt/logout', null, {});
    localStorage.removeItem('authUser');
    window.location.reload()
}

const getAuthUser = () => {
    const item = localStorage.getItem('authUser');

    return item ? JSON.parse(item) : null;
}  

const methods = { 
    login,
    register,
    profile,
    logout,
    getAuthUser
}

export default methods;