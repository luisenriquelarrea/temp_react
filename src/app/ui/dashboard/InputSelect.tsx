import { useState, useEffect } from 'react';
import { getSeccionMenuListFiltered } from '../../api';

const InputSelect = (props: any) => {
    const [defaultValue, setDefaultValue] = useState(props.defaultValue);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        const selectFilters = getSelectFilters();
        getSeccionMenuListFiltered(props.inputData.urlGet, selectFilters).then(response => {
            if(!response.ok){
                console.log("Error al obtener "+props.inputData.urlGet+" lista");
                console.log(response);
                return;
            }
            response.json().then(data => {
                setOptions(data);
            })
        }).catch(error => console.error(error));
    }, []);

    const handleChange = (event: any) => {
        const name = event.target.name;
        const value = event.target.value;
        setDefaultValue(value);
        props.stateFormData((values: any) => ({...values, [name]: {"id":value} }))
    }

    const renderSelectColumnas = (option: any, selectColumnas: string) => {
        if(String(selectColumnas).trim() === "null")
            return option['descripcion'];
        selectColumnas = selectColumnas.replace(/ /g, "");
        const columnas = selectColumnas.split(",");
        var str = "";
        columnas.forEach(columna => {
            if(columna.includes(".")){
                const deepColumn = columna.split(".");
                var deepRecord = option;
                var finalColumn = "descripcion";
                deepColumn.forEach(column => {
                    if(typeof(deepRecord[column]) === 'object' 
                        && String(deepRecord[column]) !== "null")
                        deepRecord = deepRecord[column]
                    finalColumn = column;
                });
                str += deepRecord[finalColumn]+" - ";
            }
            else
                str += option[columna]+" ";
        });
        return str;
    }

    const getSelectFilters = () => {
        let selectFilters = {
            offset: 0,
            limit: 1000
        };
        if(props.selectFilters){
            selectFilters = {...selectFilters, ...props.selectFilters};
        }
        return selectFilters;
    }

    return(
        <>
            { (parseInt(props.inputData.newLine) === 1) 
                ? <div style={{marginBottom: "-25px"}} className={ `column is-12` } ></div>
                : null
            }
            <div className={ `column is-${props.inputData.inputCols}` } >
                <div className="field">
                    <label className="label"> 
                        { props.inputData.inputLabel }
                        { (parseInt(props.inputData.inputRequired) === 1) 
                            ? <span className="input-required">*</span> 
                            : null 
                        }
                    </label>
                    <div className="control">
                        <div className="select is-info is-fullwidth">
                            <select 
                                value={ defaultValue }
                                id={ props.inputData.inputName }
                                name={ props.inputData.inputName } 
                                required={Boolean(parseInt(props.inputData.inputRequired))}
                                onChange={ handleChange } >
                                <option value="">Selecciona una opción</option>
                                {options.map((option: any) => {
                                    const selectColumnas = renderSelectColumnas(option, props.inputData.selectColumnas);
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

export default InputSelect;