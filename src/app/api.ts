import { url_api } from './constants';

interface User {
    name: string,
    password: string
}

interface SeccionMenu {
    seccion_menu_id: string,
    descripcion?: string,
    label?: string
}

export const getNavLinks = async (data: SeccionMenu) => {
    return fetch(url_api+"authenticate", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    })
}

export const getUser = async (data: User) => {
    return fetch(url_api+"seccion_menu", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    })
}

export default { getUser }