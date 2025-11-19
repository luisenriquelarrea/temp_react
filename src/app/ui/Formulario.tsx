import { Dispatch, SetStateAction } from "react";
import InputText  from './InputText';
import InputFile  from './InputFile';
import InputTextArea  from './InputTextArea';
import InputSelect  from './InputSelect';
import InputCheckbox from "./InputCheckbox";
import BookMark from "./BookMark";
import { SeccionMenuInput, User } from '@/app/utils/entities';
import { getObjectValue, uncapitalizeFirstLetter } from '@/app/utils/helpers';
import InputFileMultiple from './InputFileMultiple';
import { DefaultValues, InputConf } from "@/app/utils/types";

interface FormularioProps {
    inputs: SeccionMenuInput[];
    setFormData: Dispatch<SetStateAction<any>>;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    handleInputChange?: (input: { [key: string]: any }) => void;
    record?: { [key: string]: any };
    defaultValues?: DefaultValues;
    seccionMenu?: string;
    buttonDisabled?: boolean;
    btnLabel?: string;
    buttonSize?: number;
    styles?: { [key: string]: any };
    user?: User
};
const Formulario = (props: FormularioProps) => {
    const inputsText = ['text', 'password', 'date', 'number'];

    const renderInput = (input: SeccionMenuInput) => {
        const inputConf: InputConf
            = getObjectValue(defaultValues, String(input.inputName), {});
        let value = "";
        let disabled = false;
        let filters = {};
        if(props.user !== undefined)
            filters = {
                ...filters,
                ...{
                    userId: props.user.userId
                }
            };
        if(Object.keys(inputConf).length > 0){
            value = getObjectValue(inputConf, "value", "");
            disabled = getObjectValue(inputConf, "disabled", false);
            filters = {
                ...filters,
                ...getObjectValue(inputConf, "filters", {})
            };
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
        if(input.selectFilters !== undefined && String(input.selectFilters) !== "")
            filters = {
                ...filters,
                ...JSON.parse(String(input.selectFilters))
            }
        if( inputsText.includes(String(input.inputType)) )
            return <InputText 
                key={ input.inputName }
                inputData={ input }
                stateFormData={ props.setFormData } 
                text={ value }
                disabled={ disabled } />
        if( input.inputType === "file" && input.multiple == 1 )
            return <InputFileMultiple 
                key={ input.inputName }
                inputData={ input }
                stateFormData={ props.setFormData } />
        if( input.inputType === "file" )
            return <InputFile 
                key={ input.inputName }
                inputData={ input }
                stateFormData={ props.setFormData } />
        if(input.inputType === "select"){
            return <InputSelect 
                key={ input.inputName }
                input={ input }
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
        if( input.inputType === "bookmark" )
            return <BookMark 
                key={ input.inputName }
                inputData={ input } />
        return null
    }

    const getValuesFromRecord = () => {
        if(props.record)
            return props.record;
        return {};
    }

    const record = getValuesFromRecord();

    const getDefaultValues = () => {
        if(props.defaultValues?.[props.seccionMenu!]){
            return props.defaultValues[props.seccionMenu!];
        }
        return [];
    }

    const defaultValues = getDefaultValues();

    const buttonSize = props.buttonSize !== undefined ? props.buttonSize : 3;

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
                <div className={`column is-${buttonSize}`}>
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