import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { getMember } from '../services/UserService';
import { getMessages, getPropertiesStats, getProspects, getViews, getWebsite, getPropertiesAgent, getPropertiesMc } from '../services/WebsiteService';
import { getLeads, getTeamLeaders } from '../services/LeadGen.service';
import { getChatMessages } from '../services/ChatMessageServise';
import { getPosts } from '../services/PostService';
import { Image } from 'react-native';
import { getLeadsProspects } from '../services/LeadService';

export const StorageContext = createContext()
export const DataProvider = ({ children }) => {

    const { email } = useContext(AuthContext)
    const [data, setData] = useState({})
    const [dataLoaded, setDataLoaded] = useState(false)
    const { isLogged } = useContext(AuthContext)
    const currentVersion = "1.4.2"

    useEffect(() => {

        if (email) {
            sendGetMember(email).then((member) => {
                return member
            }).then((member) => {
                sendGetWebsite(member)
                    .then((website) => {
                        getWebsiteData(website)
                    })
            })

        }

    }, [email, isLogged])


    const getWebsiteData = (website) => {
        if (website) {
            Promise.all([
                sendGetMessages(website.id),
                sendGetProspects(website.id),
                sendGetProperties(website),
                sendGetPosts()
                // sendGetChatMessages()
            ]).finally(() => {
                setDataLoaded(true)
            })
        }

        else {
            setData({ noWebsite: true })
            setDataLoaded(true)
        }
    }


    const sendGetWebsite = (member) => {
        return getWebsite({ email: member.email })
            .then((res) => {
                const newArray = res.data.map((website) => {
                    if (website.website.type === "market") {
                        const initiales = website?.market?.name.split(" ")[1]
                        return { ...website.website, market: website.market, nameDisplay: website?.market?.name, initiales: initiales[0] + " " + initiales[1] }
                    }
                    if (website.website.type === "agent") {
                        const initiales = website?.member?.firstname[0] + " " + website?.member?.lastname[0]
                        return { ...website.website, market: website.market, member: website.member, nameDisplay: `${website?.member?.firstname} ${website?.member?.lastname}`, initiales: initiales }
                    }

                })
                let websiteTodisplay = newArray[0]

                newArray.forEach(website => {
                    if (website.typeId === member.id)
                        websiteTodisplay = website
                });


                setData((prevData) => ({ ...prevData, website: websiteTodisplay, websites: newArray }))
                return websiteTodisplay;
            })
            .catch((error) => console.log("Error fetching website:", error));
    }
    const sendGetViews = (websiteId, properties) => {
        return getViews(websiteId)
            .then((res) => {
                let sum = 0;
                const pageViews = res.data.result.pageViews
                for (views in pageViews) {
                    sum += pageViews[views];
                }
                setData((prevData) => ({ ...prevData, visits: sum }))
                addPropertiesStats(properties, res.data.result?.propertiesViews)
            }
            )
            .catch((error) => {
                console.log("Error fetching views:", error)
            });
    }

    const sendGetMember = (userEmail) => {
        return getMember(userEmail)
            .then((res) => {
                const agent = res.data?.members[0]
                setData((prevData) => ({
                    ...prevData,
                    agent: agent
                }));
                return agent
            })
            .catch((error) => console.log("Error fetching member:", error));
    }
    const sendGetProperties = (website) => {

        const request = website.type === "agent" ? getPropertiesAgent : getPropertiesMc
        return request(website.typeId)
            .then((res) => {

                let propertiesCount = 0
                let properties = []
                if (res.data?.count) {
                    propertiesCount = res.data.count
                    properties = res.data.properties

                }
                setData((prevData) => ({
                    ...prevData,
                    propertiesCount: propertiesCount,
                    properties: properties

                }));

                return res.data

            })
            .catch((error) => {
                console.log("Error fetching properties:", error)
            }).then((res) => {
                // if (res?.count && website.type === "agent")
                sendGetViews(website.id, res.properties)
            });
    }

    const sendGetMessages = (websiteId) => {
        return getMessages(websiteId)
            .then((res) => {
                setData((prevData) => ({
                    ...prevData,
                    messages: res.data.messages
                }));
            })
            .catch((error) => {
                console.log("Error fetching messages:", error)
            }
            )
            ;
    }
    const sendGetProspects = (websiteId) => {
        return getProspects(websiteId)
            .then((res) => {
                const prospectsNumbers = res.data.appraisals + res.data.buyers
                setData((prevData) => ({
                    ...prevData,
                    prospects: prospectsNumbers
                }));
            })
            .catch((error) => {
                console.log("Error fetching prospects:", error)
            }
            );
    }

    const sendGetLeadsProspects = (websiteId) => {
        return getLeadsProspects(websiteId)
            .then((res) => {
                const formatedLeads = res.data.map((lead) => {
                    if (lead?.telephone)
                        return { ...lead, phone: lead.telephone }
                    return lead
                })
                setData((prevData) => ({
                    ...prevData,
                    leadsProspects: formatedLeads
                }));
                return formatedLeads
            })
            .catch((error) => {
                console.log("Error fetching prospects:", error)
            }
            );
    }
    const addPropertiesStats = (properties, propertiesViews) => {
        if (properties) {
            const newProperties = properties.map((property) => {
                const allViews = propertiesViews[property.id] || 0

                return { ...property, allViews: allViews }
            })
            setData((prevData) => ({
                ...prevData,
                properties: newProperties
            }));

        }
    }

    const sendGetTeamLeaders = () => {

        return getTeamLeaders()
            .then((res) => {
                const newArray = []
                res.data.teamLeaders.map((teamLeader) => {
                    const addTeamLeader = {
                        id: teamLeader?.id,
                        firstname: teamLeader?.firstname,
                        lastname: teamLeader?.lastname,
                        picture: teamLeader?.picture,
                        roleName: teamLeader.roleName,
                        marketCenter: {
                            name: teamLeader?.marketCenter.name,
                            city: teamLeader?.marketCenter?.city,
                            id: teamLeader?.marketCenter?.id,

                        }
                    }
                    newArray.push(addTeamLeader);
                });

                setData((prevData) => ({ ...prevData, teamLeaders: newArray }))
            }
            )
            .catch((error) => {
                console.log("Error fetching teamleaders:", error)
            });
    }
    const sendGetLeads = (agentId) => {

        return getLeads(agentId)
            .then((res) => {
                setData((prevData) => ({ ...prevData, leads: res.data.leads }))
            }
            )
            .catch((error) => {
                console.log("Error fetching teamleads:", error)
            });
    }


    const switchWebsite = (selectedWebsite) => {
        data.websites.forEach((website) => {
            if (selectedWebsite.id === website.id)
                setData((prevData) => ({ ...prevData, website: website }))

        })
    }

    const sendGetChatMessages = () => {
        return getChatMessages()
            .then((res) => {

                const sum = res.data?.messages.reduce((accumulator, currentValue) => {
                    if (currentValue.read === false) {
                        return accumulator + 1;
                    }
                    return accumulator;
                }, 0);
                setData((prevData) => ({
                    ...prevData,
                    chatMessages: res.data.messages.reverse(),
                    noReadMessages: sum
                }));
            })
            .catch((error) => {
                console.log("Error fetching chatMessages:", error)
            }
            );
    }
    const sendGetPosts = () => {
        return getPosts()
            .then((res) => {
                const sortedPosts = res.data.sort((a, b) => new Date(Date.parse(b.publishedAt)) - new Date(Date.parse(a.publishedAt)))
                // Map chaque post pour valider son URL d'image
                const postPromises = sortedPosts.map((post) => {
                    if (post.pictureUrl)
                        return testPictureUrl(post.pictureUrl)
                            .then((isValid) => {
                                if (isValid) {
                                    return post; // L'URL de l'image est valide, retourner le post intact
                                } else {
                                    return { ...post, pictureUrl: false }; // L'URL de l'image n'est pas valide, marquer l'URL comme false
                                }
                            })
                            .catch((error) => {
                                console.error("Error testing picture URL:", error);
                                return post; // En cas d'erreur, retourner simplement le post sans modification
                            });
                    return post
                });
                // Une fois que toutes les promesses sont résolues, mettre à jour les données avec les posts modifiés
                Promise.all(postPromises)
                    .then((validatedPosts) => {
                        setData((prevData) => ({
                            ...prevData,
                            posts: validatedPosts // Utilisez les posts avec les URL d'images validées
                        }));
                    })
                    .catch((error) => {
                        console.error("Error validating picture URLs:", error);
                    });
            })
            .catch((error) => {
                console.log("Error fetching posts:", error);
            });
    };

    const testPictureUrl = (url) => {
        return new Promise((resolve, reject) => {
            Image.getSize(url, () => {
                resolve(true); // L'URL pointe vers une image valide
            }, () => {
                resolve(false); // L'URL ne pointe pas vers une image valide
            });
        });
    };


    return (
        <StorageContext.Provider value={{ data, dataLoaded, setData, setDataLoaded, sendGetTeamLeaders, sendGetLeads, sendGetProperties, sendGetProspects, sendGetMessages, sendGetViews, getWebsiteData, switchWebsite, sendGetChatMessages, sendGetPosts, currentVersion, sendGetLeadsProspects }}>
            {children}
        </StorageContext.Provider>
    )
}