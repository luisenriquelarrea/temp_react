export interface ColumnStyle  {
    backgroundColor?: string,
    border?: string
};
export interface InputConf {
    value: string,
    disabled?: boolean,
    filters?: any
}
export interface Style {
    backgroundColor: string;
    color: string;
    border: string;
}
export interface StatusStyles {
    [status: string]: Style;
}  
export interface ColumnStyles {
    [columnKey: string]: StatusStyles;
}  
export interface StyledColumns {
    [key: string]: ColumnStyles;
}