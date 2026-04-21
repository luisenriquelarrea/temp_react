import Link from 'next/link';

interface NavLinkProps {
    seccion: {
        descripcion: string;
        navbarLabel: string;
    };
}

const NavLink = ({ seccion }: NavLinkProps) => {
    return (
        <Link 
            href={`/dashboard/${seccion.descripcion}/`} 
            className="dropdown-item w3-button w3-round w3-hover-light-gray">
            <p>{ seccion.navbarLabel }</p>
        </Link>
    );
};

export default NavLink;