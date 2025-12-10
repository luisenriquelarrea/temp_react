import { Dispatch, SetStateAction, RefObject } from 'react';
import Link from 'next/link';
import {
    toCurrencyFormat,
    castNullToString, 
    numberWithCommas
} from '@/app/utils/helpers';
import { Accion, SeccionMenuInput } from '@/app/utils/entities';
import InputTextFilter from "./InputTextFilter";
import InputCheckboxFilter from "./InputCheckboxFilter";
import TextAreaSmall from './TextAreaSmall';
import { StyledColumns } from '@/app/utils/types';

interface TableProps {
    columns: any[];
    dataTable: any[];
    tableActions: any[];
    seccionMenu: string;
    tableRef?: RefObject<HTMLTableElement>;
    styledColumns?: StyledColumns;
    setFormData?: Dispatch<SetStateAction<any>>;
    iconsDisabled?: boolean;
    columnsExtra?: { [key: string]: any };
    columnExtraDefaultValues?: { [key: string]: any };
    handleAction?: (callMethod: string, recordId: number) => void;
    handleButton?: (callMethod: string, recordId: number) => void;
    handlePropEvent?: (params: any) => any;
    mathColumn?: (operate: number, pos: string) => any;
};
const Table = (props: TableProps) => {

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
        fontSize: "20px"
    };
    const columnsStatus = [0, 1];
    const inputsText = ['text', 'number'];

    const handleAction = (action: string, record: any) => {
       if(props.handleAction)
            props.handleAction(action, record.id);
    }

    const renderAction = (action: Accion, record: { [key: string]: any }) => {
        const status = parseInt(record.status);
        if (action.callMethod === "xls") return null;
        const IconWrapper = ({ children }: any) => (
            <span className="action-icon">{children}</span>
        );
        if (action.callMethod === "show") {
            return (
                <IconWrapper key={action.id}>
                    <Link key={record.id} href={`/dashboard/${props.seccionMenu}/${record.id}`}>
                        <i
                            title={action.label}
                            className={`fa fa-${action.icon} fa-fw`}
                        ></i>
                    </Link>
                </IconWrapper>
            );
        }
        if (action.callMethod !== "changeStatus") {
            return (
                <IconWrapper key={action.id}>
                    <i
                        title={action.label}
                        className={`fa fa-${action.icon} fa-fw`}
                        onClick={() => handleAction(String(action.callMethod), record)}
                    ></i>
                </IconWrapper>
            );
        }
        if (action.descripcion === "deactivate" && status === 1) {
            return (
                <IconWrapper key={action.id}>
                    <i
                        title={action.label}
                        className="fa fa-pause fa-fw"
                        onClick={() => handleAction(String(action.callMethod), record)}
                    ></i>
                </IconWrapper>
            );
        }
        if (action.descripcion === "activate" && status === 0) {
            return (
                <IconWrapper key={action.id}>
                    <i
                        title={action.label}
                        className="fa fa-play fa-fw"
                        onClick={() => handleAction(String(action.callMethod), record)}
                    ></i>
                </IconWrapper>
            );
        }
        return null;
    }

    const renderActionExtra = (action: any, record: any) => {
        const recordId = (action.auxKey !== undefined ) ? getAuxKey(action, record) : record.id;
        return <i 
            key={ action.id } 
            title={ action.label }
            className={`fa fa-${action.icon} fa-fw`}
            style={{"fontSize": '25px', "marginRight": "12px"}}
            onClick={() => props.handleButton!(action.callMethod, recordId) } >
        </i>
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

    const getAuxKey = (columnExtra: any, record: any): string => {
        return columnExtra.inputName + "-" + columnExtra.auxKey.map((key: string) => record[key]).join("-");
    }
    
    const renderColumnExtra = (columnExtra: any, record: any) => {
        const recordId = (columnExtra.auxKey !== undefined ) ? getAuxKey(columnExtra, record) : record.id;
        const defaultValue = 
            (props.columnExtraDefaultValues !== undefined && props.columnExtraDefaultValues[recordId] !== undefined)
            ? props.columnExtraDefaultValues[recordId]
            : "";
        if( columnExtra.inputType === "span" )
            return <p>{ defaultValue }</p>
        if( columnExtra.inputType === "textareaSmall" )
            return <TextAreaSmall 
                key={ columnExtra.inputName }
                inputData={ columnExtra }
                stateFormData={ props.setFormData } 
                text={ defaultValue }
                recordId={ recordId }
                handlePropEvent={ props.handlePropEvent } />
        if( columnExtra.inputType === "checkbox" )
            return <InputCheckboxFilter 
                key={ columnExtra.inputName }
                inputData={ columnExtra }
                stateFormData={ props.setFormData } 
                recordId={ recordId }
                text="0"
                noLabel="1" />
        if( inputsText.includes(String(columnExtra.inputType)) )
            return <InputTextFilter
                key={ columnExtra.inputName }
                inputData={ columnExtra }
                stateFormData={ props.setFormData } 
                recordId={ recordId }
                text={ defaultValue }
                handlePropEvent={ props.handlePropEvent }
                showLabel={ false } />
        if( columnExtra.inputType === "math" ){
            const value = props.mathColumn!(record[columnExtra.operateColumn], recordId);
            return <>
                <p key={ value } className={ `input-${columnExtra.inputName}` }>{ toCurrencyFormat(parseFloat(value)) }</p>
            </>
        }
    }

    const getColumnStyled = (columnName: string, columnId: string, columnValue: string): 
            React.CSSProperties | undefined => {
        const styledSection = styledColumns?.[props.seccionMenu];
        if (!styledSection) return;
        const styles =
            styledSection[`${columnName}.${columnId}`] ?? styledSection[columnName];
        if (!styles) return;
        const match = Object.entries(styles).find(([key]) => key === columnValue);
        return match ? (match[1] as React.CSSProperties) : undefined;
    };

    const getColumnsExtra = () => {
        if(props.columnsExtra?.[props.seccionMenu])
            return props.columnsExtra[props.seccionMenu];
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
                            { tableActions.length > 0 
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
                                    { tableActions.length > 0 
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
                                        const columnId = column.inputId!;
                                        let columnValue = renderColumn(columnName, record, column);
                                        columnValue = (column.currencyFormat === 1 && castNullToString(columnValue) !== "") 
                                            ? toCurrencyFormat(columnValue) 
                                            : columnValue;
                                        columnValue = (column.numberFormat === 1 && castNullToString(columnValue) !== "") 
                                            ? numberWithCommas(columnValue) 
                                            : columnValue;
                                        let recordStyled = getColumnStyled(columnName, columnId, columnValue);
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
                                        if (columnExtra.inputType === "actions" && columnExtra.actions.length > 0) {
                                            return (
                                                <td key={columnExtra.id}>
                                                    {columnExtra.actions.map((action: any) => renderActionExtra(action, record))}
                                                </td>
                                            );
                                        }
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