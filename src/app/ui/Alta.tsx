import { useState, useEffect } from "react";
import MessageBox from "./MessageBox";
import Formulario from "./Formulario";
import { getInputs, save } from '@/app/api';
import { objectClean, flipStatus } from '@/app/funciones';

const Alta = (props: any) => {
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [key, setKey] = useState(0);
    const [inputs, setInputs] = useState([]);
    const [formData, setFormData] = useState(props.initFormAlta);
    const [showMessageBox, setShowMessageBox] = useState(false);
    const [messageData, setMessageData] = useState({
        messageType: "",
        message: ""
    });

    useEffect(() => {
        getInputs(props.seccionMenuId, 'alta').then(response => {
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

    const handleSubmit = (event: any) => {
        event.preventDefault();
        setButtonDisabled(true);
        save(props.seccionMenu, objectClean(formData)).then(response => {
            if(!response.ok){
                console.log("Error al guardar registro");
                console.log(response);
                setMessageData({
                    messageType: "danger",
                    message: "Ocurrió un error al crear registro."
                });
                setShowMessageBox(true);
                setButtonDisabled(false);
                return;
            }
            response.json().then(data => {
                console.log(data);
                setMessageData({
                    messageType: "success",
                    message: "Éxito al crear registro."
                });
                setShowMessageBox(true);
                setKey(flipStatus(key));
                setButtonDisabled(false);
            })
        }).catch(error => console.error(error));
    }

    return(
        <>
            {
                Boolean(showMessageBox) ? <MessageBox data={messageData} /> : null
            }
            <Formulario
                key={ key }
                inputs={ inputs }
                setFormData={ setFormData }
                handleSubmit={ handleSubmit }
                buttonDisabled={ buttonDisabled }
                buttonSize={ props.buttonSize } />
            {
                Boolean(showMessageBox) ? <MessageBox data={messageData} /> : null
            }
        </>
    );
}

export default Alta;