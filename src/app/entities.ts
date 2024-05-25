export interface Accion {
    descripcion?: string,
    label?: string,
    callMethod?: string
}
export interface Grupo {
    id: number,
    descripcion: string
}
export interface User {
    grupo?: Grupo,
    name?: string
}

export interface Menu{
    descripcion: string,
    label: string
}
export interface SeccionMenu {
    menu?: Menu,
    descripcion?: string,
    navbarLabel?: string
}