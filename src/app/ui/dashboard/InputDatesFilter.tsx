import { useState } from 'react';

const InputDatesFilter = (props: any) => {
    const [text, setText] = useState(props.text);

    const handleChange = (event: any) => {
        const name = event.target.name;
        const value = event.target.value;
        setText(value);
        props.stateFormData((values: any) => ({...values, [name]: value}))
    }

    return(
        <>
            <div className="column is-12" ></div>
            <div className="column is-2" >
                <div className="field">
                    <label className="label">
                        Fecha inicio
                    </label>
                    <div className="control">
                        <input className="input is-info is-small" 
                            name={ props.inputData.inputName }
                            type={ props.inputData.inputType } 
                            value={ text }
                            onChange={ handleChange }
                            placeholder={ props.inputData.inputLabel } />
                    </div>
                </div>
            </div>
            <div className="column is-2" >
                <div className="field">
                    <label className="label">
                        Fecha final
                    </label>
                    <div className="control">
                        <input className="input is-info is-small" 
                            name={ props.inputData.inputName }
                            type={ props.inputData.inputType } 
                            value={ text }
                            onChange={ handleChange }
                            placeholder={ props.inputData.inputLabel } />
                    </div>
                </div>
            </div>
        </>
    );
}

export default InputDatesFilter;