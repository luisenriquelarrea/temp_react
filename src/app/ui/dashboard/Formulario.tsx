import InputText  from './InputText';
import InputTextArea  from './InputTextArea';
import InputSelect  from './InputSelect';
import InputCheckbox from "./InputCheckbox";
import { SeccionMenuInput } from '../../entities';

const Formulario = (props: any) => {
    const inputsText = ['text', 'password', 'date', 'number'];

    const renderInput = (input: SeccionMenuInput) => {
        if( inputsText.includes(String(input.inputType)) )
            return <InputText 
                key={ input.inputName }
                inputData={ input }
                stateFormData={ props.setFormData } 
                text="" />
        if(input.inputType === "select")
            return <InputSelect 
                key={ input.inputName }
                inputData={ input }
                stateFormData={ props.setFormData }
                seccionMenu={ props.seccionMenu } 
                defaultValue="" />
        if( input.inputType === "textarea" )
            return <InputTextArea 
                key={ input.inputName }
                inputData={ input }
                stateFormData={ props.setFormData } 
                text="" />
        if( input.inputType === "checkbox" )
            return <InputCheckbox 
                key={ input.inputName }
                inputData={ input }
                stateFormData={ props.setFormData } 
                text="0" />
        return null
    }

    return (
        <>
            <form onSubmit={ props.handleSubmit }>
                <div className="columns is-multiline">
                {props.inputs.map((input: SeccionMenuInput) => {
                    return (
                        renderInput(input)
                    );
                })}
                </div>
                <div className="column is-3">
                    <button type="submit" className="button is-fullwidth">
                        {
                            (props.btnLabel !== undefined) ? props.btnLabel : "Guardar"
                        }
                    </button>
                </div>
            </form>
        </>
    );
}

export default Formulario;