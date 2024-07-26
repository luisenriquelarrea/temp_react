import { useState, useEffect } from "react";
import InputText  from './InputText';
import InputSelect  from './InputSelect';
import InputCheckbox from "./InputCheckbox";
import InputTextArea from "./InputTextArea";
import InputFile from "./InputFile";
import Section from "./Section";
import MessageBox from "./MessageBox";
import { getById, updateRecord } from '../../api';
import { SeccionMenuInput } from '../../entities';
import { uncapitalizeFirstLetter } from '../../funciones';

const ModalUpdate = (props: any) => {
    const [formData, setFormData] = useState({});
    const [showMessageBox, setShowMessageBox] = useState(false);
    const [messageData, setMessageData] = useState({
        messageType: "",
        message: ""
    });

    const inputsText = ['text', 'number', 'password', 'date', 'datetime-local'];

    const performUpdate = (obj: any) => {
        for (let [key, value] of Object.entries(formData))
            obj[key] = value;
        updateRecord(props.seccionMenu, props.recordId, obj).then(response => {
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

    const handleSubmit = () => {
        getById(props.seccionMenu, props.recordId).then(response => {
            if(!response.ok){
                console.log("Error al obtener registro");
                console.log(response);
                return;
            }
            performUpdate(props.record);
        }).catch(error => console.error(error));
    }

    const closeModal = () => {
        props.stateShowModal(false);
    }

    return (
        <div className="modal is-active">
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Modifica registro</p>
                    <button onClick={ closeModal } className="delete" aria-label="close" ></button>
                </header>
                <section className="modal-card-body">
                    {
                        Boolean(showMessageBox) ? <MessageBox data={messageData} /> : null
                    }
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
                    <button onClick={ handleSubmit } className="button is-fullwidth">Guardar cambios</button>
                </footer>
            </div>
        </div>
    );
}

export default ModalUpdate;