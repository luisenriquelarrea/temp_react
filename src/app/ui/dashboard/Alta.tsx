import { useState, useEffect } from "react";
import InputText  from './InputText';
import { getInputs } from '../../api';
import { SeccionMenuInput } from '../../entities';

const Alta = (props: any) => {
    const [inputs, setInputs] = useState([]);

    useEffect(() => {
        getInputs(props.seccionMenuId, 'alta').then(response => {
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
                inputData={ input } />
        return null
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
                <button className="button is-info is-fullwidth">Guardar</button>
            </div>
        </>
    );
}

export default Alta;