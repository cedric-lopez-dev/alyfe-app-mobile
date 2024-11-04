import Axios from "./CallerService"

export const getWebsite = (email) => {
    return Axios.post(`public/websiteUser`, email)
}

export const getViews = (websiteId) => {
    return Axios.get(`public/website-event-counter/${websiteId}`)
}

export const getMessages = (id) => {
    return Axios.get(`public/dashboard/messages`, { params: { websiteId: id } })
}

export const getProspects = (id) => {
    return Axios.get(`public/dashboard/prospects`, { params: { websiteId: id } })
}

export const getPropertiesStats = (propertiesIds) => {
    return Axios.get(`admin/website-event/properties-stat`, { params: { properties: propertiesIds } })
}

export const getPropertiesAgent = (agentId) => {
    return Axios.get(`public/properties/agent/${agentId}`)
}

export const getPropertiesMc = (mcId) => {
    return Axios.get(`public/properties/mc/${mcId}`)
}