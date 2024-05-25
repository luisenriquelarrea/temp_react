"use client"

import { useState, useEffect } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import Alta from '@/app/ui/dashboard/Alta';
import Table from '@/app/ui/dashboard/Table';
import { User, Accion } from '../../entities';
import { getSeccionMenu, getBreadcrumbs } from '../../api';

const Page = () => {
    const { getItem } = useLocalStorage();
    const [navbarLabel, setNavbarLabel] = useState("")
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    const [showAlta, setShowAlta] = useState(false);
    const [showLista, setShowLista] = useState(false);

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
                        console.log(data);
                        setBreadcrumbs(data);
                    })
                }).catch(error => console.error(error));
            })
        }).catch(error => console.error(error));
    }, []);

    const navigateBreadcrumb = (breadcrumb: String) => {
        if(breadcrumb === 'alta')
            setShowAlta( !showAlta )
        else
            setShowLista( !showLista )
    }

    return(
        <>
            <nav className="breadcrumb no-print" aria-label="breadcrumbs">
                <ul>
                    <li className="my-bread"><b> {navbarLabel} </b></li>
                    {breadcrumbs.map((breadcrumb: Accion) => {
                        return(
                            <li key={breadcrumb.descripcion}>
                                <a onClick={() => navigateBreadcrumb("alta")}>{breadcrumb.label}</a>
                            </li>
                        );
                    })}
                </ul>
            </nav>
            { showAlta ? <Alta /> : null }
            { showLista ? <Table /> : null }
        </>
    );
}

export default Page;