import { castNullToString } from '../../funciones';
import { useState } from 'react';

const InputTextArea = (props: any) => {
    const [text, setText] = useState(castNullToString(props.text));

    const handleChange = (event: any) => {
        const name = event.target.name;
        const value = event.target.value;
        setText(value);
        props.stateFormData((values: any) => ({...values, [name]: value}))
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
                        <textarea 
                            name={ props.inputData.inputName }
                            className="textarea"
                            value={ text }
                            onChange={ handleChange }
                            placeholder={ props.inputData.inputLabel }
                            rows={ 2 }
                            required={Boolean(parseInt(props.inputData.inputRequired))} >
                        </textarea>
                    </div>
                </div>
            </div>
        </>
    );
}

export default InputTextArea;