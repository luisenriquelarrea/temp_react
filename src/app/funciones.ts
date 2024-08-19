import { saveAs } from "file-saver";

export const arrayColumn = (array: any[], column: string) => {
    if(array.length > 0)
        return array.map(item => item[column])
    return [];
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

export const downloadBase64Data = (base64String: string, fileName: string) => {
    const file = convertBase64ToFile(base64String, fileName);
    saveAs(file, fileName);
}

export const flipStatus = (status: number) => {
    return 1 - status;
}

export const mysqlDate = () => {
    return new Date().toISOString().slice(0, 10);
}

export const mysqlTimeStamp = () => {
    return new Date().toISOString().slice(0, 19).replace('T', ' ');
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

export const toBase64 = (file: any) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});

export const uncapitalizeFirstLetter = (cadena: string) => {
    return cadena.charAt(0).toLowerCase() + cadena.slice(1);
}