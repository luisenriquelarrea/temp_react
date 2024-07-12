import { useState, useEffect } from "react";
import InputText  from './InputText';
import InputSelect  from './InputSelect';
import InputCheckbox from "./InputCheckbox";
import InputTextArea from "./InputTextArea";
import InputFile from "./InputFile";
import MessageBox from "./MessageBox";
import { getInputs, getById, updateRecord, uploadFile } from '../../api';
import { SeccionMenuInput } from '../../entities';
import { uncapitalizeFirstLetter, castNullToString, toBase64 } from '../../funciones';

const ModalUpdate = (props: any) => {
    const [data, setData] = useState<any>([]);
    const [inputs, setInputs] = useState([]);
    const [formData, setFormData] = useState({});
    const [fileData, setFileData] = useState<any>(null);
    const [inputsText, setInputsText] = useState<any>([]);
    const [showMessageBox, setShowMessageBox] = useState(false);
    const [showMessageFileBox, setShowMessageFileBox] = useState(false);
    const [messageData, setMessageData] = useState({
        messageType: "",
        message: ""
    });
    const [messageFile, setMessageFile] = useState({
        messageType: "",
        message: ""
    });

    const docRelacionadoData = {
        docRelacionado: "",
        docRelacionadoCargado: 0,
        docType: ""
    }

    useEffect(() => {
        setInputsText(['text', 'password', 'date', 'datetime-local']);
        getById(props.seccionMenu, props.recordId).then(response => {
            if(!response.ok){
                console.log("Error al obtener registro");
                console.log(response);
                return;
            }
            response.json().then(data => {
                setData(data);
                getInputs(props.seccionMenuId, 'modifica').then(response => {
                    if(!response.ok){
                        console.log("Error al obtener inputs");
                        console.log(response);
                        return;
                    }
                    response.json().then(data => {
                        console.log(data);
                        setInputs(data);
                    })
                }).catch(error => console.error(error));
            })
        }).catch(error => console.error(error));
    }, []);

    const performUpdate = (obj: any) => {
        for (let [key, value] of Object.entries(formData))
            obj[key] = value;
        for (let [key, value] of Object.entries(docRelacionadoData))
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
                text={ data[inputName!] === null ? "" : data[inputName!]} />
        if(input.inputType === "select")
        {
            let inputModelo = uncapitalizeFirstLetter(String(input.modelo));
            let inputId = input.inputId;
            return <InputSelect 
                key={ input.inputName }
                inputData={ input }
                stateFormData={ setFormData }
                seccionMenu={ props.seccionMenu }
                defaultValue={ data[inputModelo!] === null ? 0 : data[inputModelo!][inputId!] } />
        }
        if( input.inputType === "textarea" )
            return <InputTextArea 
                key={ input.inputName }
                inputData={ input }
                stateFormData={ setFormData } 
                text={ data[inputName!] } />
        if( input.inputType === "file" )
            return <InputFile 
                key={ input.inputName }
                inputData={ input }
                stateFileData={ setFileData } />
        if( input.inputType === "checkbox" )
            return <InputCheckbox 
                key={ input.inputName }
                inputData={ input }
                stateFormData={ setFormData } 
                text={ data[inputName!] } />
        return null
    }

    const handleSubmit = () => {
        getById(props.seccionMenu, props.recordId).then(response => {
            if(!response.ok){
                console.log("Error al obtener registro");
                console.log(response);
                return;
            }
            if(castNullToString(fileData) !== ""){
                toBase64(fileData).then(strBase64 => {
                    docRelacionadoData.docRelacionado = String(strBase64);
                    docRelacionadoData.docRelacionadoCargado = 1;
                    docRelacionadoData.docType = String(fileData.type);
                    response.json().then(data => {
                        performUpdate(data);
                    })
                });
            }
            else{
                response.json().then(data => {
                    performUpdate(data);
                })
            }
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
                        Boolean(showMessageFileBox) ? <MessageBox data={messageFile} /> : null
                    }
                    {
                        Boolean(showMessageBox) ? <MessageBox data={messageData} /> : null
                    }
                    <div className="field" >
                        <div className="columns is-multiline">
                            {inputs.map((input: SeccionMenuInput) => {
                                return (
                                    renderInput(input)
                                );
                            })}
                        </div>
                    </div>
                    {
                        Boolean(showMessageFileBox) ? <MessageBox data={messageFile} /> : null
                    }
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