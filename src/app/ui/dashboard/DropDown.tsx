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
                console.log(data);
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
                {
                    Object.keys(seccionMenu).map((menu) => {
                        const links = seccionMenu[menu];        
                        return <div key={ menu }>
                            <div className="dropdown is-hoverable w3-bar-item w3-padding">
                                <div className="dropdown-trigger">
                                    <button aria-haspopup="true" aria-controls="dropdown-menu">
                                        <p><i className="fa fa-angle-down fa-fw" aria-hidden="true"></i>{ menu }</p>
                                    </button>
                                </div>
                                <div className="dropdown-menu" id="dropdown-menu" role="menu">
                                    <div className="dropdown-content">
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
                            </div>
                        </div>
                    })
                }
        </>
    );
}

export default memo(DropDown);