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
    flipStatus,
    castNullToString
} from '@/app/utils/helpers';
import {
    User
} from '@/app/utils/entities';
import Filters from './Filters';
import ModalUpdate from './ModalUpdate';
import Pagination from "./Pagination";
import Table from "./Table";
import Navbar from "./Navbar";
import Swal from 'sweetalert2'
import { useDownloadExcel } from "react-export-table-to-excel";
import { Filter, MessageBoxT, StyledColumns } from "@/app/utils/types";

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
    noActions?: boolean;
    notifyParent?: (...args: any) => any;
};
const Lista = (props: ListaProps) => {
    const tableRef = useRef(null);

    const off = 0;
    const lim = props.noPagination ?? true ? 30 : 1000;

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
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(lim);
    const [maxButtons, setMaxButtons] = useState<number>(7);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [paginationButtons, setPaginationButtons] = useState<any>([]);
    const [formdata, setFormData] = useState<any>({});
    const [showModal, setShowModal] = useState<boolean>(false);
    const [titleModal, setTitleModal] = useState("Modifica registro");
    const [inputs, setInputs] = useState([]);
    const [record, setRecord] = useState<{[key: string]: any}>({});
    const [recordId, setRecordId] = useState({});
    const [btnFilterDisabled, setBtnFilterDisabled] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

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
    
    const eliminar = async (recordId: number): Promise<boolean> => {
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
                const contentType = response.headers.get("content-type") || "";
                const isJson = contentType.includes("application/json");
                    
                // Read the response body once as text
                const rawResponse = await response.text();
                    
                // Attempt to parse JSON if applicable
                let data = null;
                
                if (isJson) {
                    try {
                        data = JSON.parse(rawResponse);
                    } catch (jsonError) {
                        console.warn("Failed to parse JSON from response:", jsonError);
                    }
                }
                    
                // Handle errors according to response.ok and parsed data
                if (!response.ok) {
                    console.log(response);
                    const httpStatus = response.status.toString();
                
                    if (httpStatus === "500") {
                        await Swal.fire({
                            title: 'Atención!',
                            text: data.message,
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                        return false;
                    } else if (data?.message) {
                        await Swal.fire({
                            title: 'Atención!',
                            text: data.message,
                            icon: 'warning',
                            confirmButtonText: 'OK'
                        });
                        return false;
                    } else {
                        await Swal.fire({
                            title: 'Atención!',
                            text: data.message,
                            icon: 'error',
                            confirmButtonText: `(${httpStatus}) ${rawResponse || "Error desconocido"}`
                        });
                        return false;
                    }
                }
                setTable(currentPage);
                return true;  
            } catch (error) {
                console.error(error);
                await Swal.fire({
                    title: 'Error',
                    text: 'Ocurrió un error de red. Intente nuevamente.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                return false;
            }
        }
        return false;
    };

    const changeStatus = async (recordId: number): Promise<boolean> => {
        try {
            const responseGet = await getById(props.seccionMenu, recordId);
            if (!responseGet.ok) {
                console.error(responseGet);
                await Swal.fire({
                    title: 'Error',
                    text: 'Ocurrió un error inesperado. Intente nuevamente.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                return false;
            }
            const data = await responseGet.json();
            data.userUpdatedId = props.user.userId;
            data.status = flipStatus(data.status);

            const responseUpdate = await updateRecord(props.seccionMenu, recordId, data);
            if (!responseUpdate.ok) {
                console.error(responseUpdate);
                await Swal.fire({
                    title: 'Error',
                    text: 'Ocurrió un error inesperado. Intente nuevamente.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                return false;
            }

            setTable(currentPage);

            return true;
        } catch (error) {
            console.error(error);
            await Swal.fire({
                title: 'Error',
                text: 'Ocurrió un error de red. Intente nuevamente.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return false;
        }
    };

    const performUpdate = async (): Promise<MessageBoxT> => {
        const updatedRecord = { ...record, ...formdata };
        try {
            const response = await updateRecord(props.seccionMenu, record.id, updatedRecord);
            const contentType = response.headers.get("content-type") || "";
            const isJson = contentType.includes("application/json");
                
            // Read the response body once as text
            const rawResponse = await response.text();
                
            // Attempt to parse JSON if applicable
            let data = null;
            
            if (isJson) {
                try {
                    data = JSON.parse(rawResponse);
                } catch (jsonError) {
                    console.warn("Failed to parse JSON from response:", jsonError);
                }
            }
                
            // Handle errors according to response.ok and parsed data
            if (!response.ok) {
                console.log(response);
                const httpStatus = response.status.toString();
            
                if (httpStatus === "500") {
                    return {
                        messageType: "danger",
                        message: "Ocurrió un error inesperado, contacta a tu equipo de sistemas."
                    };
                } else if (data?.message) {
                    return {
                        messageType: "warning",
                        message: `(${httpStatus}) ${data.message}`
                    };
                } else {
                    return {
                        messageType: "warning",
                        message: `(${httpStatus}) ${rawResponse || "Error desconocido"}`
                    };
                }
            }
            setTable(currentPage);
    
            // Determine the message to show from rawResponse text
            const message = castNullToString(rawResponse) !== "" && !isJson ? rawResponse : "Éxito al guardar registro.";
                
            return {
                messageType: "success",
                message: message
            }
        } catch (error) {
            console.error(error);
            return {
                messageType: "danger",
                message: "Ocurrio un error de red, intente nuevamente."
            }
        }
    }

    const handleAction = async (callMethod: string, recordId: number) => {
        if (isProcessing) return;
        setIsProcessing(true);
        try {
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
                const response = await functions[callMethod](recordId);
                if(response === true && props.notifyParent)
                    props.notifyParent(recordId);
                return;
            }
        } finally {
            setIsProcessing(false);
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
        if(!props.noActions)
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
                    title={ titleModal }
                    record={ record }
                    inputs={ inputs }
                    performUpdate={ performUpdate }
                    setFormData={ setFormData }
                    setShowModal={ setShowModal }
                    user={ props.user } /> 
                : null 
            }
        </>
    );
}

export default Lista;