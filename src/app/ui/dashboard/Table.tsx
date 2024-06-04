import { useState, useEffect } from "react";
import { getInputs, getSeccionMenuList } from '../../api';

const Table = (props: any) => {
    const [columns, setColumns] = useState([]);
    const [data, setData] = useState([]);

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
                            </tr>
                            );
                        })}
                </tbody>
            </table> 
        </div>
    );
}

export default Table;