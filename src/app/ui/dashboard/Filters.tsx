import { useState, useEffect } from "react";
import InputTextFilter  from './InputTextFilter';
import InputSelectFilter  from './InputSelectFilter';
import InputDatesFilter  from './InputDatesFilter';
import { getInputs, getSeccionMenuListFiltered } from '../../api';
import { SeccionMenuInput } from '../../entities';
import { objectClean } from '../../funciones';

const Filters = (props: any) => {
    const [inputs, setInputs] = useState([]);
    const [formData, setFormData] = useState({});
    const [inputsText, setInputsText] = useState<any>([]);

    useEffect(() => {
        setInputsText(['text', 'password', 'date']);
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
        window.addEventListener('keypress', e => {
            if(e.key === 'Enter')
                document.getElementById('btn')?.click();   
        });
    }, []);

    const renderInput = (input: SeccionMenuInput) => {
        if( inputsText.includes(String(input.inputType)) ){
            if(input.inputType === "date")
                return <InputDatesFilter
                    key={ input.inputName }
                    inputData={ input }
                    stateFormData={ setFormData } /> 
            return <InputTextFilter 
                key={ input.inputName }
                inputData={ input }
                stateFormData={ setFormData } 
                text="" />
        }
        if(input.inputType === "select")
             return <InputSelectFilter 
                key={ input.inputName }
                inputData={ input }
                stateFormData={ setFormData }
                seccionMenu={ props.seccionMenu } 
                defaultValue="0" />
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
                <div className="column is-12" style={{"padding": 0}}></div>
                <div className="column is-2">
                    <button id="btn" onClick={ handleSubmit } className="button is-info is-small is-fullwidth">Filtrar</button>
                </div>
            </div>
        </>
    );
}

export default Filters;