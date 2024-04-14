import { url_api } from './constants';

interface User {
    name: string,
    password: string
}

export const getNavLinks = async () => {
    return fetch(url_api+"seccion_menu/", {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        },
    })
}

export const getUser = async (data: User) => {
    return fetch(url_api+"authenticate", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    })
}

export default { getUser }