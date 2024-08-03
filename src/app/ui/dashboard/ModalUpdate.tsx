import { useState } from "react";
import InputText  from './InputText';
import InputSelect  from './InputSelect';
import InputCheckbox from "./InputCheckbox";
import InputTextArea from "./InputTextArea";
import InputFile from "./InputFile";
import Section from "./Section";
import MessageBox from "./MessageBox";
import { updateRecord } from '../../api';
import { SeccionMenuInput } from '../../entities';
import { uncapitalizeFirstLetter } from '../../funciones';
import Encabezado from "./Encabezado";

const ModalUpdate = (props: any) => {
    const [formData, setFormData] = useState(props.formdata);
    const [showMessageBox, setShowMessageBox] = useState(false);
    const [messageData, setMessageData] = useState({
        messageType: "",
        message: ""
    });

    const inputsText = ['text', 'number', 'password', 'date', 'datetime-local'];

    const performUpdate = (event: any) => {
        event.preventDefault();
        for (let [key, value] of Object.entries(formData))
            props.record[key] = value;
        updateRecord(props.seccionMenu, props.recordId, props.record).then(response => {
            if(!response.ok){
                console.log("Error al modificar registro");
                console.log(response);
                setMessageData({
                    messageType: "danger",
                    message: "Ocurrió un error al modificar registro."
                });
                setShowMessageBox(true);
                return;
            }
            response.json().then(data => {
                console.log(data);
                setMessageData({
                    messageType: "success",
                    message: "Éxito al modificar registro."
                });
                setShowMessageBox(true);
                props.setTable();
            })
        }).catch(error => console.error(error));
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
                inputData={ input }
                stateFormData={ setFormData }
                seccionMenu={ props.seccionMenu }
                defaultValue={ props.record[inputModelo!] === null ? 0 : props.record[inputModelo!][inputId!] } />
        }
        if( input.inputType === "textarea" )
            return <InputTextArea 
                key={ input.inputName }
                inputData={ input }
                stateFormData={ setFormData } 
                text={ props.record[inputName!] } />
        if( input.inputType === "file" )
            return <InputFile 
                key={ input.inputName }
                inputData={ input }
                stateFormData={ setFormData } />
        if( input.inputType === "checkbox" )
            return <InputCheckbox 
                key={ input.inputName }
                inputData={ input }
                stateFormData={ setFormData } 
                text={ props.record[inputName!] } />
        if( input.inputType === "section" )
        {
            input.inputCols = 12;
            return <Section 
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
                    <button type="submit" className="button is-fullwidth">Guardar cambios</button>
                </footer>
            </form>
        </div>
    );
}

export default ModalUpdate;