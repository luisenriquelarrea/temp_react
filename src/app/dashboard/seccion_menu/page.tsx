"use client"

import { memo } from "react";
import { useState, useEffect } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import Alta from '@/app/ui/dashboard/Alta';
import Lista from '@/app/ui/dashboard/Lista';
import { arrayColumn, currentSeccionMenu } from '../../funciones';
import { User, Accion } from '../../entities';
import {
    getSeccionMenu, 
    getBreadcrumbs, 
    validateUserIsActive 
} from '../../api';

const Page = () => {
    const { getItem } = useLocalStorage();
    const [user, setUser] = useState({});
    const [initFormAlta, setInitFormAlta] = useState({});
    const [seccionMenuId, setSecccionMenuId] = useState(0);
    const [seccionMenu, setSecccionMenu] = useState("");
    const [navbarLabel, setNavbarLabel] = useState("");
    const [alta, setAlta] = useState(false);
    const [lista, setLista] = useState(false);
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    const [recordId, setRecordId] = useState(0);

    useEffect(() => {
        const user: User = JSON.parse(String(getItem("user")));
        setInitFormAlta({
            'status':1,
            'userCreatedId': user.userId
        });
        validateUserIsActive(String(user.username)).then(response => {
            if(!response.ok){
                window.location.href = '/';
            }
            setUser(user);
            const sm = currentSeccionMenu(window.location.pathname);
            setSecccionMenu(sm);
            getSeccionMenu(sm).then(response => {
                if(!response.ok){
                    console.log("Error al obtener seccionMenu");
                    console.log(response);
                    return;
                }
                response.json().then(data => {
                    setNavbarLabel(data.navbarLabel);
                    const seccionMenuId = data.id;
                    setSecccionMenuId(seccionMenuId);
                    getBreadcrumbs(seccionMenuId, user.grupo).then(response => {
                        if(!response.ok){
                            console.log("Error al obtener breadcrumbs");
                            console.log(response);
                            return;
                        }
                        response.json().then(data => {
                            let tmp: any = {};
                            arrayColumn(data, 'callMethod').forEach(key => {
                                tmp[key] = false;
                            });
                            if(arrayColumn(data, 'descripcion').includes('read'))
                                read();
                            setBreadcrumbs(data);
                        })
                    }).catch(error => console.error(error));
                })
            }).catch(error => console.error(error));
        }).catch(error => console.error(error));
    }, []);

    const create = () => {
        if(Boolean(alta) === true)
            return;
        setLista(false);
        setAlta(!alta);
    }

    const read = () => {
        if(Boolean(lista) === true)
            return;
        setAlta(false);
        setLista(!lista);
    }

    return(
        <>
            <nav className="breadcrumb no-print" aria-label="breadcrumbs">
                <ul>
                    <li><a className="my-bread" style={{color: 'black'}}><b>{ navbarLabel }</b></a></li>
                    {breadcrumbs.map((breadcrumb: Accion) => {
                        return(
                            <li key={ breadcrumb.descripcion }>
                                <a 
                                    onClick={() => eval(String(breadcrumb.callMethod))() }
                                    key={ breadcrumb.descripcion } >
                                    <i className={`fa fa-${breadcrumb.icon} fa-fw`}></i>
                                    {breadcrumb.label}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </nav>
            { Boolean(alta) ? <Alta 
                initFormAlta={ initFormAlta }
                seccionMenuId={ seccionMenuId } 
                seccionMenu={ seccionMenu } /> : null }
            { Boolean(lista) ? <Lista
                user={ user }
                seccionMenuId={ seccionMenuId } 
                seccionMenu={ seccionMenu }
                setRecordId={ setRecordId }
                recordId={ recordId } /> : null }
        </>
    );
}

export default memo(Page);