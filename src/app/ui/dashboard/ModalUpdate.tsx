import { useState, useEffect } from "react";
import InputText  from './InputText';
import InputSelect  from './InputSelect';
import { getInputs, getById } from '../../api';
import { SeccionMenuInput } from '../../entities';

const ModalUpdate = (props: any) => {
    const [data, setData] = useState<any>([]);
    const [inputs, setInputs] = useState([]);
    const [formData, setFormData] = useState({});

    useEffect(() => {
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
                        //console.log(data);
                        setInputs(data);
                    })
                }).catch(error => console.error(error));
            })
        }).catch(error => console.error(error));
    }, []);

    const renderInput = (input: SeccionMenuInput) => {
        let inputName = input.inputName;
        if(input.inputType === "text"){
            return <InputText 
                key={ input.inputName }
                inputData={ input }
                stateFormData={ setFormData }
                text={ data[inputName!] } />
        }
        if(input.inputType === "select")
        {
            let inputModelo = input.modelo;
            let inputId = input.inputId;
            return <InputSelect 
                key={ input.inputName }
                inputData={ input }
                stateFormData={ setFormData }
                seccionMenu={ props.seccionMenu }
                defaultValue={ data[inputModelo!][inputId!] } />
        }
        return null
    }

    return (
        <div className="modal is-active">
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Modifica registro</p>
                    <button className="delete" aria-label="close" ></button>
                </header>
                <section className="modal-card-body">
                    <div className="field" >
                        <label className="label">  </label>
                        <div className="control">
                            {inputs.map((input: SeccionMenuInput) => {
                                return (
                                    renderInput(input)
                                );
                            })}
                        </div>
                    </div>
                </section>
                <footer className="modal-card-foot">
                    <button className="button is-info is-fullwidth">Guardar cambios</button>
                </footer>
            </div>
        </div>
    );
}

export default ModalUpdate;