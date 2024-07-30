import { useState, useEffect } from "react";
import InputText  from './InputText';
import InputSelect  from './InputSelect';
import InputCheckbox from "./InputCheckbox";
import MessageBox from "./MessageBox";
import { getInputs, save } from '../../api';
import { SeccionMenuInput } from '../../entities';
import { objectClean } from '../../funciones';

const Alta = (props: any) => {
    const [inputs, setInputs] = useState([]);
    const [formData, setFormData] = useState({'status':1});
    const [inputsText, setInputsText] = useState<any>([]);
    const [showMessageBox, setShowMessageBox] = useState(false);
    const [messageData, setMessageData] = useState({
        messageType: "",
        message: ""
    });

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
                defaultValue="" />
        if( input.inputType === "checkbox" )
            return <InputCheckbox 
                key={ input.inputName }
                inputData={ input }
                stateFormData={ setFormData } 
                text="0" />
        return null
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();
        save(props.seccionMenu, objectClean(formData)).then(response => {
            if(!response.ok){
                console.log("Error al guardar registro");
                console.log(response);
                setMessageData({
                    messageType: "danger",
                    message: "Ocurrió un error al crear registro."
                });
                setShowMessageBox(true);
                return;
            }
            response.json().then(data => {
                console.log(data);
                setMessageData({
                    messageType: "success",
                    message: "Éxito al crear registro."
                });
                setShowMessageBox(true);
            })
        }).catch(error => console.error(error));
    }

    return(
        <>
            {
                Boolean(showMessageBox) ? <MessageBox data={messageData} /> : null
            }
            <form onSubmit={ handleSubmit }>
                <div className="columns is-multiline">
                {inputs.map((input: SeccionMenuInput) => {
                    return (
                        renderInput(input)
                    );
                })}
                </div>
                <div className="column is-3">
                    <button type="submit" className="button is-fullwidth">Guardar</button>
                </div>
            </form>
            {
                Boolean(showMessageBox) ? <MessageBox data={messageData} /> : null
            }
        </>
    );
}

export default Alta;