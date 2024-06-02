import { SeccionMenuInput } from '../../entities';

const InputText = (props: any) => {
    return(
        <>
            <div className={ `column is-${props.inputData.cols}` } >
                <div className="field">
                    <label className="label"> 
                        { props.inputData.inputLabel }
                        { (parseInt(props.inputData.inputRequired) === 1) 
                            ? <span className="input-required">*</span> 
                            : null 
                        }
                    </label>
                    <div className="control">
                        <input className="input is-info" 
                            name={ props.inputData.inputName }
                            type="text" 
                            placeholder={ props.inputData.inputLabel } />
                    </div>
                </div>
            </div>
        </>
    );
}

export default InputText;