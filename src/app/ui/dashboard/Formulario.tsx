import InputText  from './InputText';
import InputFile  from './InputFile';
import InputTextArea  from './InputTextArea';
import InputSelect  from './InputSelect';
import InputCheckbox from "./InputCheckbox";
import { InputConf, SeccionMenuInput } from '../../entities';
import { getObjectValue, uncapitalizeFirstLetter } from '@/app/funciones';

const Formulario = (props: any) => {
    const inputsText = ['text', 'password', 'date', 'number'];

    const renderInput = (input: SeccionMenuInput) => {
        const inputConf: InputConf 
            = getObjectValue(defaultValues, String(input.inputName), {});
        let value = "";
        let disabled = false;
        let filters = {};
        if(Object.keys(inputConf).length > 0){
            value = getObjectValue(inputConf, "value", "");
            disabled = getObjectValue(inputConf, "disabled", false);
            filters = getObjectValue(inputConf, "filters", {});
        }
        if(Object.keys(record).length > 0){
            value = getObjectValue(record, String(input.inputName), "");
            if(input.inputType === "select"){
                const inputModelo = uncapitalizeFirstLetter(String(input.modelo));
                value = (record[inputModelo] === null) 
                    ? 0 
                    : record[inputModelo][input.inputId!]
            }
        }
        if( inputsText.includes(String(input.inputType)) )
            return <InputText 
                key={ input.inputName }
                inputData={ input }
                stateFormData={ props.setFormData } 
                text={ value }
                disabled={ disabled } />
        if( input.inputType === "file" )
            return <InputFile 
                key={ input.inputName }
                inputData={ input }
                stateFormData={ props.setFormData } />
        if(input.inputType === "select"){
            return <InputSelect 
                key={ input.inputName }
                inputData={ input }
                stateFormData={ props.setFormData }
                handleInputChange={ props.handleInputChange }
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

    const getValuesFromRecord = () => {
        if(props.record)
            return props.record;
        return {};
    }

    const record = getValuesFromRecord();

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
                        id="btnSiguiente"
                        type="submit" 
                        className="button is-fullwidth" 
                        disabled={ props.buttonDisabled }
                        style={ (props.styles !== undefined) ? props.styles : {} }>
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