import { useState } from 'react';
import { flipStatus } from '@/app/funciones';

const InputCheckbox = (props: any) => {
    const [text, setText] = useState(props.text);

    const setAttrChecked = (val: number) => {
        return val === 1 ? true : false;
    }

    const [checked, setChecked] = useState(setAttrChecked(props.text));

    const  setInputCheck = (val: number) => {
        const value = setAttrChecked(val);
        setChecked(Boolean(value));
        setText(val);
    }

    const handleChange = (event: any) => {
        const name = event.target.name;
        const value = flipStatus(parseInt(event.target.value));
        setInputCheck(value);
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
                <label className="checkbox label is-small">
                    <input
                        className="my-check"
                        type="checkbox"
                        name={ props.inputData.inputName }
                        value={ text }
                        onChange={ handleChange }
                        checked={Boolean(checked) === true} />
                    { (props.noLabel !== undefined) ? null : props.inputData.inputLabel }
                </label>
            </div>
        </>
    );
}

export default InputCheckbox;