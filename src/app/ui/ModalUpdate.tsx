import { useState, Dispatch, SetStateAction } from "react";
import MessageBox from "./MessageBox";
import Encabezado from "./Encabezado";
import { MessageBoxT } from "@/app/utils/types";
import Formulario from "./Formulario";
import { SeccionMenuInput, User } from "@/app/utils/entities";

interface ModalUpdateProps {
    title: string;
    inputs: SeccionMenuInput[];
    performUpdate: () => Promise<MessageBoxT>;
    setFormData: Dispatch<SetStateAction<any>>;
    record: { [key: string]: any };
    setShowModal: Dispatch<SetStateAction<any>>;
    seccionMenuId: number;
    seccionMenu: string;
    user: User;
}
const ModalUpdate = (props: ModalUpdateProps) => {
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
    const [showMessageBox, setShowMessageBox] = useState<boolean>(false);
    const [messageData, setMessageData] = useState<MessageBoxT>({});

    const closeModal = () => {
        props.setShowModal(false);
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        if(buttonDisabled)
            return;
        event.preventDefault();
        setButtonDisabled(true);
        const response = await props.performUpdate();
        setMessageData(response);
        setShowMessageBox(true);
        setButtonDisabled(false);
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
                        setFormData={ props.setFormData }
                        handleSubmit={ handleSubmit }
                        seccionMenu={ props.seccionMenu }
                        buttonSize={ 12 }
                        user={ props.user }
                        buttonDisabled={ buttonDisabled }
                        record={ props.record } />
                </section>
                <footer className="modal-card-foot">
                    <div className="is-flex-grow-1">
                        { showMessageBox && <MessageBox data={ messageData } /> }
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default ModalUpdate;