import { useState, useEffect } from "react";
import MessageBox from "./MessageBox";
import Formulario from "./Formulario";
import { getInputs, save } from '../../api';
import { objectClean, flipStatus } from '../../funciones';

const Alta = (props: any) => {
    const [key, setKey] = useState(0);
    const [inputs, setInputs] = useState([]);
    const [formData, setFormData] = useState({
        'status':1,
        'userCreatedId': props.user.userId
    });
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
        save(props.seccionMenu, objectClean(formData)).then(response => {
            if(!response.ok){
                console.log("Error al guardar registro");
                console.log(response);
                setMessageData({
                    messageType: "danger",
                    message: "Ocurrió un error al crear registro."
                });
                setShowMessageBox(true);
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
                handleSubmit={ handleSubmit } />
            {
                Boolean(showMessageBox) ? <MessageBox data={messageData} /> : null
            }
        </>
    );
}

export default Alta;