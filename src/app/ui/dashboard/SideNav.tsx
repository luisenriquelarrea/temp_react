import NavLinks from '@/app/ui/dashboard/NavLinks';

const SideNav = () => {
    return (
        <nav className="w3-sidebar w3-collapse w3-white my-sidebar">
            <div className="w3-container w3-row">
                <div className="w3-col s4">
                    <i className="fa fa-users w3-xxxlarge"></i>
                </div>
                <div className="w3-col s8 w3-bar">
                    <span>Welcome, <strong>admin</strong></span><br/>
                    <a href="#" className="w3-bar-item w3-button"><i className="fa fa-envelope"></i></a>
                    <a href="#" className="w3-bar-item w3-button"><i className="fa fa-user"></i></a>
                    <a href="#" className="w3-bar-item w3-button"><i className="fa fa-cog"></i></a>
                </div>
            </div>
            <hr></hr>
            <div className="w3-bar-block">
                <NavLinks />
            </div>
        </nav>
    );
};

export default SideNav;