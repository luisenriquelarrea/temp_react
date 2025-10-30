export interface ColumnStyle  {
    backgroundColor?: string,
    border?: string
};
export interface InputConf {
    value: string,
    disabled?: boolean,
    filters?: any
}
export type MessageBoxT = {
    messageType?: "danger" | "warning" | "info" | "success";
    message?: string;
};
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