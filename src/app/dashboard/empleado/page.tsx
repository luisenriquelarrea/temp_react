"use client"

import { useState } from "react";
import Alta from '@/app/ui/dashboard/Alta';
import Table from '@/app/ui/dashboard/Table';
const Page = () => {
    const [showAlta, setShowAlta] = useState(false);
    const [showLista, setShowLista] = useState(false);

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