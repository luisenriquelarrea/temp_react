import NavLinks from '@/app/ui/dashboard/NavLinks';

const SideNav = () => {
    return (
        <nav className="w3-sidebar w3-collapse w3-white my-sidebar">
            <br/>
            <div className="w3-container w3-row">
                <div className="w3-col s4">
                
                </div>
                <div className="w3-col s8 w3-bar">

                </div>
            </div>
            <hr/>
            <div className="w3-bar-block">
                <NavLinks />
            </div>
        </nav>
    );
};

export default SideNav;