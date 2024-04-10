'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { 
    name: 'Home', 
    href: '/dashboard', 
    //icon: HomeIcon 
  },
  {
    name: 'Empleados',
    href: '/dashboard/empleado',
    //icon: DocumentDuplicateIcon,
  },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        //const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href} >
            <p>{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}