import SideNav from '@/app/ui/dashboard/SideNav';
import Header from '@/app/ui/dashboard/Header';
 
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <SideNav />
      <div className="w3-main my-main" >
          {children}
      </div>
    </>
  );
}

export default Layout;