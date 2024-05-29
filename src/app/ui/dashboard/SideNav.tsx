import NavLinks from '@/app/ui/dashboard/NavLinks';

const SideNav = () => {
    return (
        <nav className="w3-sidebar w3-collapse w3-white my-sidebar" id="mySidebar">
          <br/>
  <div className="w3-container w3-row">
    <div className="w3-col s4">
    
    </div>
    <div className="w3-col s8 w3-bar">
      <span>Welcome, <strong>Mike</strong></span><br/>
      <a href="#" className="w3-bar-item w3-button"><i className="fa fa-envelope"></i></a>
      <a href="#" className="w3-bar-item w3-button"><i className="fa fa-user"></i></a>
      <a href="#" className="w3-bar-item w3-button"><i className="fa fa-cog"></i></a>
    </div>
  </div>
  <hr/>
  <div className="w3-bar-block">
    <a href="#" className="w3-bar-item w3-button w3-padding-16 w3-hide-large w3-dark-grey w3-hover-black"  title="close menu"><i className="fa fa-remove fa-fw"></i>  Close Menu</a>
    <NavLinks />
  </div>
</nav>
    );
};

export default SideNav;