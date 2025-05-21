const BookMark = (props: any) => {
    return (
        <div className={ `column is-${ props.inputData.inputCols }` } >
            <div className="separator-text">
                <span>{ props.inputData.inputLabel }</span>
            </div>
        </div>
    );
}

export default BookMark;