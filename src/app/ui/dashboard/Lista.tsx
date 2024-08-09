import { useState, useEffect } from "react";
import { 
    getInputs, 
    getSeccionMenuListFiltered,
    getTableActions,
    countFilteredList
} from '../../api';
import { arrayColumn, objectClean } from '../../funciones';
import Filters from '@/app/ui/dashboard/Filters';
import Pagination from "./Pagination";
import Table from "./Table";

const Lista = (props: any) => {
    const off = 0;
    const lim = 5;

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
        }while(i <= maxButtons && i < tPages - 1);
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
                xls={ xls } />
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
        </>
    );
}

export default Lista;