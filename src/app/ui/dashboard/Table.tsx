import { useState, useRef } from "react";
import ModalUpdate from '@/app/ui/dashboard/ModalUpdate';
import {
    getById,
    getInputs, 
    updateRecord,
    deleteRecord 
} from '../../api';
import { flipStatus } from '../../funciones';
import { Accion } from '../../entities';
import { useDownloadExcel } from "react-export-table-to-excel";

const Table = (props: any) => {
    const tableRef = useRef(null);

    const [showModal, setShowModal] = useState(false);
    const [recordId, setRecordId] = useState<any>([]);
    const [record, setRecord] = useState<any>([]);
    const [inputs, setInputs] = useState([]);

    const columns = props.columns;
    const dataTable = props.dataTable;
    const tableActions = props.tableActions;
    const xls = props.xls;

    const recordInactive = {
        backgroundColor: "#ffe4f3"
    };

    const update = (recordId: number) => {
        getById(props.seccionMenu, recordId).then(response => {
            if(!response.ok){
                console.log("Error al obtener registro");
                console.log(response);
                return;
            }
            response.json().then(data => {
                setRecord(data);
                getInputs(props.seccionMenuId, 'modifica').then(response => {
                    if(!response.ok){
                        console.log("Error al obtener inputs");
                        console.log(response);
                        return;
                    }
                    response.json().then(data => {
                        setRecordId(recordId);
                        setInputs(data);
                        setShowModal(true);
                    })
                }).catch(error => console.error(error));
            })
        }).catch(error => console.error(error));
    }
    
    const eliminar = (recordId: number) => {
        deleteRecord(props.seccionMenu, recordId).then(response => {
            if(!response.ok){
                console.log("Error al eliminar registro");
                console.log(response);
                return;
            }
            props.setTable();
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
                        props.setTable();
                    })
                }).catch(error => console.error(error));
            })
        }).catch(error => console.error(error));
    }

    const handleAction = (action: string, record: any) => {
        if(action === "changeStatus")
            changeStatus(record.id, record.status);
        if(action === "eliminar")
            eliminar(record.id);
        if(action === "update")
            update(record.id);
    }

    const renderAction = (action: Accion, record: any) => {
        if(action.callMethod === "xls")
            return null;
        if(action.callMethod !== "changeStatus")
            return <i 
                key={ action.id } 
                title={ action.label }
                className={`fa fa-${action.icon} fa-fw`}
                style={{"fontSize": '14px'}}
                onClick={() => handleAction(String(action.callMethod), record) } >

                </i>
        if(action.descripcion === "deactivate" && parseInt(record.status) === 0)
            return null;
        if(action.descripcion === "deactivate" && parseInt(record.status) === 1)
            return <i 
                key={ action.id } 
                title={ action.label }
                className={`fa fa-pause fa-fw`}
                style={{"fontSize": '14px'}}
                onClick={() => handleAction(String(action.callMethod), record) } >

                </i>
        if(action.descripcion === "activate" && parseInt(record.status) === 0)
            return <i 
                key={ action.id } 
                title={ action.label }
                className={`fa fa-play fa-fw`}
                style={{"fontSize": '14px'}}
                onClick={() => handleAction(String(action.callMethod), record) } >

                </i>
        return null;
    }

    const renderColumn = (record: any, column: any) => {
        const columnName: string = column.inputName;
        if(columnName.includes(".")){
            const deepColumns = columnName.split(".");
            var deepRecord = record;
            deepColumns.forEach(deepColumn => {
                if(typeof(deepRecord[deepColumn]) === 'object' && String(deepRecord[deepColumn]) !== "null"){
                    deepRecord = deepRecord[deepColumn]
                }
            });
            return deepRecord[column.inputId];
        }
        if(typeof(record[columnName]) === 'object' && String(record[columnName]) !== "null"){
            return record[columnName][column.inputId];
        }
        return record[columnName];
    }

    const { onDownload } = useDownloadExcel({
        currentTableRef: tableRef.current,
        filename: props.seccionMenu,
        sheet: props.seccionMenu
    })

    return (
        <>
            <div className="table-container">
                <table id="myTable" 
                    className="table is-bordered is-striped is-hoverable is-fullwidth is-narrow" 
                    ref={ tableRef }>
                    <thead>
                        <tr>
                            <th className="no-print">Acciones</th>
                            {columns.map((column: any) => {
                                return(
                                    <th key={ column.id }> { column.inputLabel } </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {dataTable.map((record: any) => {
                            return(
                                <tr key={ record.id }>
                                    <td>
                                        {tableActions.map((action: Accion) => {
                                            return(
                                                renderAction(action, record)
                                            );
                                        })}
                                    </td>
                                    {columns.map((column: any) => {
                                        return(
                                            <td 
                                                key={ column.id } 
                                                style={ parseInt(record.status) === 0 ? recordInactive : {} }> 
                                                { 
                                                    renderColumn(record, column)
                                                } 
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {
                Boolean(xls)
                ? <button onClick={ onDownload } className="button" >Descargar excel</button>
                : null
            }
            { 
                Boolean(showModal) 
                ? <ModalUpdate 
                    seccionMenuId={ props.seccionMenuId } 
                    seccionMenu={ props.seccionMenu }
                    recordId={ recordId }
                    record={ record }
                    inputs={ inputs }
                    stateShowModal={ setShowModal }
                    setTable={ props.setTable } /> 
                : null 
            }
        </>
    );
}

export default Table;