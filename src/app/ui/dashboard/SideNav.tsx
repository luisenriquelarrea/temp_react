import NavLinks from '@/app/ui/dashboard/NavLinks';

const SideNav = () => {
    return (
        <>
            <aside className="menu my-nav no-print">
                <p className="menu-label">
                    General
                </p>
                <NavLinks />
            </aside>
        </>
    );
};

export default SideNav;