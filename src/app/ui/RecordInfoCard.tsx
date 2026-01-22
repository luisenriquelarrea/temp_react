import { SeccionMenuInput } from "@/app/utils/entities";
import Info from "./Info";

interface RecordInfoCardProps {
    title: string;
    inputs: SeccionMenuInput[];
    record: { [key: string]: any };
}

const RecordInfoCard = (props: RecordInfoCardProps) => {
    const columnOk: React.CSSProperties = {
        color: "DodgerBlue",
        fontSize: "20px"
    };

    const columnsStatus = [0, 1];

    const getInfoValue = (column: SeccionMenuInput): React.ReactNode => {
        const inputName = column.inputName;
        const inputId = column.inputId;

        if (!inputName) return null;

        let value: any = props.record;

        if (inputName.includes(".")) {
            const parts = inputName.split(".");
            for (const part of parts) {
                if (value && typeof value === "object") {
                    value = value[part];
                } else {
                    return null;
                }
            }
            return inputId && value ? value[inputId] : value;
        }

        if (
            typeof props.record[inputName] === "object" &&
            props.record[inputName] !== null &&
            inputId
        ) {
            return props.record[inputName][inputId];
        }

        if (
            inputName.includes("status") &&
            columnsStatus.includes(Number(props.record[inputName]))
        ) {
            return Number(props.record[inputName]) ? renderIcon() : null;
        }

        return props.record[inputName];
    };

    const renderIcon = (): JSX.Element => {
        return <i className="fa fa-circle-check" style={columnOk}></i>;
    };

    return (
        <div className="card record-card">
            <header className="card-header">
                <p className="card-header-title">
                    { props.title }
                </p>
            </header>

            <div className="card-content">
                <div className="columns is-multiline ">
                    {props.inputs.map((input, index) => {
                        const infoValue = getInfoValue(input);

                        return (
                        <Info
                            key={`${input.inputName}-${index}`}
                            label={input.inputLabel ?? ""}
                            cols={ 6 }
                            value={infoValue}
                        />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default RecordInfoCard;
