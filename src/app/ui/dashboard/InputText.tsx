import { useState } from 'react';
import { castNullToString } from '../../funciones';

const InputText = (props: any) => {
    const [text, setText] = useState(castNullToString(props.text));

    const handleChange = (event: any) => {
        const name = event.target.name;
        const value = event.target.value;
        setText(value);
        props.stateFormData((values: any) => ({...values, [name]: value}))
    }

    const handleKeyDown = (event: any) => {
        if(event.target.type === 'datetime-local')
            event.preventDefault();
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
                        <input className="input is-info" 
                            id={ props.inputData.inputId }
                            name={ props.inputData.inputName }
                            type={ props.inputData.inputType } 
                            value={ text }
                            required={Boolean(parseInt(props.inputData.inputRequired))}
                            onChange={ handleChange }
                            onKeyDown={ (event) => handleKeyDown(event) }
                            placeholder={ props.inputData.inputLabel } />
                    </div>
                </div>
            </div>
        </>
    );
}

export default InputText;