export interface Accion {
    id?: number,
    descripcion?: string,
    label?: string,
    icon?: string,
    callMethod?: string
}
export interface Grupo {
    id: number,
    descripcion: string
}
export interface User {
    grupo?: Grupo,
    userId?: number,
    username?: string,
    name?: string
}

export interface Menu{
    descripcion: string,
    label: string
}
export interface SeccionMenu {
    menu?: Menu,
    descripcion?: string,
    navbarLabel?: string,
    icon?: string
}

export interface SeccionMenuInput {
    inputType?: string,
    inputLabel?: string,
    inputId?: string,
    inputName?: string,
    inputCols?: number,
    inputRequired?: number,
    alta?: number,
    modifica?: number,
    lista?: number,
    orden?: number,
    urlGet?: string,
    modelo?: string
}