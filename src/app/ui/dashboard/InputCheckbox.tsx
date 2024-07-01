import { useState } from 'react';
import { flipStatus } from '../../funciones';

const InputCheckbox = (props: any) => {
    const [text, setText] = useState(props.text);

    const handleChange = (event: any) => {
        const name = event.target.name;
        const value = flipStatus(event.target.value);
        setText(value);
        props.stateFormData((values: any) => ({...values, [name]: value}))
    }

    return(
        <>
            <div className={ `column is-12` } >
                <label className="checkbox label">
                    <input 
                        className="my-check"
                        type="checkbox"
                        name={ props.inputData.inputName }
                        value={ text }
                        onChange={ handleChange } />
                    { props.inputData.inputLabel }
                </label>
            </div>
        </>
    );
}

export default InputCheckbox;