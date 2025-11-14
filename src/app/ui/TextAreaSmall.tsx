import { castNullToString } from '@/app/utils/helpers';
import { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

const TextAreaSmall = (props: any) => {
    const [text, setText] = useState(castNullToString(props.text));

    const handleChange = (event: any) => {
        const name = event.target.name;
        const value = event.target.value;
        setText(value);
        if(props.handleIndex !== undefined)
            props.handleIndex();
        if(props.recordId !== undefined){
            props.stateFormData((values: any) => ({
                    ...values, 
                    [props.recordId]: {
                        ...values[props.recordId], [name]: value
                    }
                })
            );
            if(props.handlePropEvent !== undefined)
                props.handlePropEvent({
                    recordId: props.recordId,
                    value: value,
                    inputName: name
                });
        }
        else
            props.stateFormData((values: any) => ({...values, [name]: value}))
    }

    return(
        <>
            <div className={ `column is-${props.inputData.inputCols}` } >
                <div className="field">
                    <div className="control">
                        <TextareaAutosize
                            name={props.inputData.inputName}
                            value={text}
                            onChange={handleChange}
                            placeholder={props.inputData.inputLabel}
                            minRows={3}
                            maxRows={10}
                            required={Boolean(parseInt(props.inputData.inputRequired))} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default TextAreaSmall;