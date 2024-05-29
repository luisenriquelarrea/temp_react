'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getNavLinks } from '../../api';
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { User, SeccionMenu } from '../../entities';

const NavLinks = () => {
    const { getItem } = useLocalStorage();
    const [seccionMenu, setSeccionMenu] = useState([]);

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
                setSeccionMenu(data);
            })
        }).catch(error => console.error(error));
    }, []);

    const pathname = usePathname();
    return (
        <>
        <Link 
                        className="w3-bar-item w3-button w3-padding"
                        href='/dashboard' >
                        <p><i className="fa fa-users fa-fw"></i> Dashboard</p>
    </Link>
            {seccionMenu.map((seccion: SeccionMenu) => {
                return (
                    <Link 
                        className="w3-bar-item w3-button w3-padding"
                        key={seccion.descripcion}
                        href={'/dashboard/'+seccion.descripcion} >
                        <p><i className="fa fa-users fa-fw"></i> {seccion.navbarLabel}</p>
                    </Link>
                );
            })}
        </>
    );
}

export default NavLinks;