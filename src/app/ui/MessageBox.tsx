const MessageBox = (props: any) => {
    return (
        <div className={ `message is-${props.data.messageType}` }>
            <div className="message-body">
                { props.data.message }
            </div>
        </div>
    );
}

export default MessageBox;