import Axios from "./CallerService"

export const getTeamLeaders = () => {
    return Axios.get(`public/teamleaders`, { params: { leadgen: true } })
}
export const createLead = (lead) => {
    return Axios.post(`public/lead/create`, lead)
}
export const getLeads = (memberId) => {
    return Axios.get(`admin/lead`, { params: { origin_memberId: memberId } })
}