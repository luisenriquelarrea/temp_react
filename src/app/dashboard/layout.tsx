import SideNav from '@/app/ui/dashboard/SideNav';
 
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="w3-bar w3-top w3-blue w3-large my-top-bar">
          <button className="w3-bar-item w3-button w3-hide-large w3-hover-none w3-hover-text-light-grey"><i className="fa fa-bars"></i>  Menu</button>
          <span className="w3-bar-item w3-right">Visual Studio Code</span>
      </div>
      <div className="my-sidebar">
          <SideNav />
      </div>
      <div>
        <div className="w3-main my-main" >
          {children}
        </div>
      </div>
    </>
  );
}

export default Layout;