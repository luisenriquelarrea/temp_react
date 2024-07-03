import Link from 'next/link';

const NavLink = (props: any) => {
    return (
        <Link 
            key={ props.seccion.descripcion }
            className="w3-bar-item w3-button w3-padding"
            href={ '/dashboard/'+props.seccion.descripcion } >
            <p>
                <i className={`fa fa-${props.seccion.icon} fa-fw`}></i> 
                { props.seccion.navbarLabel }
            </p>
        </Link> 
    );
}

export default NavLink;