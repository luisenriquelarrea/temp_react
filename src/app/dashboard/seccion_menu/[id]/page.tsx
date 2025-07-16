"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getById, getSeccionMenu } from "@/app/utils/api";
import Show from "./show";
import { currentSeccionMenu } from "@/app/utils/helpers";
import { User } from '@/app/utils/entities';
import { useLocalStorage } from "@/app/hooks/useLocalStorage";

interface Props {
    params: {
        id: number;
    };
}

export default function ClientWrapper({ params }: Props) {
    const { getItem } = useLocalStorage();
    const pathname = usePathname();
    const [user, setUser] = useState({});
    const [seccionMenuId, setSecccionMenuId] = useState(0);
    const [seccionMenu, setSecccionMenu] = useState("");
    const [record, setRecord] = useState(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setDependencies();
    }, [pathname, params.id]);

    const setDependencies = async () => {
        const user: User = JSON.parse(String(getItem("user")));
        setUser(user);

        /*
        * Get current seccion menu data
        */
        const sm = currentSeccionMenu(window.location.pathname); if( sm === null) return;
        if(sm === null){
            setError("Error en la dirección solicitada.");
            return;
        }
        setSecccionMenu(sm);
        const seccionMenuResponse = await getSeccionMenu(sm);
        if(!seccionMenuResponse.ok){
            setError("Error al obtener seccionMenu.");
            console.log("Error al obtener seccionMenu");
            console.log(seccionMenuResponse);
            return;
        }
        const seccionMenuData = await seccionMenuResponse.json();
        setSecccionMenuId(seccionMenuData.id);

        /*
         * Get record
         */
        const recordResponse = await getById(sm, params.id);
        if(!recordResponse.ok){
            setError("Error al obtener registro");
            console.log("Error al obtener registro");
            console.log(recordResponse);
            return;
        }
        const data = await recordResponse.json();
        setRecord(data);
    }

    if (error) return <p>{error}</p>;
    if (!record) return <p>Cargando...</p>;

    return (
        <Show 
            user={ user }
            seccionMenuId={ seccionMenuId }
            seccionMenu={ seccionMenu }
            record={ record } />
    );
}