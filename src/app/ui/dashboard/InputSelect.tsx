import { useState, useEffect } from 'react';
import { getSeccionMenuList } from '../../api';

const InputSelect = (props: any) => {
    const [defaultValue, setDefaultValue] = useState(props.defaultValue);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        getSeccionMenuList(props.inputData.modelo).then(response => {
            if(!response.ok){
                console.log("Error al obtener "+props.inputData.modelo+" lista");
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
        props.stateFormData((values: any) => ({...values, [name]: value }))
    }

    return(
        <>
            <div className={ `column is-${props.inputData.cols}` } >
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
                                name={ props.inputData.inputName } 
                                onChange={ handleChange } >
                                <option value="0">Selecciona una opción</option>
                                {options.map((option: any) => {
                                    return(
                                        <option 
                                            key={ option.id } 
                                            value={ option.id } >
                                            { option.descripcion }
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