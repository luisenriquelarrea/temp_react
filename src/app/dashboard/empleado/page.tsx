"use client"

import { useState, useEffect } from "react";
import Alta from '@/app/ui/dashboard/Alta';
import Table from '@/app/ui/dashboard/Table';
const Page = () => {
    const [modelo, setModelo] = useState('');
    const [showAlta, setShowAlta] = useState(false);
    const [showLista, setShowLista] = useState(false);

    useEffect(() => {
        let pathname = window.location.pathname;
        let modelo = String(pathname).substring(pathname.lastIndexOf("/") + 1);
        setModelo(modelo);
     });

    const navigateBreadcrumb = (breadcrumb: String) => {
        console.log(modelo);
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