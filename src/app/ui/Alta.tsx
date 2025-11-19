import { useState, useEffect } from "react";
import MessageBox from "./MessageBox";
import Formulario from "./Formulario";
import { 
    getInputs, 
    save 
} from '@/app/utils/api';
import { 
    objectClean, 
    flipStatus, 
    castNullToString
} from '@/app/utils/helpers';
import {
    User
} from '@/app/utils/entities';
import { DefaultValues, Entity, MessageBoxT } from "@/app/utils/types";

interface AltaProps {
    user: User,
    seccionMenuId: number,
    seccionMenu: string,
    defaultValues?: DefaultValues;
    handleNewRecordResponse?: (response: Entity) => void;
};

const Alta = (props: AltaProps) => {
    const initForm = {
        status: 1,
        userCreatedId: props.user.userId,
        ...Object.fromEntries(
            Object.entries(props.defaultValues?.[props.seccionMenu] || {})
              .map(([k, v]) => [k, v.value])
        )
    };
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [key, setKey] = useState(0);
    const [inputs, setInputs] = useState([]);
    const [formData, setFormData] = useState(initForm);
    const [showMessageBox, setShowMessageBox] = useState(false);
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
            const contentType = response.headers.get("content-type") || "";
            const isJson = contentType.includes("application/json");
    
            // Read the response body once as text
            const rawResponse = await response.text();
    
            // Attempt to parse JSON if applicable
            let data = null;
            if (isJson) {
                try {
                    data = JSON.parse(rawResponse);
                } catch (jsonError) {
                    console.warn("Failed to parse JSON from response:", jsonError);
                }
            }
    
            // Handle errors according to response.ok and parsed data
            if (!response.ok) {
                console.log("Error al guardar registro");
                console.log(response);
                const httpStatus = response.status.toString();
    
                if (data && data.message) {
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
    
            // Determine the message to show from rawResponse text
            const message = castNullToString(rawResponse) !== "" && !isJson ? rawResponse : "Éxito al crear registro.";
    
            setMessageData({
                messageType: "success",
                message: message
            });
            setFormData(initForm);
            setShowMessageBox(true);
            setKey(flipStatus(key));
            setButtonDisabled(false);

            if(props.handleNewRecordResponse !== undefined)
                props.handleNewRecordResponse(data);
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
                seccionMenu={ props.seccionMenu }
                user={ props.user }
                buttonDisabled={ buttonDisabled }
                defaultValues={ props.defaultValues } />
            {
                Boolean(showMessageBox) ? <MessageBox data={messageData} /> : null
            }
        </>
    );
}

export default Alta;