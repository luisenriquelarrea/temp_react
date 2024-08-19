import InputText  from './InputText';
import InputTextArea  from './InputTextArea';
import InputSelect  from './InputSelect';
import InputCheckbox from "./InputCheckbox";
import { SeccionMenuInput } from '../../entities';

const Formulario = (props: any) => {
    const inputsText = ['text', 'password', 'date', 'number'];

    const renderInput = (input: SeccionMenuInput) => {
        const value = (defaultValues[String(input.inputName)] !== undefined) 
            ?  defaultValues[String(input.inputName)] 
            : "";
        if( inputsText.includes(String(input.inputType)) )
            return <InputText 
                key={ input.inputName }
                inputData={ input }
                stateFormData={ props.setFormData } 
                text={ value } />
        if(input.inputType === "select"){
            const selectFilters 
                = (defaultValues[String(input.inputName)+"SelectFilters"] !== undefined) 
                ?  defaultValues[String(input.inputName)+"SelectFilters"] 
                : {};
            return <InputSelect 
                key={ input.inputName }
                inputData={ input }
                stateFormData={ props.setFormData }
                seccionMenu={ props.seccionMenu } 
                defaultValue={ value }
                selectFilters={ selectFilters } />
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