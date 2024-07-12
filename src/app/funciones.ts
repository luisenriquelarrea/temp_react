export const arrayColumn = (array: any[], column: string) => {
    if(array.length > 0)
        return array.map(item => item[column])
    return [];
}

export const castNullToString = (input: any) => {
    return String(input) === "null" ? "" : input;
}

export const currentSeccionMenu = (pathname: string) => {
    const sm = String(pathname).substring(0, pathname.lastIndexOf("/"));
    return String(sm).substring(sm.lastIndexOf("/") + 1);
}

export const flipStatus = (status: number) => {
    return 1 - status;
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