import { saveAs } from "file-saver";
import { StyledColumns } from "./types";

export const arrayColumn = (array: any[], column: string) => {
    if(array.length > 0)
        return array.map(item => item[column])
    return [];
}

export const arrayGroup = (array: any[], path: any[]) => {
    const transform = pipe( groupBy( getPath(path) ), values);
    return transform(array);
}

const groupBy = (fn: any) => (list: any) => list.reduce((all: any, curr: any) => {
    const key = fn(curr);
    (all[key] || (all[key] = [])).push(curr);
    return all;
},{});
  
const values = (obj: any) => Object.values(obj);

const pipe = (f1: any, ...fns: any) => (...args: any) => {
    return fns.reduce((res: any, fn: any) => fn(res), f1.apply(null, args));
};

const getPath = (nodes: any) => (obj: any) => nodes.reduce((o: any, node: any) => o[node], obj);

export const arraySum = (array: any[]) => {
    return array.reduce((partialSum, a) => partialSum + a, 0);
}

export const arrayUnique = (array: any[]) => {
    return [...new Set(array)];
}

export const castNullToString = (input: any) => {
    return (String(input) === "null" 
        || String(input).trim() === ""
        || typeof input === "undefined") 
        ? "" 
        : input;
}

const convertBase64ToFile = (base64String: string, fileName: string) => {
    const arr = base64String.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    let uint8Array = new Uint8Array(n);
    while (n--) {
       uint8Array[n] = bstr.charCodeAt(n);
    }
    const file = new File([uint8Array], fileName, { type: mime });
    return file;
}

export const currentSeccionMenu = (pathname: string) => {
    const sm = String(pathname).substring(0, pathname.lastIndexOf("/"));
    return String(sm).substring(sm.lastIndexOf("/") + 1);
}

const dateWithTimezone = (date: Date, timezone: number) => {
    // Create a Date object with the specified timezone
    const dateWithTimezone = new Date(date.getTime() + timezone * 60 * 60 * 1000);
    return dateWithTimezone;
}

export const downloadBase64Data = (base64String: string, fileName: string) => {
    const file = convertBase64ToFile(base64String, fileName);
    saveAs(file, fileName);
}

export const getObjectValue = (object: any, key: string, defaultValue: any) => {
    return (object[key] !== undefined) 
    ? object[key]
    : defaultValue;
}

export const flipStatus = (status: number) => {
    return 1 - status;
}

export const mysqlDate = () => {
    return dateWithTimezone(new Date(), -6).toISOString().slice(0, 10);
}

export const mysqlTimeStamp = () => {
    return dateWithTimezone(new Date(), -6).toISOString().slice(0, 19).replace('T', ' ');
}

export const numberWithCommas = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const objectClean = (obj: any) => {
    for (var propName in obj) {
        if (obj[propName] === null || obj[propName] === undefined 
            || String(obj[propName]).trim() === "") {
          delete obj[propName];
        }
      }
      return obj;
}

export const parseString = (str: string) => {
    str = str.replace(/ /g, "_").toLowerCase();
    return removeSpecialChars(str);
}

const removeSpecialChars = (str: string) => {
    str = str.replace(/á/g, "a");
    str = str.replace(/é/g, "e");
    str = str.replace(/í/g, "i");
    str = str.replace(/ó/g, "o");
    str = str.replace(/ú/g, "u");
    return str;
}

export const toCurrencyFormat = (num: number) => {
    return num.toLocaleString("en-US", {style:"currency", currency:"USD"});
}

export const toBase64 = (file: any) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});

export const toStyledColumns = (rows: any[]): StyledColumns => {
    const styledColumns: StyledColumns = {};
    rows.forEach(row => {
        const { seccionMenu, columna, valor, backgroundColor, color, border } = row;
        const table = seccionMenu?.descripcion;
        if (!table)
            return;
        if (!styledColumns[table])
            styledColumns[table] = {};
        if (!styledColumns[table][columna])
            styledColumns[table][columna] = {};
        styledColumns[table][columna][valor] = {
            backgroundColor: backgroundColor || undefined,
            color: color || undefined,
            border: border || undefined,
        };
    });
    return styledColumns;
}

export const capitalizeFirstLetter = (cadena: string) => {
    return cadena.charAt(0).toUpperCase() + cadena.slice(1);
}

export const uncapitalizeFirstLetter = (cadena: string) => {
    return cadena.charAt(0).toLowerCase() + cadena.slice(1);
}