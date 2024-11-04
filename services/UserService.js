import Axios from "./CallerService"

export const getMember = (emailUser) => {
    return Axios.get(`public/member`, { params: { email: emailUser } })
}

export const updateUser = (id, data) => {
    return Axios.put(`admin/user/${id}`, data)
}
