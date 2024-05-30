import NavLinks from '@/app/ui/dashboard/NavLinks';

const SideNav = () => {
    return (
        <nav className="w3-sidebar w3-collapse w3-white my-sidebar">
            <div className="w3-bar-block">
                <NavLinks />
            </div>
        </nav>
    );
};

export default SideNav;