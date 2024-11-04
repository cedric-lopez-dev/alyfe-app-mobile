import Axios from "./CallerService"

export const getAppInfos = () => {
    return Axios.get(`public/kwAlyfeApp`)
}