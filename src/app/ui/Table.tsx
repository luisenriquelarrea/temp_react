import {
    mysqlTimeStamp,
    toCurrencyFormat } from '@/app/funciones';
import { Accion } from '@/app/entities';
import InputTextFilter from "./InputTextFilter";
import InputCheckboxFilter from "./InputCheckboxFilter";

const Table = (props: any) => {

    const columns = props.columns;
    const dataTable = props.dataTable;
    const tableActions = props.tableActions;
    const styledColumns = props.styledColumns;

    interface ColumnStyle  {
        backgroundColor?: string,
        border?: string
    };

    const recordInactive: ColumnStyle  = {
        backgroundColor: "MistyRose",
    };
    const columnOk = {
        color: "DodgerBlue",
        fontSize: "17px"
    };
    const columnsStatus = [0, 1];

    const handleAction = (action: string, record: any) => {
        const recordId = record.id;
        props.setRecordId(recordId);
        props.setFormData({
            'userUpdatedId': props.userId,
            'updatedAt': mysqlTimeStamp()
        });
        if(props.functions[action]){
            props.functions[action](recordId);
        }
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

    const renderColumn = (columnName: string, record: any, column: any) => {
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
        return (columnName.includes("status") && columnsStatus.includes(parseInt(record[columnName])) ) 
        ? (parseInt(record[columnName])) 
            ? <i className="fa fa-circle-check" style={ columnOk }></i> 
            : null
        : record[columnName];
    }

    const renderColumnExtra = (columnExtra: any, record: any) => {
        const recordId = record.id;
        if( columnExtra.inputType === "checkbox" )
            return <InputCheckboxFilter 
                key={ columnExtra.inputName }
                inputData={ columnExtra }
                stateFormData={ props.setFormData } 
                text="0"
                noLabel="1" />
        if(columnExtra.inputType === "number")
            return <InputTextFilter
                key={ columnExtra.inputName }
                inputData={ columnExtra }
                stateFormData={ props.setFormData } 
                recordId={ recordId }
                text=""
                handlePropEvent={ props.handlePropEvent }
                showLabel={ false } />
        if( columnExtra.inputType === "math" ){
            const value = props.mathColumn(record[columnExtra.operateColumn], recordId);
            return <>
                <p key={ value } className={ `input-${columnExtra.inputName}` }>{ value }</p>
            </>
        }
    }

    const getColumnStyled = (columnName: string, columnValue: string) => {
        const columnStyle: ColumnStyle = {};
        if(styledColumns?.[props.seccionMenu]){
            const styledColumn = styledColumns[props.seccionMenu];
            if(styledColumn?.[columnName]){
                const styles = styledColumn[columnName];
                for (let [key, value] of Object.entries(styles))
                    if(columnValue === key){
                        columnStyle.backgroundColor = String(value);
                        columnStyle.border = "1px solid Gainsboro";
                    }
            }
        }
        return columnStyle;
    }

    const getColumnsExtra = () => {
        if(props.columnsExtra?.[props.seccionMenu]){
            return props.columnsExtra[props.seccionMenu];
        }
        return [];
    }

    const columnsExtra = getColumnsExtra();

    return (
        <>
            <div className="table-container">
                <table id="myTable" 
                    className="table is-bordered is-striped is-hoverable is-fullwidth is-narrow" 
                    ref={ props.tableRef }>
                    <thead>
                        <tr>
                            { Object.keys(tableActions).length > 0 
                                ? <th className="no-print">Acciones</th> 
                                : null }
                            { columnsExtra.map((column: any) => {
                                if(column.inputType !== "checkbox")
                                    return null;
                                return(
                                    <th key={ column.id }> { column.inputLabel } </th>
                                );
                            })}
                            { columns.map((column: any) => {
                                return(
                                    <th key={ column.id }> { column.inputLabel } </th>
                                );
                            })}
                            { columnsExtra.map((column: any) => {
                                if(column.inputType === "checkbox")
                                    return null;
                                return(
                                    <th key={ column.id }> { column.inputLabel } </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {dataTable.map((record: any, index: number) => {
                            return(
                                <tr key={ index }>
                                    { Object.keys(tableActions).length > 0 
                                        ? <td>
                                        {tableActions.map((action: Accion) => {
                                            return(
                                                renderAction(action, record)
                                            );
                                        })}
                                        </td> : null 
                                    }
                                    { columnsExtra.map((columnExtra: any) => {
                                        if(columnExtra.inputType !== "checkbox")
                                            return null;
                                        return(
                                            <td key={ columnExtra.id }>
                                                { renderColumnExtra(columnExtra, record) }
                                            </td>
                                        );
                                    })}
                                    { columns.map((column: any) => {
                                        const columnName: string = column.inputName;
                                        let columnValue = renderColumn(columnName, record, column);
                                        columnValue = (parseInt(column.currencyFormat) === 1) 
                                            ? toCurrencyFormat(columnValue) 
                                            : columnValue;
                                        const recordStyled = getColumnStyled(columnName, columnValue);
                                        return(
                                            <td 
                                                key={ column.id } 
                                                style={ parseInt(record.status) === 0 ? recordInactive : recordStyled }> 
                                                { 
                                                    columnValue
                                                } 
                                            </td>
                                        );
                                    })}
                                    { columnsExtra.map((columnExtra: any) => {
                                        if(columnExtra.inputType === "checkbox")
                                            return null;
                                        return(
                                            <td key={ columnExtra.id }>
                                                { renderColumnExtra(columnExtra, record) }
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default Table;