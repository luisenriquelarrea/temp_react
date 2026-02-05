'use client';

import { memo } from "react";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import NavLink from "./NavLink";
import { getNavLinks } from '@/app/utils/api';
import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import { User } from '@/app/utils/entities';
import { parseString } from "@/app/utils/helpers";

const Accordion = () => {
    const { getItem } = useLocalStorage();
    const [seccionMenu, setSeccionMenu] = useState< {[key: string]: any} >({});

    useEffect(() => {
        const user: User = JSON.parse(String(getItem("user")));
        getNavLinks(user.grupo).then(response => {
            if(!response.ok){
                console.log("Error al obtener navLinks");
                console.log(response);
                return;
            }
            response.json().then(data => {
                const grouped = data.reduce((acc: any, item: any) => {
                    const key = item.menu.label;
                    if (!acc[key]) acc[key] = [];
                    acc[key].push(item);
                    return acc;
                }, {});

                setSeccionMenu(grouped);
            });
        }).catch(error => console.error(error));
    }, []);

    const myAccordion = (id: string) => {
        const x = document.getElementById(id);
        if (x!.className.indexOf("w3-show") == -1)
            x!.className += " w3-show";
        else
            x!.className = x!.className.replace(" w3-show", "");
    }

    const getIcon = (links: { menu: { icon?: string } }[]): string => {
        if (!links.length) return "bars";
        const icon = links[0].menu.icon?.trim() ?? "";
        return icon !== "" ? icon : "bars";
    };  

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
                    const parseStr = parseString(menu);
                    const links = seccionMenu[menu];
                    return <div key={ menu }>            
                        <button onClick={() => myAccordion(parseStr) } className="w3-button w3-block w3-left-align">
                            <p>
                                <i className={`fa fa-${ getIcon(links) } fa-fw`} aria-hidden="true"></i>{' '}
                                { menu } 
                                <i className="fa fa-angle-down fa-fw" aria-hidden="true" style={{float: "right"}}></i>
                            </p>
                        </button>
                        <div id={ parseStr } className="w3-container w3-white w3-hide">
                        {
                            Object.keys(links).map((key) => {
                                const seccion = links[key];
                                return <NavLink 
                                    key={ key } 
                                    seccion={ seccion } />
                            })
                        }
                        </div>
                            
                    </div>
                })
            }
        </>
    );
}

export default memo(Accordion);