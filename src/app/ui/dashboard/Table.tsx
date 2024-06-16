import { useState, useEffect, useRef } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { 
    getInputs, 
    getSeccionMenuList, 
    getTableActions, 
    getById, 
    updateRecord,
    deleteRecord 
} from '../../api';
import { User, Accion } from '../../entities';
import { flipStatus } from '../../funciones';
import ModalUpdate from '@/app/ui/dashboard/ModalUpdate';
import { useDownloadExcel } from "react-export-table-to-excel";

const Table = (props: any) => {
    const { getItem } = useLocalStorage();
    const [columns, setColumns] = useState([]);
    const [data, setData] = useState([]);
    const [tableActions, setTableActions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [recordId, setRecordId] = useState(0);
    const tableRef = useRef(null);

    const recordInactive = {
        backgroundColor: "#ffe4f3"
    };

    useEffect(() => {
        getInputs(props.seccionMenuId, 'lista').then(response => {
            if(!response.ok){
                console.log("Error al obtener inputs");
                console.log(response);
                return;
            }
            response.json().then(data => {
                setColumns(data);
            })
        }).catch(error => console.error(error));

        const user: User = JSON.parse(String(getItem("user")));
        getTableActions(props.seccionMenuId, user.grupo).then(response => {
            if(!response.ok){
                console.log("Error al obtener tableActions");
                console.log(response);
                return;
            }
            response.json().then(data => {
                setTableActions(data);
            })
        }).catch(error => console.error(error));

        setTable();
    }, []);

    const setTable = () => {
        getSeccionMenuList(props.seccionMenu).then(response => {
            if(!response.ok){
                console.log("Error al obtener "+props.seccionMenu);
                console.log(response);
                return;
            }
            response.json().then(data => {
                console.log(data);
                setData(data);
            })
        }).catch(error => console.error(error));
    }

    const renderAction = (action: Accion, record: any) => {
        if(action.callMethod !== "changeStatus")
            return <i 
                key={ action.id } 
                title={ action.label }
                className={`fa fa-${action.icon} fa-fw`}
                onClick={() => handleAction(String(action.callMethod), record) } >

                </i>
        if(action.descripcion === "deactivate" && parseInt(record.status) === 0)
            return null;
        if(action.descripcion === "deactivate" && parseInt(record.status) === 1)
            return <i 
                key={ action.id } 
                title={ action.label }
                className={`fa fa-pause fa-fw`}
                onClick={() => handleAction(String(action.callMethod), record) } >

                </i>
        if(action.descripcion === "activate" && parseInt(record.status) === 0)
            return <i 
                key={ action.id } 
                title={ action.label }
                className={`fa fa-play fa-fw`}
                onClick={() => handleAction(String(action.callMethod), record) } >

                </i>
        return null;
    }

    const handleAction = (action: string, record: any) => {
        if(action === "changeStatus")
            changeStatus(record.id, record.status);
        if(action === "eliminar")
            eliminar(record.id);
        if(action === "update")
            update(record.id);
    }

    const update = (recordId: number) => {
        setRecordId(recordId);
        setShowModal(true);
    }
    
    const eliminar = (recordId: number) => {
        deleteRecord(props.seccionMenu, recordId).then(response => {
            if(!response.ok){
                console.log("Error al eliminar registro");
                console.log(response);
                return;
            }
            setTable();
        }).catch(error => console.error(error));
    }

    const changeStatus = (recordId: number, recordStatus: number) => {
        getById(props.seccionMenu, recordId).then(response => {
            if(!response.ok){
                console.log("Error al obtener registro");
                console.log(response);
                return;
            }
            response.json().then(data => {
                data.status = flipStatus(recordStatus);
                updateRecord(props.seccionMenu, recordId, data).then(response => {
                    if(!response.ok){
                        console.log("Error al modificar registro");
                        console.log(response);
                        return;
                    }
                    response.json().then(data => {
                        setTable();
                    })
                }).catch(error => console.error(error));
            })
        }).catch(error => console.error(error));
    }

    const { onDownload } = useDownloadExcel({
        currentTableRef: tableRef.current,
        filename: props.seccionMenu,
        sheet: props.seccionMenu
    })

    return (
        <>
        <div className="table-container">
            <table id="myTable" className="table is-bordered display" ref={tableRef}>
                <thead>
                    <tr>
                        {columns.map((column: any) => {
                            return(
                                <th key={ column.id }> { column.inputLabel } </th>
                            );
                        })}
                        <th className="no-print">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((record: any) => {
                        return(
                            <tr key={ record.id }>
                                {columns.map((column: any) => {
                                    const columnName: string = column.inputName;
                                    return(
                                        <td 
                                            key={ column.id } 
                                            style={ parseInt(record.status) === 0 ? recordInactive : {} }> 
                                            { 
                                                typeof(record[columnName]) === 'object' 
                                                ? record[columnName][column.inputId] 
                                                : record[columnName] 
                                            } 
                                        </td>
                                    );
                                })}
                                <td>
                                    {tableActions.map((action: Accion) => {
                                        return(
                                            renderAction(action, record)
                                        );
                                    })}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table> 
        </div>
        <button onClick={ onDownload } className="button is-info" >Descargar excel</button>
        { 
            Boolean(showModal) ? <ModalUpdate 
                seccionMenuId={ props.seccionMenuId } 
                seccionMenu={ props.seccionMenu }
                recordId={ recordId }
                stateShowModal={ setShowModal }
                setTable={ setTable } /> : null 
        }
        </>
    );
}

export default Table;