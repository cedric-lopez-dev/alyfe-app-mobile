import Axios from "./CallerService"

export const getChatMessages = () => {
    return Axios.get(`public/chatMessage`)
}