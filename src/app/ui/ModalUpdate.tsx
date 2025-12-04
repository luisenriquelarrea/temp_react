import { useState } from "react";
import InputText  from './InputText';
import InputSelect  from './InputSelect';
import InputCheckbox from "./InputCheckbox";
import InputTextArea from "./InputTextArea";
import InputFile from "./InputFile";
import BookMark from "./BookMark";
import MessageBox from "./MessageBox";
import { updateRecord } from '@/app/utils/api';
import { SeccionMenuInput } from '@/app/utils/entities';
import Encabezado from "./Encabezado";
import { MessageBoxT } from "@/app/utils/types";
import { castNullToString, uncapitalizeFirstLetter } from "@/app/utils/helpers";

const ModalUpdate = (props: any) => {
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
    const [formData, setFormData] = useState(props.formdata);
    const [showMessageBox, setShowMessageBox] = useState<boolean>(false);
    const [messageData, setMessageData] = useState<MessageBoxT>({});

    const inputsText = ['text', 'number', 'password', 'date', 'datetime-local'];

    const performUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
        if(buttonDisabled)
            return;
        event.preventDefault();
        setButtonDisabled(true);
        const updatedRecord = { ...props.record, ...formData };
        try {
            const response = await updateRecord(props.seccionMenu, props.recordId, updatedRecord);
            const contentType = response.headers.get("content-type") || "";
            const isJson = contentType.includes("application/json");
            
            // Read the response body once as text
            const rawResponse = await response.text();
            
            // Attempt to parse JSON if applicable
            let data = null;
        
            if (isJson) {
                try {
                    data = JSON.parse(rawResponse);
                } catch (jsonError) {
                    console.warn("Failed to parse JSON from response:", jsonError);
                }
            }
            
            // Handle errors according to response.ok and parsed data
            if (!response.ok) {
                console.log(response);
                const httpStatus = response.status.toString();
        
                if (httpStatus === "500") {
                    setMessageData({
                        messageType: "danger",
                        message: "Ocurrió un error inesperado, contacta a tu equipo de sistemas."
                    });
                } else if (data?.message) {
                    setMessageData({
                        messageType: "warning",
                        message: `(${httpStatus}) ${data.message}`
                    });
                } else {
                    setMessageData({
                        messageType: "warning",
                        message: `(${httpStatus}) ${rawResponse || "Error desconocido"}`
                    });
                }
        
                setShowMessageBox(true);
                setButtonDisabled(false);
                return;
            }
            
            // Determine the message to show from rawResponse text
            const message = castNullToString(rawResponse) !== "" && !isJson ? rawResponse : "Éxito al guardar registro.";
            
            setMessageData({
                messageType: "success",
                message: message
            });
            setShowMessageBox(true);
            props.setTable(props.currentPage);
        } catch (error) {
            console.error(error);
            setMessageData({
                messageType: "danger",
                message: "Ocurrio un error de red, intente nuevamente."
            });
            setShowMessageBox(true);
            setButtonDisabled(false);
        }
    }

    const renderInput = (input: SeccionMenuInput) => {
        input.inputCols = 6;
        let inputName = input.inputName;
        if( inputsText.includes(String(input.inputType)) )
            return <InputText 
                key={ input.inputName }
                inputData={ input }
                stateFormData={ setFormData }
                text={ props.record[inputName!] === null ? "" : props.record[inputName!]} />
        if(input.inputType === "select")
        {
            let inputModelo = uncapitalizeFirstLetter(String(input.modelo));
            let inputId = input.inputId;
            return <InputSelect 
                key={ input.inputName }
                input={ input }
                stateFormData={ setFormData }
                defaultValue={ props.record[inputModelo!] === null ? 0 : props.record[inputModelo!][inputId!] } />
        }
        if( input.inputType === "textarea" ){
            input.inputCols = 12;
            return <InputTextArea 
                key={ input.inputName }
                inputData={ input }
                stateFormData={ setFormData } 
                text={ props.record[inputName!] } />
        }
        if( input.inputType === "file" ){
            input.inputCols = 12;
            return <InputFile 
                key={ input.inputName }
                inputData={ input }
                stateFormData={ setFormData } />
        }
        if( input.inputType === "checkbox" )
            return <InputCheckbox 
                key={ input.inputName }
                inputData={ input }
                stateFormData={ setFormData } 
                text={ props.record[inputName!] } />
        if( input.inputType === "bookmark" ){
            input.inputCols = 12;
            return <BookMark 
                key={ input.inputName }
                inputData={ input } />
        }
        return null
    }

    const closeModal = () => {
        props.stateShowModal(false);
    }

    return (
        <div className="modal is-active">
            <div className="modal-background"></div>
            <form className="modal-card" onSubmit={ performUpdate }>
                <header className="modal-card-head">
                    <p className="modal-card-title">{ props.titleModal }</p>
                    <button onClick={ closeModal } className="delete" aria-label="close" ></button>
                </header>
                <section className="modal-card-body">
                    {
                        Boolean(showMessageBox) ? <MessageBox data={messageData} /> : null
                    }
                    <Encabezado
                        seccionMenuId={ props.seccionMenuId }
                        seccionMenu={ props.seccionMenu } 
                        recordId={ props.recordId } />
                    <div className="field" >
                        <div className="columns is-multiline">
                            {props.inputs.map((input: SeccionMenuInput) => {
                                return (
                                    renderInput(input)
                                );
                            })}
                        </div>
                    </div>
                    {
                        Boolean(showMessageBox) ? <MessageBox data={messageData} /> : null
                    }
                </section>
                <footer className="modal-card-foot">
                    <button 
                        type="submit" 
                        className="button is-fullwidth" 
                        disabled={ buttonDisabled }>
                        Guardar cambios
                    </button>
                </footer>
            </form>
        </div>
    );
}

export default ModalUpdate;