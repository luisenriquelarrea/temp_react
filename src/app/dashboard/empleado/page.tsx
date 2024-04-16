"use client"

import { useState, useEffect } from "react";
import Alta from '@/app/ui/dashboard/Alta';
import Table from '@/app/ui/dashboard/Table';
import { getSeccionMenu } from '../../api';

const Page = () => {
    const [seccionMenu, setSeccionMenu] = useState('');
    const [seccionMenuId, setSeccionMenuId] = useState(false);
    const [showAlta, setShowAlta] = useState(false);
    const [showLista, setShowLista] = useState(false);

    useEffect(() => {
        let pathname = window.location.pathname;
        let seccionMenu = String(pathname).substring(pathname.lastIndexOf("/") + 1);
        setSeccionMenu(seccionMenu);
        getSeccionMenu(seccionMenu)
            .then(response => {
                if(!response.ok){
                    console.log("Error al obtener seccionMenu");
                    console.log(response);
                    return;
                }
                response.json().then(data => {
                    setSeccionMenuId(data.id);
                })
            })
            .catch(error => console.error(error));
     });

    const navigateBreadcrumb = (breadcrumb: String) => {
        console.log(seccionMenu);
        console.log(seccionMenuId)
        if(breadcrumb === 'alta')
            setShowAlta( !showAlta )
        else
            setShowLista( !showLista )
    }

    return(
        <>
            <nav className="breadcrumb no-print" aria-label="breadcrumbs">
                <ul>
                    <li className="my-bread"><b> Empleados </b></li>
                    <li>
                        <a onClick={() => navigateBreadcrumb("alta")}>Alta</a>
                    </li>
                    <li>
                        <a onClick={() => navigateBreadcrumb("lista")}>Lista</a>
                    </li>
                </ul>
            </nav>
            { showAlta ? <Alta /> : null }
            { showLista ? <Table /> : null }
        </>
    );
}

export default Page;