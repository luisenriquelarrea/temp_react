import { useState } from 'react';

const InputTextFilter = (props: any) => {
    const [text, setText] = useState(props.text);

    const handleChange = (event: any) => {
        const name = event.target.name;
        const value = event.target.value;
        setText(value);
        if(props.recordId !== undefined)
            props.stateFormData((values: any) => 
                ({
                    ...values, 
                    [props.recordId]: {
                        ...values[props.recordId], [name]: value
                    }
                }))
        else
            props.stateFormData((values: any) => ({...values, [name]: value}))
    }

    return(
        <>
            <div className={ `column is-${props.inputData.inputCols}` } >
                <div className="field">
                    {
                        (Boolean(props.showLabel))
                        ? <label className="label is-small"> { props.inputData.inputLabel } </label>
                        : null
                    }
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

export default InputTextFilter;