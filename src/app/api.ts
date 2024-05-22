import { url_api } from './constants';
import { User } from './entities';

export const getNavLinks = async (grupo: any) => {
    return fetch(url_api+"accion_grupo/allowed_menus", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            'grupoId': grupo.id
        }),
    })
}

export const getSeccionMenu = async (seccionMenu: string) => {
    return fetch(url_api+"seccion_menu/descripcion", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            'descripcion': seccionMenu
        }),
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