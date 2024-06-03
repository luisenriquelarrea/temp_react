import { useState } from 'react';

const InputSelect = (props: any) => {
    const [text, setText] = useState("");

    const handleChange = (event: any) => {
        const name = event.target.name;
        const value = event.target.value;
        setText(value);
        props.stateFormData((values: any) => ({...values, [name]: value}))
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
                        <div className="select is-info">
                            <select>
                                <option>Selecciona una opción</option>
                                <option>With options</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default InputSelect;