import { useState } from 'react';

const InputTextFilter = (props: any) => {
    const [text, setText] = useState(props.text);

    const handleChange = (event: any) => {
        const name = event.target.name;
        const value = event.target.value;
        setText(value);
        props.stateFormData((values: any) => ({...values, [name]: value}))
    }

    return(
        <>
            <div className="column is-1" >
                <div className="field">
                    <div className="control">
                        <input className="input is-info is-small" 
                            name={ props.inputData.inputName }
                            type="text" 
                            value={ text }
                            onChange={ handleChange }
                            placeholder={ props.inputData.inputLabel } />
                    </div>
                </div>
            </div>
        </>
    );
}

export default InputTextFilter;