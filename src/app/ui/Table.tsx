import {
    mysqlTimeStamp,
    toCurrencyFormat,
    castNullToString, 
    numberWithCommas
} from '@/app/utils/helpers';
import { Accion, SeccionMenuInput } from '@/app/utils/entities';
import InputTextFilter from "./InputTextFilter";
import InputCheckboxFilter from "./InputCheckboxFilter";
import Link from 'next/link';

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
        props.setRecordId(record.id);
        props.setFormData({
            'userUpdatedId': props.userId,
            'updatedAt': mysqlTimeStamp()
        });
       if(props.handleAction)
            props.handleAction(action, record.id);
    }

    const renderAction = (action: Accion, record: any) => {
        if(action.callMethod === "xls")
            return null;
        if(action.callMethod === "show")
            return <Link key={record.id} href={`/dashboard/${props.seccionMenu}/${record.id}`} >
                    <i key={ action.id } 
                        title={ action.label }
                        className={`fa fa-${action.icon} fa-fw`}
                        style={{"fontSize": '14px', "color": "black"}} >
                    </i>
                </Link>
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
            ?  renderIcon()
            : null
        : record[columnName];
    }

    const renderIcon = () => {
        return props.iconsDisabled !== undefined 
            ? 'OK' 
            : <i className="fa fa-circle-check" style={ columnOk }></i>;
    }

    const renderColumnExtra = (columnExtra: any, record: any) => {
        const recordId = record.id;
        if( columnExtra.inputType === "checkbox" )
            return <InputCheckboxFilter 
                key={ columnExtra.inputName }
                inputData={ columnExtra }
                stateFormData={ props.setFormData } 
                recordId={ recordId }
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
                <p key={ value } className={ `input-${columnExtra.inputName}` }>{ toCurrencyFormat(parseFloat(value)) }</p>
            </>
        }
    }

    const getColumnStyled = (columnName: string, columnValue: string) => {
        let columnStyle: any = {};
        if(styledColumns?.[props.seccionMenu]){
            const styledColumn = styledColumns[props.seccionMenu];
            if(styledColumn?.[columnName]){
                const styles = styledColumn[columnName];
                for (let [key, value] of Object.entries(styles))
                    if(columnValue === key){
                        columnStyle = value;
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
                <table 
                    className="myTable table is-bordered is-striped is-hoverable is-fullwidth is-narrow" 
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
                                    { columns.map((column: SeccionMenuInput) => {
                                        const columnName = column.inputName!;
                                        let columnValue = renderColumn(columnName, record, column);
                                        columnValue = (column.currencyFormat === 1 && castNullToString(columnValue) !== "") 
                                            ? toCurrencyFormat(columnValue) 
                                            : columnValue;
                                        columnValue = (column.numberFormat === 1 && castNullToString(columnValue) !== "") 
                                            ? numberWithCommas(columnValue) 
                                            : columnValue;
                                        let recordStyled = getColumnStyled(columnName, columnValue);
                                        if(column.currencyFormat === 1 || column.numberFormat === 1)
                                            recordStyled = {
                                                ...recordStyled,
                                                ...{ textAlign: 'right' }
                                            };
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