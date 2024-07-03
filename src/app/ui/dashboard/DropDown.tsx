'use client';

import { memo } from "react";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NavLink from "./NavLink";
import { getNavLinks } from '../../api';
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { User } from '../../entities';

const DropDown = () => {
    const { getItem } = useLocalStorage();
    const [seccionMenu, setSeccionMenu] = useState<any>({});

    var user: User = {};

    useEffect(() => {
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
                {
                    Object.keys(seccionMenu).map((menu) => {
                        const links = seccionMenu[menu];        
                        return <div key={ menu }>
                            <a 
                                className="w3-bar-item w3-button w3-padding">
                                <i className={`fa fa-caret-right fa-fw`}></i> {menu}
                            </a>
                            <div className="navbar-dropdown">
                                {
                                    Object.keys(links).map((key) => {
                                        const seccion = links[key]
                                        return <NavLink 
                                            key={ key } 
                                            seccion={ seccion } />
                                    })
                                }
                            </div>
                        </div>
                    })
                }
            </div>
        </>
    );
}

export default memo(DropDown);