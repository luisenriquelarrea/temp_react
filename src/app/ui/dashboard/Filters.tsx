import { useEffect } from "react";
import InputTextFilter  from './InputTextFilter';
import InputSelectFilter  from './InputSelectFilter';
import InputDatesFilter  from './InputDatesFilter';
import InputCheckboxFilter  from './InputCheckboxFilter';
import { SeccionMenuInput } from '../../entities';

const Filters = (props: any) => {
    const inputs = props.inputsFilters;
    const inputsText = ['text', 'number', 'password', 'date'];

    useEffect(() => {
        window.addEventListener('keypress', e => {
            if(e.key === 'Enter')
                document.getElementById('btn')?.click();   
        });
    }, []);

    const renderInput = (input: SeccionMenuInput) => {
        input.inputCols = 2;
        if( inputsText.includes(String(input.inputType)) ){
            if(input.inputType === "date")
                return <InputDatesFilter
                    key={ input.inputName }
                    inputData={ input }
                    stateFormData={ props.setFilterData } /> 
            return <InputTextFilter 
                key={ input.inputName }
                inputData={ input }
                stateFormData={ props.setFilterData } 
                text=""
                showLabel={ true } />
        }
        if(input.inputType === "select")
             return <InputSelectFilter 
                key={ input.inputName }
                inputData={ input }
                stateFormData={ props.setFilterData }
                seccionMenu={ props.seccionMenu } 
                defaultValue="0" />
        if( input.inputType === "checkbox" )
            return <InputCheckboxFilter 
                key={ input.inputName }
                inputData={ input }
                stateFormData={ props.setFilterData } 
                text="0" />
        return null
    }

    const handleSubmit = () => {
        props.setCountFilteredList();
        props.setTable(0);
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
                    <button id="btn" onClick={ handleSubmit } className="button is-small is-fullwidth">Filtrar</button>
                </div>
            </div>
        </>
    );
}

export default Filters;