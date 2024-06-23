import { useState, useEffect } from "react";
import InputTextFilter  from './InputTextFilter';
import { getInputs, getSeccionMenuListFiltered } from '../../api';
import { SeccionMenuInput } from '../../entities';
import { objectClean } from '../../funciones';

const Filters = (props: any) => {
    const [inputs, setInputs] = useState([]);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        getInputs(props.seccionMenuId, 'filtro').then(response => {
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
        if(input.inputType === "text")
            return <InputTextFilter 
                key={ input.inputName }
                inputData={ input }
                stateFormData={ setFormData } 
                text="" />
        return null
    }

    const handleSubmit = () => {
        console.log(objectClean(formData));
        getSeccionMenuListFiltered(props.seccionMenu, objectClean(formData)).then(response => {
            if(!response.ok){
                console.log("Error al obtener lista filtrada");
                console.log(response);
                return;
            }
            response.json().then(data => {
                props.setTable(data);
            })
        }).catch(error => console.error(error));
    }

    return(
        <>
            <div className="columns is-multiline">
                {inputs.map((input: SeccionMenuInput) => {
                    return (
                        renderInput(input)
                    );
                })}
                <div className="column is-1">
                    <button onClick={ handleSubmit } className="button is-info is-small is-fullwidth">Filtrar</button>
                </div>
                <div className="column is-1">
                    <button onClick={ handleSubmit } className="button is-info is-small is-fullwidth">Limpiar</button>
                </div>
            </div>
        </>
    );
}

export default Filters;