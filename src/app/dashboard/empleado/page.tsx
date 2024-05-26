"use client"

import { useState, useEffect, useRef } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import Alta from '@/app/ui/dashboard/Alta';
import Table from '@/app/ui/dashboard/Table';
import { arrayColumn } from '../../funciones';
import { User, Accion } from '../../entities';
import {getSeccionMenu, getBreadcrumbs } from '../../api';

const Page = () => {
    const { getItem } = useLocalStorage();
    const [navbarLabel, setNavbarLabel] = useState("")
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    const [breadcrumbStates, setBreadcrumbStates] = useState<any>({});

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
                        setBreadcrumbStates(tmp);
                        setBreadcrumbs(data);
                    })
                }).catch(error => console.error(error));
            })
        }).catch(error => console.error(error));
    }, []);

    const navigateBreadcrumb = (breadcrumb: string) => {
        /*for(const prop in breadcrumbStates)
            breadcrumbStates[prop] = false
        for(const prop in breadcrumbStates)
            (prop === breadcrumb) ? breadcrumbStates[prop] = true : false*/
        /*setBreadcrumbStates((prevState: any) => {
            for(const prop in breadcrumbStates)
                prevState[prop] = false;
            for(const prop in prevState)
                (prop === breadcrumb) ? prevState[prop] = true : false;
            console.log(prevState);
            return prevState;
        });*/
        const newStates = breadcrumbStates;
        for(const prop in newStates)
            newStates[prop] = false;
        for(const prop in newStates)
            (prop === breadcrumb) ? newStates[prop] = true : false;
        setBreadcrumbStates(newStates);
        console.log(breadcrumbStates);
    }

    return(
        <>
            <nav className="breadcrumb no-print" aria-label="breadcrumbs">
                <ul>
                    <li className="my-bread"><b> {navbarLabel} </b></li>
                    {breadcrumbs.map((breadcrumb: Accion) => {
                        return(
                            <li key={breadcrumb.descripcion}>
                                <a onClick={ () => navigateBreadcrumb(String(breadcrumb.callMethod)) }>
                                    {breadcrumb.label}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </nav>
            { Boolean(breadcrumbStates['create']) === true ? <Alta /> : null }
        </>
    );
}

export default Page;