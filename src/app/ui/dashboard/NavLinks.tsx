'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getNavLinks } from '../../api';
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { User, Grupo } from '../../entities';

const NavLinks = () => {
    const { getItem } = useLocalStorage();
    const [user, setUser] = useState<User>();
    const [grupo, setGrupo] = useState<Grupo>();
    const [links, setLinks] = useState([]);

    useEffect(() => {
        //Runs only on the first render
        setUser(JSON.parse(String(getItem("user"))));
    }, []);

    setGrupo(user?.grupo);

    useEffect(() => {
    getNavLinks(grupo?.id)
            .then(response => {
                if(!response.ok){
                    console.log("Bad credentials!");
                    console.log(response);
                    return;
                }
                response.json().then(data => {
                    setLinks(data);
                })
            })
            .catch(error => console.error(error));
    }, []);
    console.log(links);

    const pathname = usePathname();
    return (
        <>
            {links.map((link) => {
                //const LinkIcon = link.icon;
                return (
                    <Link
                        key={link.descripcion}
                        href={'dashboard/'+link.descripcion} >
                        <p>{link.navbarLabel}</p>
                    </Link>
                );
            })}
        </>
    );
}

export default NavLinks;