import Link from 'next/link';
import { Accion } from '@/app/utils/entities';

interface BreadcrumbsProps {
    seccionMenu: string,
    navbarLabel: string;
    breadcrumbs: Accion[];
}

export default function Breadcrumbs({ seccionMenu, navbarLabel, breadcrumbs }: BreadcrumbsProps) {
    const rutasMap: Record<string, string> = {
        create: `/dashboard/${seccionMenu}/nuevo`,
        read: `/dashboard/${seccionMenu}/lista`,
    };

    return (
        <nav className="breadcrumb no-print" aria-label="breadcrumbs">
            <ul>
                <li>
                    <span className="my-bread" style={{ color: 'black' }}>
                        <b>{navbarLabel}</b>
                    </span>
                </li>
                {breadcrumbs.map((breadcrumb) => {
                    const href = rutasMap[breadcrumb.callMethod!] || '#';
                    return (
                        <li key={breadcrumb.descripcion}>
                            <Link href={href} className="breadcrumb-link">
                                <i className={`fa fa-${breadcrumb.icon} fa-fw`}></i> {breadcrumb.label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}