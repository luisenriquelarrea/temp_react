'use client';

import { memo } from "react";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getNavLinks } from '../../api';
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { User, SeccionMenu } from '../../entities';

const NavLinks = () => {
    const { getItem } = useLocalStorage();
    const [seccionMenu, setSeccionMenu] = useState({});

    var user: User = {};

    useEffect(() => {
        //Runs only on the first render
        user = JSON.parse(String(getItem("user")));
        getNavLinks(user.grupo).then(response => {
            if(!response.ok){
                console.log("Error al obtener navLinks");
                console.log(response);
                return;
            }
            response.json().then(data => {
                setSeccionMenu(Object.groupBy(data, ( {menu}:any ) => menu.label));
            })
        }).catch(error => console.error(error));
    }, []);

    const pathname = usePathname();
    return (
        <>
            <Link 
                key="dashboard"
                className="w3-bar-item w3-button w3-padding"
                href='/dashboard' >
                <p><i className="fa fa-dashboard fa-fw"></i> Dashboard</p>
            </Link>
            <div className="navbar-item has-dropdown is-hoverable">
        <a className="w3-padding">
        <i className={`fa fa-list fa-fw`}></i> More
        </a>
        <div className="navbar-dropdown">
            return({
                    <Link 
                        key={seccion.descripcion}
                        className="w3-bar-item w3-button w3-padding"
                        href={'/dashboard/'+seccion.descripcion} >
                        <p><i className={`fa fa-${seccion.icon} fa-fw`}></i> {seccion.navbarLabel}</p>
                    </Link>
            });
            </div>
            </div>
        </>
    );
}

export default memo(NavLinks);