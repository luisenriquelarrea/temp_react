interface InfoProps {
    label: string;
    cols: number;
    value: React.ReactNode;
}

const Info = (props: InfoProps) => {
    return (
        <div className={ `column is-${ props.cols }` }>
            <p className="has-text-grey is-size-7">{ props.label }</p>
            <p className="has-text-weight-medium" title={ String(props.value) }>
                { props.value ?? "—" }
            </p>
        </div>
    );
};

export default Info;