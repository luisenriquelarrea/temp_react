import { useState, useEffect } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { getInputs, getSeccionMenuList, getTableActions } from '../../api';
import { User } from '../../entities';

const Table = (props: any) => {
    const { getItem } = useLocalStorage();
    const [columns, setColumns] = useState([]);
    const [data, setData] = useState([]);
    const [tableActions, setTableActions] = useState([]);

    useEffect(() => {
        getInputs(props.seccionMenuId, 'lista').then(response => {
            if(!response.ok){
                console.log("Error al obtener inputs");
                console.log(response);
                return;
            }
            response.json().then(data => {
                console.log(data);
                setColumns(data);
            })
        }).catch(error => console.error(error));

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

        const user: User = JSON.parse(String(getItem("user")));
        getTableActions(props.seccionMenuId, user.grupo).then(response => {
            if(!response.ok){
                console.log("Error al obtener tableActions");
                console.log(response);
                return;
            }
            response.json().then(data => {
                console.log(data);
                setTableActions(data);
            })
        }).catch(error => console.error(error));
    }, []);

    return (
        <div className="table-container">
            <table className="table is-bordered display">
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
                                <tr>
                                    {columns.map((column: any) => {
                                        const columnKey: string = column.id;
                                        const columnName: string = column.inputName;
                                        return(
                                            <td key={ record[columnKey] }> { record[columnName] } </td>
                                        );
                                    })}
                                    {tableActions.map((action: any) => {
                                        return(
                                            <i key={ action.id } className="fa fa-users fa-fw"></i>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                </tbody>
            </table> 
        </div>
    );
}

export default Table;