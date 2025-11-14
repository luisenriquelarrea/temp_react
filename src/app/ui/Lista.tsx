import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { 
    getInputs, 
    getSeccionMenuListFiltered,
    getNavbarActions,
    getTableActions,
    countFilteredList,
    getById,
    updateRecord,
    deleteRecord
} from '@/app/utils/api';
import {  
    objectClean, 
    flipStatus
} from '@/app/utils/helpers';
import {
    User
} from '@/app/utils/entities';
import Filters from '@/app/ui/Filters';
import ModalUpdate from '@/app/ui/ModalUpdate';
import Pagination from "@/app/ui/Pagination";
import Table from "@/app/ui/Table";
import Navbar from "@/app/ui/Navbar";
import Swal, { SweetAlertOptions } from 'sweetalert2'
import { useDownloadExcel } from "react-export-table-to-excel";
import { Filter, StyledColumns } from "@/app/utils/types";

interface ListaProps {
    user: User;
    seccionMenuId: number;
    seccionMenu: string;
    customFilters?: {[key: string]: {}};
    iconsDisabled?: boolean;
    functions?: { [key: string]: (...args: any) => any },
    setRecordId?: Dispatch<SetStateAction<any>>;
    styledColumns?: StyledColumns;
    noFilters?: boolean;
    noNavbar?: boolean;
    noPagination?: boolean;
};
const Lista = (props: ListaProps) => {
    const tableRef = useRef(null);

    const off = 0;
    const lim = props.noPagination ? 30 : 1000;

    const [inputsFilters, setInputsFilters] = useState([]);
    
    const getFilters = (): Filter => {
        return {
            offset: off,
            limit: lim,
            userId: props.user.userId,
            ...(props.customFilters || {})
        };
    };

    const [filterData, setFilterData] = useState<Filter>(getFilters());
    const [navbarActions, setNavbarActions] = useState([]);
    const [columns, setColumns] = useState([]);
    const [dataTable, setDataTable] = useState([]);
    const [tableActions, setTableActions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(lim);
    const [maxButtons, setMaxButtons] = useState(7);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [paginationButtons, setPaginationButtons] = useState<any>([]);
    const [formdata, setFormData] = useState<any>({});
    const [showModal, setShowModal] = useState(false);
    const [titleModal, setTitleModal] = useState("Modifica registro");
    const [inputs, setInputs] = useState([]);
    const [record, setRecord] = useState({});
    const [recordId, setRecordId] = useState({});
    const [btnFilterDisabled, setBtnFilterDisabled] = useState(false);

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
        const fd = objectClean(filterData);
        const lim = (fd.limit !== undefined) ? fd.limit : limit;
        countFilteredList(props.seccionMenu, fd).then(response => {
            if(!response.ok){
                console.log("Error al obtener count");
                console.log(response);
                return;
            }
            response.json().then(data => {
                const tPages = Math.ceil(parseFloat(String(data / lim)));
                setTotalRecords(data);
                setTotalPages(tPages);
                setPaginationButtons(renderPaginationButtons(tPages));
            })
        }).catch(error => console.error(error));
    }

    const setTable = (offset: number) => {
        const fd = objectClean(filterData);
        if(fd.limit === undefined)
            fd.limit = limit;
        fd.offset = offset;
        getSeccionMenuListFiltered(props.seccionMenu, fd).then(response => {
            if(!response.ok){
                console.log("Error al obtener lista filtrada");
                console.log(response);
                return;
            }
            response.json().then(data => {
                setDataTable(data);
                setBtnFilterDisabled(false);
            })
        }).catch(error => console.error(error));
    }

    const update = (recordId: number) => {
        setRecordId(recordId);
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
    
    const eliminar = async (recordId: number) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'No, cancelar',
            reverseButtons: true
        });
        if (result.isConfirmed) {
            try {
                const response = await deleteRecord(props.seccionMenu, recordId);
                if (!response.ok) {
                    console.log(response);
                    const httpStatus = response.status;
                    if (httpStatus === 422) {
                        const data = await response.json();
                        await Swal.fire({
                        title: 'Atención!',
                        text: data.message,
                        icon: 'warning',
                        confirmButtonText: 'OK'
                        });
                        return;
                    }
                    await Swal.fire({
                        title: 'Atención!',
                        text: `(${httpStatus}) Ocurrió un error, contacte a su equipo de sistemas.`,
                        icon: "warning",
                        confirmButtonText: 'OK'
                    });
                    return;
                }
                setTable(currentPage);
            } catch (error) {
                console.error(error);
                await Swal.fire({
                    title: 'Error',
                    text: 'Ocurrió un error inesperado. Intente nuevamente.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }
    };

    const changeStatus = (recordId: number) => {
        getById(props.seccionMenu, recordId).then(response => {
            if(!response.ok){
                console.log("Error al obtener registro");
                console.log(response);
                return;
            }
            response.json().then(data => {
                data.userUpdatedId = props.user.userId;
                data.status = flipStatus(data.status);
                updateRecord(props.seccionMenu, recordId, data).then(response => {
                    if(!response.ok){
                        console.log("Error al modificar registro");
                        console.log(response);
                        return;
                    }
                    response.json().then(data => {
                        setTable(currentPage);
                    })
                }).catch(error => console.error(error));
            })
        }).catch(error => console.error(error));
    }

    const handleAction = (callMethod: string, recordId: number): void => {
        setFormData({
            userUpdatedId: props.user.userId
        });
        if(props.setRecordId)
            props.setRecordId(recordId);
        const customActions = props.functions;
        if(customActions && customActions[callMethod]){
            customActions[callMethod](recordId);
            return;
        }
        if(functions[callMethod]){
            functions[callMethod](recordId);
            return;
        }
    }

    const xls = () => { 
        onDownload();
    }

    const { onDownload } = useDownloadExcel({
        currentTableRef: tableRef.current,
        filename: props.seccionMenu,
        sheet: props.seccionMenu
    })

    const functions: {[functionName: string]: (...args: any[]) => any} = {
        changeStatus: changeStatus,
        eliminar: eliminar,
        update: update,
        xls: xls
    };

    useEffect(() => {
        if(!props.noFilters)
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
        if(!props.noNavbar)
            getNavbarActions(props.seccionMenuId, props.user.grupo).then(response => {
                if(!response.ok){
                    console.log("Error al obtener navbarActions");
                    console.log(response);
                    return;
                }
                response.json().then(data => {
                    setNavbarActions(data);
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
                setTableActions(data);
            })
        }).catch(error => console.error(error));
        if(!props.noPagination)
            setCountFilteredList();
        setTable(0);
    }, []);

    return (
        <>
            {
                !props.noPagination ?
                    <Filters
                        userId={ props.user.userId }
                        seccionMenuId={ props.seccionMenuId }
                        seccionMenu={ props.seccionMenu }
                        inputsFilters={ inputsFilters }
                        setFilterData={ setFilterData }
                        setTable={ setTable }
                        setCountFilteredList={ setCountFilteredList }
                        btnFilterDisabled={ btnFilterDisabled }
                        setBtnFilterDisabled={ setBtnFilterDisabled } />
                : null
            }
            {
                !props.noNavbar ? 
                    <Navbar
                        navbarActions={ navbarActions }
                        functions={ functions }
                        btnFilterDisabled={ btnFilterDisabled }
                        setBtnFilterDisabled={ setBtnFilterDisabled } />
                : null
            }
            <Table
                seccionMenu={ props.seccionMenu } 
                columns={ columns } 
                dataTable={ dataTable }
                tableActions={ tableActions }
                tableRef={ tableRef }
                setFormData={ setFormData }
                handleAction={ handleAction }
                iconsDisabled={ props.iconsDisabled }
                styledColumns={ props.styledColumns } />
            {
                !props.noPagination ? 
                    <Pagination 
                        currentPage= { currentPage }
                        setCurrentPage={ setCurrentPage }
                        limit={ limit }
                        totalRecords={ totalRecords }
                        totalPages={ totalPages }
                        paginationButtons={ paginationButtons }
                        setPaginationButtons={ setPaginationButtons }
                        renderPaginationButtons={ renderPaginationButtons }
                        renderPaginationButtonsReverse={ renderPaginationButtonsReverse }
                        setTable={ setTable } />
                : null
            }
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
                    setTable={ setTable }
                    currentPage={ currentPage } /> 
                : null 
            }
        </>
    );
}

export default Lista;