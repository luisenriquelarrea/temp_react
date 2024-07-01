import { useState, useEffect } from "react";
import InputText  from './InputText';
import InputSelect  from './InputSelect';
import InputCheckbox from "./InputCheckbox";
import { getInputs, getById, updateRecord } from '../../api';
import { SeccionMenuInput } from '../../entities';
import { uncapitalizeFirstLetter } from '../../funciones';

const ModalUpdate = (props: any) => {
    const [data, setData] = useState<any>([]);
    const [inputs, setInputs] = useState([]);
    const [formData, setFormData] = useState({});
    const [inputsText, setInputsText] = useState<any>([]);

    useEffect(() => {
        setInputsText(['text', 'password', 'date']);
        getById(props.seccionMenu, props.recordId).then(response => {
            if(!response.ok){
                console.log("Error al obtener registro");
                console.log(response);
                return;
            }
            response.json().then(data => {
                //console.log(data.sucursal.id);
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
        if( input.inputType === "checkbox" )
            return <InputCheckbox 
                key={ input.inputName }
                inputData={ input }
                stateFormData={ setFormData } 
                text={ data[inputName!] } />
        return null
    }

    const handleSubmit = () => {
        console.log(formData);
        getById(props.seccionMenu, props.recordId).then(response => {
            if(!response.ok){
                console.log("Error al obtener registro");
                console.log(response);
                return;
            }
            response.json().then(data => {
                for (let [key, value] of Object.entries(formData))
                    data[key] = value;
                updateRecord(props.seccionMenu, props.recordId, data).then(response => {
                    if(!response.ok){
                        console.log("Error al modificar registro");
                        console.log(response);
                        return;
                    }
                    response.json().then(data => {
                        console.log(data);
                        props.setTable();
                    })
                }).catch(error => console.error(error));
            })
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
                    <div className="field" >
                        <div className="columns is-multiline">
                            {inputs.map((input: SeccionMenuInput) => {
                                return (
                                    renderInput(input)
                                );
                            })}
                        </div>
                    </div>
                </section>
                <footer className="modal-card-foot">
                    <button onClick={ handleSubmit } className="button is-info is-fullwidth">Guardar cambios</button>
                </footer>
            </div>
        </div>
    );
}

export default ModalUpdate;