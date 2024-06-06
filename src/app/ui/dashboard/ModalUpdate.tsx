import { useState, useEffect } from "react";
import InputText  from './InputText';
import InputSelect  from './InputSelect';
import { getInputs, save } from '../../api';
import { SeccionMenuInput } from '../../entities';

const ModalUpdate = (props: any) => {
    const [inputs, setInputs] = useState([]);
    const [formData, setFormData] = useState({});

    useEffect(() => {
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
    }, []);

    const renderInput = (input: SeccionMenuInput) => {
        if(input.inputType === "text")
            return <InputText 
                key={ input.inputName }
                inputData={ input }
                stateFormData={ setFormData } />
        if(input.inputType === "select")
            return <InputSelect 
                key={ input.inputName }
                inputData={ input }
                stateFormData={ setFormData }
                seccionMenu={ props.seccionMenu } />
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