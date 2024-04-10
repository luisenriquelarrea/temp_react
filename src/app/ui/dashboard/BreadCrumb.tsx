const Breadcrumb = () => {
    return(
        <nav className="breadcrumb no-print" aria-label="breadcrumbs">
            <ul>
                <li className="my-bread"><b> Empleados </b></li>
                <li>
                    <a>Alta</a>
                </li>
                <li>
                    <a>Lista</a>
                </li>
            </ul>
        </nav>

    );
}

export default Breadcrumb;