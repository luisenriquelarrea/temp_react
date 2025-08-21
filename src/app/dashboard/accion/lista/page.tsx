"use client";

import { useState, useEffect } from "react";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import { User } from "@/app/utils/entities";
import { currentSeccionMenu, toStyledColumns } from '@/app/utils/helpers';
import {
    getSeccionMenu,
    getSeccionMenuListFiltered
} from '@/app/utils/api';
import Lista from "@/app/ui/Lista";
import { StyledColumns } from "@/app/utils/types";

export default function Page() {
    const { getItem } = useLocalStorage();
    const [user, setUser] = useState({});
    const [seccionMenuId, setSecccionMenuId] = useState(0);
    const [seccionMenu, setSecccionMenu] = useState("");
    const [styledColumns, setStyledColumns] = useState<StyledColumns>({});
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
        
        getStyledColumns(seccionMenuData.id);

        setDocumentIsReady(true);
    }

    const getStyledColumns = async (seccionMenuId: number) => {
        let filter = {
            offsset: 0,
            limit: 1000,
            seccionMenu: {
                id: seccionMenuId
            }
        };
        const styledColumnResponse = await getSeccionMenuListFiltered("styled_column", filter);
        if (!styledColumnResponse.ok) {
            console.log(styledColumnResponse);
            return;
        }
        const styledColumnArray: any[] = await styledColumnResponse.json();
        if (styledColumnArray.length !== 0)
            setStyledColumns(toStyledColumns(styledColumnArray));
    }
    
    return (
        <>
        {
            Boolean(documentIsReady) ?
                <Lista
                    user={ user }
                    seccionMenuId={ seccionMenuId } 
                    seccionMenu={ seccionMenu }
                    styledColumns={ styledColumns }
                    iconsDisabled={ true } />
            : null
        }
        </>
    );
}