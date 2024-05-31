"use client"

import { memo } from "react";
import { useState, useRef, useEffect } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import Alta from '@/app/ui/dashboard/Alta';
import Table from '@/app/ui/dashboard/Table';
import { arrayColumn } from '../../funciones';
import { User, Accion } from '../../entities';
import {getSeccionMenu, getBreadcrumbs } from '../../api';

const Page = () => {
    const { getItem } = useLocalStorage();
    const [seccionMenuId, setSecccionMenuId] = useState(0);
    const [navbarLabel, setNavbarLabel] = useState("");
    const [alta, setAlta] = useState(false);
    const [lista, setLista] = useState(false);
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    //const breadcrumbStates = useRef<any>({});

    useEffect(() => {
        const user: User = JSON.parse(String(getItem("user")));
        let pathname = window.location.pathname;
        let seccionMenu = String(pathname).substring(pathname.lastIndexOf("/") + 1);
        getSeccionMenu(seccionMenu).then(response => {
            if(!response.ok){
                console.log("Error al obtener seccionMenu");
                console.log(response);
                return;
            }
            response.json().then(data => {
                setNavbarLabel(data.navbarLabel);
                const seccionMenuId = data.id;
                setSecccionMenuId(seccionMenuId);
                getBreadcrumbs(seccionMenuId, user.grupo).then(response => {
                    if(!response.ok){
                        console.log("Error al obtener breadcrumbs");
                        console.log(response);
                        return;
                    }
                    response.json().then(data => {
                        let tmp: any = {};
                        arrayColumn(data, 'callMethod').forEach(key => {
                            tmp[key] = false;
                        });
                        //breadcrumbStates.current = tmp;
                        setBreadcrumbs(data);
                    })
                }).catch(error => console.error(error));
            })
        }).catch(error => console.error(error));
    }, []);

    const create = () => {
        setLista(false);
        setAlta(!alta);
    }

    const read = () => {
        setAlta(false);
        setLista(!lista);
    }

    /*const navigateBreadcrumb = (evt: any, breadcrumb: string) => {
        evt.preventDefault();
        const newStates = breadcrumbStates;
        for(const prop in newStates)
            newStates[prop] = false;
        for(const prop in newStates)
            (prop === breadcrumb) ? newStates[prop] = true : false;
        setBreadcrumbStates(newStates);
        console.log(breadcrumbStates);*/
        /*for(const prop in breadcrumbStates.current)
            breadcrumbStates.current[prop] = false;
        for(const prop in breadcrumbStates.current)
            (prop === breadcrumb) ? breadcrumbStates.current[prop] = true : false;
        console.log(breadcrumbStates.current);
    }*/

    return(
        <>
            <nav className="breadcrumb no-print" aria-label="breadcrumbs">
                <ul>
                    <li className="my-bread"><b>{navbarLabel}</b></li>
                    {breadcrumbs.map((breadcrumb: Accion) => {
                        return(
                            <li key={ breadcrumb.descripcion }>
                                <a 
                                    onClick={() => eval(String(breadcrumb.callMethod))() }
                                    key={ breadcrumb.descripcion } >
                                    {breadcrumb.label}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </nav>
            { Boolean(alta) ? <Alta seccionMenuId={ seccionMenuId } /> : null }
            { Boolean(lista) ? <Table /> : null }
        </>
    );
}

export default memo(Page);