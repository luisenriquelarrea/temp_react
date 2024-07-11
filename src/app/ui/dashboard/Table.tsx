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
import { flipStatus, arrayColumn } from '../../funciones';
import ModalUpdate from '@/app/ui/dashboard/ModalUpdate';
import Filters from '@/app/ui/dashboard/Filters';
import Pagination from "./Pagination";
import { useDownloadExcel } from "react-export-table-to-excel";

const Table = (props: any) => {
    const { getItem } = useLocalStorage();
    const [columns, setColumns] = useState([]);
    const [data, setData] = useState([]);
    const [tableActions, setTableActions] = useState([]);
    const [xls, setXls] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [recordId, setRecordId] = useState(0);
    const tableRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [totalRows, setTotalRows] = useState(0);

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
                if(arrayColumn(data, 'descripcion').includes('xls'))
                    setXls(true);
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
                //setData(setTableToPaginate(data));
                setData(data);
                setTotalRows(Math.ceil(data.length / rowsPerPage));
            })
        }).catch(error => console.error(error));
    }

    const setTableToPaginate = (tableData: any) => {
        const startIndex = (currentPage - 1) * rowsPerPage; 
        const endIndex = startIndex + rowsPerPage; 
        return tableData.slice(startIndex, endIndex); 
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
            <Filters
                seccionMenuId={ props.seccionMenuId }
                seccionMenu={ props.seccionMenu }
                setDataTable={ setData } />
            <div className="table-container">
                <table id="myTable" 
                    className="table is-bordered is-striped is-hoverable is-fullwidth is-narrow" 
                    ref={tableRef}>
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
                        {data.map((record: any) => {
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
            {/*<Pagination 
                currentPage= { currentPage }
                totalRows={ totalRows }
                setCurrentPage={ setCurrentPage }
                setTableToPaginate={ setTableToPaginate }
                dataTable={ data }
                setDataTable={ setData } />*/}
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
                    stateShowModal={ setShowModal }
                    setTable={ setTable } /> 
                : null 
            }
        </>
    );
}

export default Table;