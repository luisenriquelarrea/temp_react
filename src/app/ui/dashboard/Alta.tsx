import { useState, useEffect } from "react";
import InputText  from './InputText';
import InputSelect  from './InputSelect';
import InputCheckbox from "./InputCheckbox";
import { getInputs, save } from '../../api';
import { SeccionMenuInput } from '../../entities';
import { objectClean } from '../../funciones';

const Alta = (props: any) => {
    const [inputs, setInputs] = useState([]);
    const [formData, setFormData] = useState({});
    const [inputsText, setInputsText] = useState<any>([]);

    useEffect(() => {
        setInputsText(['text', 'password', 'date', 'number']);
        getInputs(props.seccionMenuId, 'alta').then(response => {
            if(!response.ok){
                console.log("Error al obtener inputs");
                console.log(response);
                return;
            }
            response.json().then(data => {
                setInputs(data);
            })
        }).catch(error => console.error(error));
    }, []);

    const renderInput = (input: SeccionMenuInput) => {
        if( inputsText.includes(String(input.inputType)) )
            return <InputText 
                key={ input.inputName }
                inputData={ input }
                stateFormData={ setFormData } 
                text="" />
        if(input.inputType === "select")
            return <InputSelect 
                key={ input.inputName }
                inputData={ input }
                stateFormData={ setFormData }
                seccionMenu={ props.seccionMenu } 
                defaultValue="0" />
        if( input.inputType === "checkbox" )
            return <InputCheckbox 
                key={ input.inputName }
                inputData={ input }
                stateFormData={ setFormData } 
                text="0" />
        return null
    }

    const handleSubmit = () => {
        console.log(objectClean(formData));
        /*save(props.seccionMenu, objectClean(formData)).then(response => {
            if(!response.ok){
                console.log("Error al guardar registro");
                console.log(response);
                return;
            }
            response.json().then(data => {
                console.log(data);
            })
        }).catch(error => console.error(error));*/
    }

    return(
        <>
            <div className="columns is-multiline">
            {inputs.map((input: SeccionMenuInput) => {
                return (
                    renderInput(input)
                );
            })}
            </div>
            <div className="column is-2">
                <button onClick={ handleSubmit } className="button is-info is-fullwidth">Guardar</button>
            </div>
        </>
    );
}

export default Alta;