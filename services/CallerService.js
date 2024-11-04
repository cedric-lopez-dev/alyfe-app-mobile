import axios from "axios";
import { getToken, removeToken, setToken } from "./AsyncStorageService";

const Axios = axios.create(
    {
        baseURL: 'https://api-web-prod.alyfe.fr/api'
        // baseURL: 'http://192.168.54.52:8000/api'
    }
)
Axios.interceptors.request.use(async (req) => {
    const token = await getToken("token");
    if (token !== null && !req.url.includes('/admin/refreshToken')) {
        req.headers['Authorization'] = 'Bearer ' + token;
    }
    return req;
});
Axios.interceptors.response.use((res) => {
    return res
}, async (error) => {
    const originalRequest = error.config;
    if (!originalRequest.url.includes('/public/login') && !originalRequest.url.includes('/admin/refreshToken') && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const token = await getToken('refreshToken');
        Axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
        await refreshToken().then((res) => {
            setToken('token', res.data.token)
            setToken('refreshToken', res.data.refreshToken)
        }).catch((err) => {
            console.log('err', err.response.data);
        })
        return Axios(originalRequest)
    }

    if (error.response.status === 401) {
        removeToken('token');
        removeToken('refreshToken');

    }
    return Promise.reject(error);
}
)

const refreshToken = () => {
    return Axios.get(`/admin/refreshToken`)
}

export default Axios;
