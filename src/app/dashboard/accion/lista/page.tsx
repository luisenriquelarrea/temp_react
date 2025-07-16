"use client";

import { useState, useEffect } from "react";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import { User } from "@/app/utils/entities";
import { currentSeccionMenu } from '@/app/utils/helpers';
import {
    getSeccionMenu
} from '@/app/utils/api';
import Lista from "@/app/ui/Lista";

export default function Page() {
    const { getItem } = useLocalStorage();
    const [user, setUser] = useState({});
    const [seccionMenuId, setSecccionMenuId] = useState(0);
    const [seccionMenu, setSecccionMenu] = useState("");
    const [documentIsReady, setDocumentIsReady] = useState(false);

    useEffect(() => {
        setDependencies();
    }, []);

    const setDependencies = async () => {
        const user: User = JSON.parse(String(getItem("user")));
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
        setSecccionMenuId(seccionMenuData.id);

        setDocumentIsReady(true);
    }
    
    return (
        <>
        {
            Boolean(documentIsReady) ?
                <Lista
                    user={ user }
                    seccionMenuId={ seccionMenuId } 
                    seccionMenu={ seccionMenu }
                    iconsDisabled={ true } />
            : null
        }
        </>
    );
}