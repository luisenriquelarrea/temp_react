import Link from 'next/link';

const NavLink = (props: any) => {
    return (
        <Link 
            key={ props.seccion.descripcion }
            className="dropdown-item w3-button"
            href={ '/dashboard/'+props.seccion.descripcion+'/lista/' } >
            <p>
                { props.seccion.navbarLabel }
            </p>
        </Link> 
    );
}

export default NavLink;