const Navbar = (props: any) => {
    const handleAction = (action: string) => {
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
                        <a 
                            key={ action.id } 
                            className="button is-light is-small"
                            onClick={() => handleAction(String(action.callMethod)) } >
                            { action.label }
                        </a>
                    )
                })}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;