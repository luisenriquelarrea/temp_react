const Navbar = (props: any) => {
    const handleAction = (action: string) => {
        if(props.btnFilterDisabled)
            return;
        if(props.functions[action]){
            props.functions[action]();
        }
    }

    return (
        <nav role="navigation" aria-label="main navigation">
            <div className="navbar-item">
                <div className="buttons">
                {props.navbarActions.map((action: any) => {
                    return(
                        <button 
                            key={ action.id } 
                            className="button is-light is-small"
                            disabled={ props.btnFilterDisabled }
                            onClick={() => handleAction(String(action.callMethod)) } >
                            { action.label }
                        </button>
                    )
                })}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;