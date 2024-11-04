import Axios from "./CallerService"

export const getPosts = () => {
    return Axios.get(`admin/post`)
}