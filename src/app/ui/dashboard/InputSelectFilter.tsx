import { useState, useEffect } from 'react';
import { getSeccionMenuList } from '../../api';

const InputSelect = (props: any) => {
    const [defaultValue, setDefaultValue] = useState(props.defaultValue);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        getSeccionMenuList(props.inputData.urlGet).then(response => {
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

    return(
        <>
            <div className="column is-2" >
                <div className="field">
                    <label className="label is-small"> { props.inputData.inputLabel } </label>
                    <div className="control">
                        <div className="select is-info is-small is-fullwidth">
                            <select 
                                value={ defaultValue }
                                name={ props.inputData.inputName } 
                                onChange={ handleChange } >
                                <option value="">{ props.inputData.inputLabel }</option>
                                {options.map((option: any) => {
                                    return(
                                        <option 
                                            key={ option.id } 
                                            value={ option.id } >
                                            { option[props.inputData.selectColumnas] }
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