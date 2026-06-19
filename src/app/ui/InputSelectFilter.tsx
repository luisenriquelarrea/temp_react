import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { getSeccionMenuListFiltered } from '@/app/utils/api';
import { SeccionMenuInput } from '@/app/utils/entities';

interface InputSelectProps {
    defaultValue: string;
    input: SeccionMenuInput;
    filters?: any;
    disabled?: boolean;
    stateFormData: Dispatch<SetStateAction<any>>;
    handleInputChange?: (param: any) => void;
}
const InputSelectFilter = (props: InputSelectProps) => {
    const [defaultValue, setDefaultValue] = useState(props.defaultValue);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        let filters = getFilters();
        getSeccionMenuListFiltered(props.input.urlGet!, filters).then(response => {
            if(!response.ok){
                console.log("Error al obtener "+props.input.urlGet+" lista");
                console.log(response);
                return;
            }
            response.json().then(data => {
                setOptions(data);
            })
        }).catch(error => console.error(error));
    }, []);

    const handleChange = (event: any) => {
        let name = event.target.name;
        const value = event.target.value;
        let attr = "id";
        if(name.includes(".")){
            const params = name.split(".");
            name = params[0];
            attr = params[1];
        }
        setDefaultValue(value);
        props.stateFormData((values: any) => ({...values, [name]: {[attr]:value} }))
    }

    const renderSelectColumnas = (option: any, selectColumnas: string) => {
        if(String(selectColumnas).trim() === "null")
            return option['descripcion'];
        selectColumnas = selectColumnas.replace(/ /g, "");
        const columnas = selectColumnas.split(",");
        const parts:string[] = [];

        columnas.forEach(columna => {
            if (columna.includes(".")) {
                const deepColumn = columna.split(".");
                let deepRecord = option;
                let finalColumn = "descripcion";
                
                deepColumn.forEach(column => {
                    if (typeof deepRecord[column] === 'object' && deepRecord[column] !== null) {
                        deepRecord = deepRecord[column];
                    }
                    finalColumn = column;
                });
                
                parts.push(deepRecord[finalColumn]);
            } else {
                parts.push(option[columna]);
            }
        });

        const str = parts.join(" - ");
        
        return str;
    }

    const getFilters = () => {
        let filters = {
            offset: 0,
            limit: 1000
        };
        if(props.filters){
            filters = {...filters, ...props.filters};
        }
        return filters;
    }

    return(
        <>
            <div className={ `column is-${props.input.inputCols}` } >
                <div className="field">
                    <label className="label is-small"> { props.input.inputLabel } </label>
                    <div className="control">
                        <div className="select is-info is-small is-fullwidth">
                            <select 
                                value={ defaultValue }
                                name={ props.input.inputName } 
                                onChange={ handleChange } >
                                <option value="">{ props.input.inputLabel }</option>
                                {options.map((option: any) => {
                                    const selectColumnas = renderSelectColumnas(option, props.input.selectColumnas!);
                                    return(
                                        <option 
                                            key={ option.id } 
                                            value={ option.id } >
                                            { selectColumnas }
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default InputSelectFilter;