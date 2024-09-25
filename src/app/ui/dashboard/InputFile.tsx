import { toBase64 } from '../../funciones';

const InputFile = (props: any) => {

    const handleChange = (event: any) => {
        const id = event.target.id;
        const name = event.target.name;
        const file = event.target.files[0];
        (document.getElementById("span"+id) as HTMLInputElement).innerHTML = file.name;
        toBase64(file).then(strBase64 => {
            props.stateFormData((values: any) => ({...values, [name]: String(strBase64)}))
        });
    }

    return(
        <>
            { (parseInt(props.inputData.newLine) === 1) 
                ? <div style={{marginBottom: "-25px"}} className={ `column is-12` } ></div>
                : null
            }
            <div className={ `column is-${ props.inputData.inputCols }` } >
                <div className="field">
                    <div className="control">
                        <div className="file has-name is-fullwidth">
                            <label className="file-label">
                                <input 
                                    className="file-input" 
                                    type="file" 
                                    onChange={ handleChange } 
                                    id={ props.inputData.inputId } 
                                    name={ props.inputData.inputName }
                                    required={Boolean(parseInt(props.inputData.inputRequired))} />
                                <span className="file-cta">
                                    <span className="file-icon">
                                        <i className="fa fa-upload fa-fw"></i>
                                    </span>
                                    <span className="file-label"> { props.inputData.inputLabel } </span>
                                </span>
                                <span className="file-name" id={ `span${props.inputData.inputId}` }></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default InputFile;