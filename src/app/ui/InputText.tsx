import { useState } from 'react';
import { castNullToString } from '@/app/utils/helpers';
import { SeccionMenuInput } from '@/app/utils/entities';

interface InputTextProps {
    text: string;
    inputData: SeccionMenuInput
    stateFormData: React.Dispatch<React.SetStateAction<any>>;
    disabled?: boolean;
    handleChange?: (name: string, value: string) => void;
}
const InputText = (props: InputTextProps) => {
    const [text, setText] = useState(castNullToString(props.text));

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        const value = event.target.value;
        setText(value);
        props.stateFormData((values: any) => ({...values, [name]: value}));
        if(props.handleChange)
            props.handleChange(name, value);
    }

    const handleKeyDown = (event: any) => {
        if(event.target.type === 'datetime-local')
            event.preventDefault();
    }

    return(
        <>
            { props.inputData.newLine === 1
                ? <div style={{marginBottom: "-25px"}} className={ `column is-12` } ></div>
                : null
            }
            <div className={ `column is-${props.inputData.inputCols}` } >
                <div className="field">
                    <label className="label"> 
                        { props.inputData.inputLabel }
                        { props.inputData.inputRequired === 1
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
                            required={Boolean(props.inputData.inputRequired)}
                            onChange={ handleChange }
                            onKeyDown={ (event) => handleKeyDown(event) }
                            placeholder={ props.inputData.inputLabel }
                            disabled={ props.disabled }
                            onWheel={(e) => e.currentTarget.blur()} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default InputText;