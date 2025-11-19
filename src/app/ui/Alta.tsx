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
    SeccionMenuInput,
    User
} from '@/app/utils/entities';
import { MessageBoxT } from "../utils/types";

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
    const [key, setKey] = useState<number>(0);
    const [inputs, setInputs] = useState<SeccionMenuInput[]>([]);
    const [formData, setFormData] = useState(initForm);
    const [showMessageBox, setShowMessageBox] = useState<boolean>(false);
    const [messageData, setMessageData] = useState<MessageBoxT>({});

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

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setButtonDisabled(true);
        try {
            const response = await save(props.seccionMenu, objectClean(formData));
            let data;
            const contentType = response.headers.get("content-type") || "";
            const isJson = contentType.includes("application/json");
            if (isJson) {
                try {
                    data = await response.json();
                } catch (jsonError) {
                    console.warn("Failed to parse JSON from response:", jsonError);
                    data = null;
                }
            }
            if (!response.ok) {
                console.log("Error al guardar registro");
                console.log(response);
                const httpStatus = String(response.status);
                if (parseInt(httpStatus) === 422 && data && data.message) {
                    setMessageData({
                        messageType: "warning",
                        message: `(${httpStatus}) ${data.message}`
                    });
                } else {
                    setMessageData({
                        messageType: "danger",
                        message: "Ocurrió un error al crear registro."
                    });
                }
                setShowMessageBox(true);
                setButtonDisabled(false);
                return;
            }
            console.log(data || "Response OK without JSON payload");
            setMessageData({
                messageType: "success",
                message: "Éxito al crear registro."
            });
            setFormData(initForm);
            setShowMessageBox(true);
            setKey(flipStatus(key));
            setButtonDisabled(false);
        } catch (error) {
            console.error(error);
            setMessageData({
                messageType: "danger",
                message: "Error de red o inesperado al guardar registro."
            });
            setShowMessageBox(true);
            setButtonDisabled(false);
        }
    };    

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
                user={ props.user }
                buttonDisabled={ buttonDisabled } />
            {
                Boolean(showMessageBox) ? <MessageBox data={messageData} /> : null
            }
        </>
    );
}

export default Alta;