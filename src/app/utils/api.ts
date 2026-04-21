import { ApiResponse, Filter } from './types';

var urlAPI = process.env.urlAPI;

const getToken = () => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser).token : null;
};

export const downloadXLSFile = async (seccionMenu: string, endpoint: string, 
        filename: string) => {
    const response = await fetch(`${urlAPI}${seccionMenu}/${endpoint}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename+".csv";
    a.click();
    window.URL.revokeObjectURL(url);
    return true;
};

export const save = async (seccionMenu: string, formdata: any) => {
    return fetch(`${urlAPI}${seccionMenu}/add`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify(formdata),
    })
}

export const saveAll = async (seccionMenu: string, formdata: any[]) => {
    return fetch(`${urlAPI}${seccionMenu}/addAll`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify(formdata),
    })
}

export const saveCustom = async (seccionMenu: string, endpoint: string, formdata: {[key: string]: any}) => {
    return fetch(`${urlAPI}${seccionMenu}/${endpoint}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify(formdata),
    })
}

export const patchRecord = async (seccionMenu: string, id: number, formdata: any) => {
    return fetch(`${urlAPI}${seccionMenu}/${id}`, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/merge-patch+json",
            "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify(formdata),
    })
}

export const updateRecord = async (seccionMenu: string, id: number, formdata: any) => {
    return fetch(`${urlAPI}${seccionMenu}/${id}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify(formdata),
    })
}

export const uploadFile = async (seccionMenu: string, id: number, formdata: any) => {
    return fetch(`${urlAPI}${seccionMenu}/${id}/uploadFile`, {
        method: 'POST',
        body: formdata,
    })
}

export const deleteRecords = async (seccionMenu: string, formdata: any) => {
    return fetch(`${urlAPI}${seccionMenu}/deleteRecords`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify(formdata),
    })
}

export const deleteRecord = async (seccionMenu: string, id: number) => {
    return fetch(`${urlAPI}${seccionMenu}/${id}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
    })
}

export const getById = async (seccionMenu: string, id: number) => {
    return fetch(`${urlAPI}${seccionMenu}/${id}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
    })
}

export const getByUserId = async (seccionMenu: string, url: string) => {
    return fetch(`${urlAPI}${seccionMenu}/${url}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        }
    })
}

export const countFilteredList = async (seccionMenu: string, formdata: any) => {
    return fetch(`${urlAPI}${seccionMenu}/countFilteredList`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify(formdata),
    })
}

export const getBreadcrumbs = async (seccionMenuId: number) => {
    return fetch(`${urlAPI}accion_grupo/allowed_breadcrumbs`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify({ 
            seccionMenu: {
                id: seccionMenuId
            }
        }),
    })
}

export const getCustomReport = async (seccionMenu: string, endpoint: string, formdata: any) => {
    return fetch(`${urlAPI}${seccionMenu}/${endpoint}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify(formdata),
    })
}

export const getDataFromAPI = async (urlSource: string, filter: Filter): Promise<ApiResponse> => {
    const response = await getSeccionMenuListFiltered(urlSource, filter);
    if (!response.ok) {
        console.error("Error fetching data:", response);
        return {
            error: true,
            message: "Ocurrió un error inesperado, consulte a su equipo de sistemas.",
            data: []
        };
    }
    let responseArray: any[] = [];
    try {
        responseArray = await response.json();
    } catch (err) {
        console.error("Invalid JSON response:", err);
        return {
            error: true,
            message: "Ocurrió un error inesperado, consulte a su equipo de sistemas.",
            data: []
        };
    }
    return {
        error: false,
        message: "ok",
        data: responseArray
    };
}

export const getNavbarActions = async (seccionMenuId: number) => {
    return fetch(`${urlAPI}accion_grupo/allowed_navbar`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify({ 
            seccionMenu: {
                id: seccionMenuId
            }
        }),
    })
}

export const getTableActions = async (seccionMenuId: number) => {
    return fetch(`${urlAPI}accion_grupo/allowed_table_actions`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify({ 
            seccionMenu: {
                id: seccionMenuId
            }
        }),
    })
}

export const getInputs = async (seccionMenuId: number, columna: string) => {
    return fetch(`${urlAPI}seccion_menu_input/inputs`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify({ 
            seccionMenu: {
                id: seccionMenuId
            },
            columna: columna
        }),
    })
}

export const getNavLinks = async (token: string) => {
    return fetch(`${urlAPI}accion_grupo/allowed_menus`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
    })
}

export const getSeccionMenu = async (seccionMenu: string) => {
    return fetch(`${urlAPI}seccion_menu/descripcion`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify({ 
            descripcion: seccionMenu
        }),
    })
}

export const getSeccionMenuList = async (seccionMenu: string) => {
    return fetch(`${urlAPI}${seccionMenu}/`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
    })
}

export const getSeccionMenuListFiltered = async (seccionMenu: string, formdata: any) => {
    return fetch(`${urlAPI}${seccionMenu}/filteredList`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify(formdata),
    })
}

export const getUser = async (data: any) => {
    return fetch(`${urlAPI}authenticate`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
}

export const validateUserIsActive = async (username: string) => {
    return fetch(`${urlAPI}user_is_active`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify({username: username}),
    })
}