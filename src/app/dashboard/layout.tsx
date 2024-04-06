import SideNav from '@/app/ui/dashboard/SideNav';
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="columns">
        <div className="column is-one-quarter no-print">
            <SideNav />
        </div>
        <div className="column">
            {children}
        </div>
    </div>
  );
}