import InputText  from './InputText';
import InputTextArea  from './InputTextArea';
import InputSelect  from './InputSelect';
import InputCheckbox from "./InputCheckbox";
import { InputConf, SeccionMenuInput } from '../../entities';
import { getObjectValue } from '@/app/funciones';

const Formulario = (props: any) => {
    const inputsText = ['text', 'password', 'date', 'number'];

    const renderInput = (input: SeccionMenuInput) => {
        const inputConf: InputConf 
            = getObjectValue(defaultValues, String(input.inputName), {});
        const value = getObjectValue(inputConf, "value", "");
        const disabled = getObjectValue(inputConf, "disabled", false);
        const filters = getObjectValue(inputConf, "filters", {});
        if( inputsText.includes(String(input.inputType)) )
            return <InputText 
                key={ input.inputName }
                inputData={ input }
                stateFormData={ props.setFormData } 
                text={ value }
                disabled={ disabled } />
        if(input.inputType === "select"){
            return <InputSelect 
                key={ input.inputName }
                inputData={ input }
                stateFormData={ props.setFormData }
                seccionMenu={ props.seccionMenu } 
                defaultValue={ value }
                disabled={ disabled }
                filters={ filters } />
        }
        if( input.inputType === "textarea" )
            return <InputTextArea 
                key={ input.inputName }
                inputData={ input }
                stateFormData={ props.setFormData } 
                text={ value } />
        if( input.inputType === "checkbox" )
            return <InputCheckbox 
                key={ input.inputName }
                inputData={ input }
                stateFormData={ props.setFormData } 
                text="0" />
        return null
    }

    const getDefaultValues = () => {
        if(props.defaultValues?.[props.seccionMenu]){
            return props.defaultValues[props.seccionMenu];
        }
        return [];
    }

    const defaultValues = getDefaultValues();

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
                    <button 
                        type="submit" 
                        className="button is-fullwidth" 
                        disabled={ props.buttonDisabled }>
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