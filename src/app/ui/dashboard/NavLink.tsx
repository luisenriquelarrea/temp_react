import Link from 'next/link';

const NavLink = (props: any) => {
    return (
        <Link 
            key={ props.seccion.descripcion }
            className="dropdown-item"
            href={ '/dashboard/'+props.seccion.descripcion } >
            <p>
                { props.seccion.navbarLabel }
            </p>
        </Link> 
    );
}

export default NavLink;