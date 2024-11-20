import { useState, useEffect } from "react";
import { 
    getInputs,
    getById
} from '@/app/api';
import Table from "./Table";

const Encabezado = (props: any) => {
    const [columns, setColumns] = useState([]);
    const [dataTable, setDataTable] = useState<any>([]);

    useEffect(() => {
        getInputs(props.seccionMenuId, 'encabezado').then(response => {
            if(!response.ok){
                console.log("Error al obtener inputs encabezado");
                console.log(response);
                return;
            }
            response.json().then(data => {
                setColumns(data);
            })
        }).catch(error => console.error(error));

        getById(props.seccionMenu, props.recordId).then(response => {
            if(!response.ok){
                console.log("Error al obtener registro");
                console.log(response);
                return;
            }
            response.json().then(data => {
                setDataTable([data]);
            })
        }).catch(error => console.error(error));
    }, []);

    return (
        <>
            <Table 
                columns={ columns } 
                dataTable={ dataTable }
                tableActions={ {} }
                xls={ false } />
        </>
    );
}

export default Encabezado;