import { useState, Dispatch, SetStateAction } from "react";
import MessageBox from "./MessageBox";
import { updateRecord } from '@/app/utils/api';
import { castNullToString } from '@/app/utils/helpers';
import Encabezado from "./Encabezado";
import { MessageBoxT } from "@/app/utils/types";
import Formulario from "./Formulario";
import { SeccionMenuInput, User } from "@/app/utils/entities";

interface ModalUpdateProps {
    title: string;
    inputs: SeccionMenuInput[];
    formdata: { [key: string]: any };
    record: { [key: string]: any };
    setShowModal: Dispatch<SetStateAction<any>>;
    seccionMenuId: number;
    seccionMenu: string;
    setTable: Dispatch<SetStateAction<any>>;
    currentPage: number;
    user: User;
}
const ModalUpdate = (props: ModalUpdateProps) => {
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
    const [formData, setFormData] = useState(props.formdata);
    const [showMessageBox, setShowMessageBox] = useState<boolean>(false);
    const [messageData, setMessageData] = useState<MessageBoxT>({});

    const performUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
        if(buttonDisabled)
            return;
        event.preventDefault();
        setButtonDisabled(true);
        const updatedRecord = { ...props.record, ...formData };
        try {
            const response = await updateRecord(props.seccionMenu, props.record.id, updatedRecord);
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
                console.log(response);
                const httpStatus = response.status.toString();
        
                if (httpStatus === "500") {
                    setMessageData({
                        messageType: "danger",
                        message: "Ocurrió un error inesperado, contacta a tu equipo de sistemas."
                    });
                } else if (data?.message) {
                    setMessageData({
                        messageType: "warning",
                        message: `(${httpStatus}) ${data.message}`
                    });
                } else {
                    setMessageData({
                        messageType: "warning",
                        message: `(${httpStatus}) ${rawResponse || "Error desconocido"}`
                    });
                }
        
                setShowMessageBox(true);
                setButtonDisabled(false);
                return;
            }
            
            // Determine the message to show from rawResponse text
            const message = castNullToString(rawResponse) !== "" && !isJson ? rawResponse : "Éxito al guardar registro.";
            
            setMessageData({
                messageType: "success",
                message: message
            });
            setShowMessageBox(true);
            props.setTable(props.currentPage);
        } catch (error) {
            console.error(error);
            setMessageData({
                messageType: "danger",
                message: "Ocurrio un error de red, intente nuevamente."
            });
            setShowMessageBox(true);
            setButtonDisabled(false);
        }
    }

    const closeModal = () => {
        props.setShowModal(false);
    }

    return (
        <div className="modal is-active">
            <div className="modal-background"></div>
            <div className="modal-card" >
                <header className="modal-card-head">
                    <p className="modal-card-title">{ props.title }</p>
                    <button onClick={ closeModal } className="delete" aria-label="close" ></button>
                </header>
                <section className="modal-card-body">
                    <Encabezado
                        seccionMenuId={ props.seccionMenuId }
                        seccionMenu={ props.seccionMenu } 
                        recordId={ props.record.id } />
                    <Formulario
                        inputs={ props.inputs }
                        setFormData={ setFormData }
                        handleSubmit={ performUpdate }
                        seccionMenu={ props.seccionMenu }
                        buttonSize={ 12 }
                        user={ props.user }
                        buttonDisabled={ buttonDisabled }
                        record={ props.record } />
                </section>
                <footer className="modal-card-foot">
                    <div className="is-flex-grow-1">
                        { showMessageBox && <MessageBox data={messageData} /> }
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default ModalUpdate;