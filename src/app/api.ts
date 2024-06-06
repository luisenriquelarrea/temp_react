import { url_api } from './constants';
import { User } from './entities';

export const save = async (seccionMenu: string, formdata: any) => {
    return fetch(url_api+seccionMenu+"/add", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formdata),
    })
}

export const updateRecord = async (seccionMenu: string, id: number, formdata: any) => {
    return fetch(url_api+seccionMenu+"/"+id, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formdata),
    })
}

export const getBreadcrumbs = async (seccionMenuId: number, grupo: any) => {
    return fetch(url_api+"accion_grupo/allowed_breadcrumbs", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            'seccionMenuId': seccionMenuId,
            'grupoId': grupo.id
        }),
    })
}

export const getTableActions = async (seccionMenuId: number, grupo: any) => {
    return fetch(url_api+"accion_grupo/allowed_table_actions", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            'seccionMenuId': seccionMenuId,
            'grupoId': grupo.id
        }),
    })
}

export const getInputs = async (seccionMenuId: number, columna: string) => {
    return fetch(url_api+"seccion_menu_input/inputs", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            'seccionMenuId': seccionMenuId,
            'columna': columna
        }),
    })
}

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

export const getSeccionMenuList = async (seccionMenu: string) => {
    return fetch(url_api+seccionMenu+"/", {
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