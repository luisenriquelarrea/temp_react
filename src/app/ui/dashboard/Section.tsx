const Section = (props: any) => {
    return (
        <div className={ `column is-${props.inputData.inputCols}` } >
            <div className="w3-panel w3-leftbar w3-light-grey w3-border-blue"
                style={{padding:"10px 16px"}}>
                <p>{ props.inputData.inputLabel }</p>
            </div>
        </div>
    );
}

export default Section;