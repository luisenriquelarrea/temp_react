const Alta = () => {
    return(
        <>
            <div className="columns is-multiline">
                <div className="column is-3" >
                    <div className="field">
                        <label className="label"> 
                            Nombre completo
                            <span v-if="input.input_required" className="input-required">*</span>
                        </label>
                        <div className="control">
                            <input className="input is-info" 
                                name="nombre_completo" 
                                type="text" 
                                placeholder="Nombre completo" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="column is-3">
                <button className="button">Guardar</button>
            </div>
        </>
    );
}

export default Alta;