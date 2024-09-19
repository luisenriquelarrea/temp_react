import { urlAPI, apiKey, apiToken } from './constants';
import { User } from './entities';
import { mysqlTimeStamp } from './funciones';

export const downloadPDFFile = async (seccionMenu: string, id: number, filename: string) => {
    const response = await fetch(urlAPI+seccionMenu+"/downloadPDF"+"/"+id, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            [apiKey]: apiToken
        },
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename+id+".pdf";
    a.click();
    window.URL.revokeObjectURL(url);
    return true;
};

export const save = async (seccionMenu: string, formdata: any) => {
    const recordAt = mysqlTimeStamp();
    formdata.createdAt = recordAt;
    formdata.updatedAt = recordAt;
    return fetch(urlAPI+seccionMenu+"/add", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            [apiKey]: apiToken
        },
        body: JSON.stringify(formdata),
    })
}

export const updateRecord = async (seccionMenu: string, id: number, formdata: any) => {
    return fetch(urlAPI+seccionMenu+"/"+id, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            [apiKey]: apiToken
        },
        body: JSON.stringify(formdata),
    })
}

export const uploadFile = async (seccionMenu: string, id: number, formdata: any) => {
    return fetch(urlAPI+seccionMenu+"/"+id+"/uploadFile", {
        method: 'POST',
        body: formdata,
    })
}

export const deleteRecord = async (seccionMenu: string, id: number) => {
    return fetch(urlAPI+seccionMenu+"/"+id, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            [apiKey]: apiToken
        },
    })
}

export const getById = async (seccionMenu: string, id: number) => {
    return fetch(urlAPI+seccionMenu+"/"+id, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            [apiKey]: apiToken
        },
    })
}

export const getByUserId = async (seccionMenu: string, url: string, userId: number) => {
    return fetch(urlAPI+seccionMenu+"/"+url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            [apiKey]: apiToken
        },
        body: JSON.stringify({userId: userId}),
    })
}

export const countFilteredList = async (seccionMenu: string, formdata: any) => {
    return fetch(urlAPI+seccionMenu+"/countFilteredList", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            [apiKey]: apiToken
        },
        body: JSON.stringify(formdata),
    })
}

export const getBreadcrumbs = async (seccionMenuId: number, grupo: any) => {
    return fetch(urlAPI+"accion_grupo/allowed_breadcrumbs", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            [apiKey]: apiToken
        },
        body: JSON.stringify({ 
            'seccionMenuId': seccionMenuId,
            'grupoId': grupo.id
        }),
    })
}

export const getNavbarActions = async (seccionMenuId: number, grupo: any) => {
    return fetch(urlAPI+"accion_grupo/allowed_navbar", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            [apiKey]: apiToken
        },
        body: JSON.stringify({ 
            'seccionMenuId': seccionMenuId,
            'grupoId': grupo.id
        }),
    })
}

export const getTableActions = async (seccionMenuId: number, grupo: any) => {
    return fetch(urlAPI+"accion_grupo/allowed_table_actions", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            [apiKey]: apiToken
        },
        body: JSON.stringify({ 
            'seccionMenuId': seccionMenuId,
            'grupoId': grupo.id
        }),
    })
}

export const getInputs = async (seccionMenuId: number, columna: string) => {
    return fetch(urlAPI+"seccion_menu_input/inputs", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            [apiKey]: apiToken
        },
        body: JSON.stringify({ 
            'seccionMenuId': seccionMenuId,
            'columna': columna
        }),
    })
}

export const getNavLinks = async (grupo: any) => {
    return fetch(urlAPI+"accion_grupo/allowed_menus", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            [apiKey]: apiToken
        },
        body: JSON.stringify({ 
            'grupoId': grupo.id
        }),
    })
}

export const getSeccionMenu = async (seccionMenu: string) => {
    return fetch(urlAPI+"seccion_menu/descripcion", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            [apiKey]: apiToken
        },
        body: JSON.stringify({ 
            'descripcion': seccionMenu
        }),
    })
}

export const getSeccionMenuList = async (seccionMenu: string) => {
    return fetch(urlAPI+seccionMenu+"/", {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            [apiKey]: apiToken
        },
    })
}

export const getSeccionMenuListFiltered = async (seccionMenu: string, formdata: any) => {
    return fetch(urlAPI+seccionMenu+"/filteredList", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            [apiKey]: apiToken
        },
        body: JSON.stringify(formdata),
    })
}

export const getUser = async (data: User) => {
    return fetch(urlAPI+"authenticate", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            [apiKey]: apiToken
        },
        body: JSON.stringify(data),
    })
}

export const validateUserIsActive = async (username: string) => {
    return fetch(urlAPI+"user_is_active", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            [apiKey]: apiToken
        },
        body: JSON.stringify({username: username}),
    })
}