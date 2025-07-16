import { useState, useEffect } from "react";
import MessageBox from "./MessageBox";
import Formulario from "./Formulario";
import { 
    getInputs, 
    save 
} from '@/app/utils/api';
import { 
    objectClean, 
    flipStatus 
} from '@/app/utils/helpers';
import {
    User
} from '@/app/utils/entities';

interface AltaProps {
    user: User,
    seccionMenuId: number,
    seccionMenu: string
};

const Alta = (props: AltaProps) => {
    const initForm = {
        status: 1,
        userCreatedId: props.user.userId
    };
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [key, setKey] = useState(0);
    const [inputs, setInputs] = useState([]);
    const [formData, setFormData] = useState(initForm);
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
                setMessageData({
                    messageType: "success",
                    message: "Éxito al crear registro."
                });
                setFormData(initForm);
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
                userId={ props.user.userId }
                key={ key }
                inputs={ inputs }
                setFormData={ setFormData }
                handleSubmit={ handleSubmit }
                buttonDisabled={ buttonDisabled } />
            {
                Boolean(showMessageBox) ? <MessageBox data={messageData} /> : null
            }
        </>
    );
}

export default Alta;