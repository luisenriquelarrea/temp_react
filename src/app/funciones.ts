export const arrayColumn = (array: any[], column: string) => {
    if(array.length > 0)
        return array.map(item => item[column])
    return [];
}

export const flipStatus = (status: number) => {
    return 1 - status;
}