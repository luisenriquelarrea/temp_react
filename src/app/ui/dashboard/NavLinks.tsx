'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getNavLinks } from '../../api';

const NavLinks = () => {

    const [links, setLinks] = useState([]);

    useEffect(() => {
        getNavLinks()
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