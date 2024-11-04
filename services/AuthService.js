import Axios from "./CallerService"

export const login = (credentials) => {
    return Axios.post(`public/loginApp`, credentials)
}

export const checkToken = () => {
    return Axios.get('/admin/checkToken');
};



