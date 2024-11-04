import Axios from "./CallerService"

export const getLeadsProspects = (id) => {
    return Axios.get(`admin/website-leads`, { params: { websiteId: id } })
}

export const getLeadProspect = (type, id) => {
    return Axios.get(`admin/website-leads/${type}/${id}`)
}
