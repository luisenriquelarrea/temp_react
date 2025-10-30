import { MessageBoxT } from "@/app/utils/types";
interface MessageBoxProps {
    data: MessageBoxT
};
const MessageBox = ({ data }: MessageBoxProps) => {
    const getIconClass = (): string => {
        switch (data.messageType) {
            case "info":
                return "fa fa-info-circle";
            case "success":
                return "fa fa-check-circle";
            case "warning":
                return "fa fa-exclamation-triangle";
            case "danger":
                return "fa fa-times-circle";
            default:
                return "fa fa-info-circle";
        }
    };
    
    return (
        <div className={`message is-${data.messageType}`}>
            <div className="message-body is-flex is-align-items-center">
                <i className={`${getIconClass()} mr-2`} aria-hidden="true"></i>
                <span>{data.message}</span>
            </div>
        </div>
    );
}

export default MessageBox;