import { useState, useRef } from "react";
import ModalUpdate from '@/app/ui/dashboard/ModalUpdate';
import {
    getById,
    getInputs, 
    updateRecord,
    deleteRecord 
} from '../../api';
import { 
    flipStatus,
    mysqlTimeStamp } from '../../funciones';
import { Accion } from '../../entities';
import { useDownloadExcel } from "react-export-table-to-excel";

const Table = (props: any) => {
    const tableRef = useRef(null);

    const [formdata, setFormData] = useState<any>({});
    const [showModal, setShowModal] = useState(false);
    const [titleModal, setTitleModal] = useState("Modifica registro");
    const [recordId, setRecordId] = useState<any>([]);
    const [record, setRecord] = useState<any>([]);
    const [inputs, setInputs] = useState([]);

    const columns = props.columns;
    const dataTable = props.dataTable;
    const tableActions = props.tableActions;
    const xls = props.xls;

    const recordInactive = {
        backgroundColor: "MistyRose",
    };
    const columnOk = {
        color: "DodgerBlue",
        fontSize: "17px"
    };
    const columnXmark = {
        color: "red",
        fontSize: "17px"
    };
    const columnsStatus = [0, 1];

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
                        setTitleModal("Modifica registro");
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
            props.setTable(props.currentPage);
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
                data.userUpdatedId = props.userId;
                data.updatedAt = mysqlTimeStamp();
                data.status = flipStatus(recordStatus);
                updateRecord(props.seccionMenu, recordId, data).then(response => {
                    if(!response.ok){
                        console.log("Error al modificar registro");
                        console.log(response);
                        return;
                    }
                    response.json().then(data => {
                        props.setTable(props.currentPage);
                    })
                }).catch(error => console.error(error));
            })
        }).catch(error => console.error(error));
    }

    const handleAction = (action: string, record: any) => {
        setFormData({
            'userUpdatedId': props.userId,
            'updatedAt': mysqlTimeStamp()
        });
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
        
        return ( columnsStatus.includes(parseInt(record[columnName])) ) 
        ? (parseInt(record[columnName])) 
            ? <i className="fa fa-circle-check" style={ columnOk }></i> 
            : <i className="fa fa-circle-xmark" style={ columnXmark }></i> 
        : record[columnName];
    }

    const { onDownload } = useDownloadExcel({
        currentTableRef: tableRef.current,
        filename: props.seccionMenu,
        sheet: props.seccionMenu
    })

    return (
        <>
            {
                Boolean(xls)
                ? <button onClick={ onDownload } style={{marginBottom: '10px'}} className="button is-small" >Excel</button>
                : null
            }
            <div className="table-container">
                <table id="myTable" 
                    className="table is-bordered is-striped is-hoverable is-fullwidth is-narrow" 
                    ref={ tableRef }>
                    <thead>
                        <tr>
                            { Object.keys(tableActions).length > 0 
                                ? <th className="no-print">Acciones</th> 
                                : null }
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
                                    { Object.keys(tableActions).length > 0 
                                        ? <td>
                                        {tableActions.map((action: Accion) => {
                                            return(
                                                renderAction(action, record)
                                            );
                                        })}
                                        </td> : null }
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
                Boolean(showModal) 
                ? <ModalUpdate 
                    seccionMenuId={ props.seccionMenuId } 
                    seccionMenu={ props.seccionMenu }
                    titleModal={ titleModal }
                    recordId={ recordId }
                    record={ record }
                    inputs={ inputs }
                    formdata={ formdata }
                    stateShowModal={ setShowModal }
                    setTable={ props.setTable }
                    currentPage={ props.currentPage } /> 
                : null 
            }
        </>
    );
}

export default Table;