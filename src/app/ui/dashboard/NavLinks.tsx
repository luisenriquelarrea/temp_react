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
            {seccionMenu.map((seccion: SeccionMenu) => {
                return (
                    <Link
                        key={seccion.descripcion}
                        href={'dashboard/'+seccion.descripcion} >
                        <p>{seccion.navbarLabel}</p>
                    </Link>
                );
            })}
        </>
    );
}

export default NavLinks;