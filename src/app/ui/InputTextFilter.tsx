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
        if(props.handlePropEvent !== undefined)
            props.handlePropEvent({
                inputName: name
            });
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
                        <input className={`input is-info is-small input-${ props.inputData.inputName }`} 
                            name={ props.inputData.inputName }
                            type={ props.inputData.inputType } 
                            value={ text }
                            onChange={ handleChange }
                            placeholder={ props.inputData.inputLabel }
                            disabled={ props.inputData.inputDisabled } />
                    </div>
                </div>
            </div>
        </>
    );
}

export default InputTextFilter;