import { useState } from 'react';

const InputText = (props: any) => {
    const [text, setText] = useState(props.text);

    const handleChange = (event: any) => {
        const name = event.target.name;
        const value = event.target.value;
        setText(value);
        props.stateFormData((values: any) => ({...values, [name]: value}))
    }

    return(
        <>
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
                            onChange={ handleChange }
                            placeholder={ props.inputData.inputLabel } />
                    </div>
                </div>
            </div>
        </>
    );
}

export default InputText;