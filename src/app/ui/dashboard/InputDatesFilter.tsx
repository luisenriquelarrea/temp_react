import { useState } from 'react';

const InputDatesFilter = (props: any) => {
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFinal, setFechaFinal] = useState("");

    const handleChange = (event: any) => {
        const name = event.target.name;
        const value = event.target.value;
        (String(name).indexOf("Valor1") !== -1) ? setFechaInicio(value) : setFechaFinal(value);
        props.stateFormData((values: any) => ({...values, [name]: value}))
    }

    return(
        <>
            <div className="column is-2" >
                <div className="field">
                    <label className="label is-small">
                        { props.inputData.inputLabel } desde
                    </label>
                    <div className="control">
                        <input className="input is-info is-small" 
                            name={ `${props.inputData.inputName}Valor1` }
                            type={ props.inputData.inputType } 
                            value={ fechaInicio }
                            onChange={ handleChange }
                            placeholder={ props.inputData.inputLabel } />
                    </div>
                </div>
            </div>
            <div className="column is-2" >
                <div className="field">
                    <label className="label is-small">
                        - hasta
                    </label>
                    <div className="control">
                        <input className="input is-info is-small" 
                            name={ `${props.inputData.inputName}Valor2` }
                            type={ props.inputData.inputType } 
                            value={ fechaFinal }
                            onChange={ handleChange }
                            placeholder={ props.inputData.inputLabel } />
                    </div>
                </div>
            </div>
        </>
    );
}

export default InputDatesFilter;