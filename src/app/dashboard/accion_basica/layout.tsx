"use client";

import { useState, useEffect } from "react";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import { currentSeccionMenu } from '@/app/utils/helpers';
import { User } from '@/app/utils/entities';
import {
    getSeccionMenu, 
    getBreadcrumbs,
    validateUserIsActive
} from '@/app/utils/api';
import Breadcrumbs from "@/app/ui/Breadcrumbs";

export default function Layout({ children }: { children: React.ReactNode }) {
    const { getItem } = useLocalStorage();
    
    const [user, setUser] = useState({});
    const [seccionMenu, setSecccionMenu] = useState("");
    const [navbarLabel, setNavbarLabel] = useState("");
    const [breadcrumbs, setBreadcrumbs] = useState([]);

    useEffect(() => {
        setDependencies();
    }, []);


    const setDependencies = async () => {
        const user: User = JSON.parse(String(getItem("user")));

        /*
         * Validate user is active
         */
        const validateUserResponse = await validateUserIsActive(String(user.username));
        if(!validateUserResponse.ok){
            window.location.href = '/';
        }
        setUser(user);

        /*
         * Get current seccion menu data
         */
        const sm = currentSeccionMenu(window.location.pathname); if( sm === null) return;
        if( sm === null)
            return;
        setSecccionMenu(sm);
        const seccionMenuResponse = await getSeccionMenu(sm);
        if(!seccionMenuResponse.ok){
            console.log("Error al obtener seccionMenu");
            console.log(seccionMenuResponse);
            return;
        }
        const seccionMenuData = await seccionMenuResponse.json();
        setNavbarLabel(seccionMenuData.navbarLabel);

        /*
         * Get breadcrumbs for current seccion menu
         */
        const breadcrumbsResponse = await getBreadcrumbs(seccionMenuData.id, user.grupo);
        if(!breadcrumbsResponse.ok){
            console.log("Error al obtener breadcrumbs");
            console.log(breadcrumbsResponse);
            return;
        }
        const breadcrumbsData = await breadcrumbsResponse.json();
        setBreadcrumbs(breadcrumbsData);
    }

    return (
        <>
            <Breadcrumbs 
                seccionMenu={ seccionMenu }
                navbarLabel={ navbarLabel } 
                breadcrumbs={ breadcrumbs } />
            <main>{children}</main>
        </>
    );
}