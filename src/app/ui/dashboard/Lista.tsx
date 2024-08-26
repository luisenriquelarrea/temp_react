import { useState, useEffect } from "react";
import { 
    getInputs, 
    getSeccionMenuListFiltered,
    getTableActions,
    countFilteredList,
    getById,
    updateRecord,
    deleteRecord
} from '../../api';
import { 
    arrayColumn, 
    objectClean, 
    flipStatus, 
    mysqlTimeStamp } from '../../funciones';
import Filters from './Filters';
import ModalUpdate from './ModalUpdate';
import Pagination from "./Pagination";
import Table from "./Table";

const Lista = (props: any) => {
    const off = 0;
    const lim = 30;

    const [inputsFilters, setInputsFilters] = useState([]);
    const [filterData, setFilterData] = useState({
        userId: props.user.userId,
        offset: off,
        limit: lim
    });
    const [columns, setColumns] = useState([]);
    const [dataTable, setDataTable] = useState([]);
    const [tableActions, setTableActions] = useState([]);
    const [xls, setXls] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(lim);
    const [maxButtons, setMaxButtons] = useState(7);
    const [totalPages, setTotalPages] = useState(0);
    const [paginationButtons, setPaginationButtons] = useState<any>([]);
    const [formdata, setFormData] = useState<any>({});
    const [showModal, setShowModal] = useState(false);
    const [titleModal, setTitleModal] = useState("Modifica registro");
    const [inputs, setInputs] = useState([]);
    const [record, setRecord] = useState({});

    useEffect(() => {
        getInputs(props.seccionMenuId, 'filtro').then(response => {
            if(!response.ok){
                console.log("Error al obtener inputs filtro");
                console.log(response);
                return;
            }
            response.json().then(data => {
                setInputsFilters(data);
            })
        }).catch(error => console.error(error));
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
        getTableActions(props.seccionMenuId, props.user.grupo).then(response => {
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
        setCountFilteredList();
        setTable(0);
    }, []);

    const renderPaginationButtons = (tPages: number) => {
        var i = 2;
        var buttons: any = [];
        if(tPages - i  < 1)
            return buttons;
        do{
            buttons.push(i++);
        }while(i <= maxButtons && i < tPages);
        return buttons;
    }

    const renderPaginationButtonsReverse = (tPages: number) => {
        if(maxButtons >= tPages)
            return renderPaginationButtons(tPages);
        var i = tPages - maxButtons;
        if(i === 1) i++;
        var buttons: any = [];
        var j = 1;
        do{
            buttons.push(i++);
            j++;
        }while(j <= maxButtons && i < tPages);
        return buttons;
    }

    const setCountFilteredList = () => {
        countFilteredList(props.seccionMenu, objectClean(filterData)).then(response => {
            if(!response.ok){
                console.log("Error al obtener count");
                console.log(response);
                return;
            }
            response.json().then(data => {
                const tPages = Math.ceil(parseFloat(String(data / limit)));
                setTotalPages(tPages);
                setPaginationButtons(renderPaginationButtons(tPages));
            })
        }).catch(error => console.error(error));
    }

    const setTable = (offset: number) => {
        filterData.offset = offset;
        getSeccionMenuListFiltered(props.seccionMenu, objectClean(filterData)).then(response => {
            if(!response.ok){
                console.log("Error al obtener lista filtrada");
                console.log(response);
                return;
            }
            response.json().then(data => {
                setDataTable(data);
            })
        }).catch(error => console.error(error));
    }

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

    const changeStatus = (recordId: number) => {
        getById(props.seccionMenu, recordId).then(response => {
            if(!response.ok){
                console.log("Error al obtener registro");
                console.log(response);
                return;
            }
            response.json().then(data => {
                data.userUpdatedId = props.userId;
                data.updatedAt = mysqlTimeStamp();
                data.status = flipStatus(data.status);
                updateRecord(props.seccionMenu, props.recordId, data).then(response => {
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

    const functions = {
        changeStatus: changeStatus,
        eliminar: eliminar,
        update: update
    };

    return (
        <>
            <Filters
                seccionMenuId={ props.seccionMenuId }
                seccionMenu={ props.seccionMenu }
                inputsFilters={ inputsFilters }
                setFilterData={ setFilterData }
                setTable={ setTable }
                setCountFilteredList={ setCountFilteredList } />
            <Table
                userId={ props.user.userId }
                seccionMenuId={ props.seccionMenuId }
                seccionMenu={ props.seccionMenu } 
                columns={ columns } 
                dataTable={ dataTable }
                tableActions={ tableActions }
                setTable={ setTable }
                currentPage={ currentPage }
                xls={ xls }
                setRecordId={ props.setRecordId }
                setFormData={ setFormData }
                functions={ functions } />
            <Pagination 
                currentPage= { currentPage }
                setCurrentPage={ setCurrentPage }
                limit={ limit }
                maxButtons={ maxButtons }
                totalPages={ totalPages }
                paginationButtons={ paginationButtons }
                setPaginationButtons={ setPaginationButtons }
                renderPaginationButtons={ renderPaginationButtons }
                renderPaginationButtonsReverse={ renderPaginationButtonsReverse }
                setFilterData={ setFilterData }
                setTable={ setTable } />
            { 
                Boolean(showModal) 
                ? <ModalUpdate 
                    seccionMenuId={ props.seccionMenuId } 
                    seccionMenu={ props.seccionMenu }
                    titleModal={ titleModal }
                    recordId={ props.recordId }
                    record={ record }
                    inputs={ inputs }
                    formdata={ formdata }
                    stateShowModal={ setShowModal }
                    setTable={ setTable }
                    currentPage={ currentPage } /> 
                : null 
            }
        </>
    );
}

export default Lista;