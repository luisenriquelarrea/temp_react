import { SeccionMenuInput } from "@/app/utils/entities";

interface BookMarkProps {
    inputData: SeccionMenuInput
};

const BookMark = ({ inputData }: BookMarkProps) => {
    return (
        <>
            { inputData.newLine === 1
                ? <div style={{marginBottom: "-25px"}} className={ `column is-12` } ></div>
                : null
            }
            <div className={ `column is-${ inputData.inputCols }` } >
                <div className="separator-text">
                    <span>{ inputData.inputLabel }</span>
                </div>
            </div>
        </>
    );
}

export default BookMark;