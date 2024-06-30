export const arrayColumn = (array: any[], column: string) => {
    if(array.length > 0)
        return array.map(item => item[column])
    return [];
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

export const uncapitalizeFirstLetter = (cadena: string) => {
    return cadena.charAt(0).toLowerCase() + cadena.slice(1);
}