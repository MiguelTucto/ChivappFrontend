"use client";

import RoleDashboardShell from "@/components/dashboard/role-dashboard-shell";
import { MUSICIAN_NAV } from "@/lib/dashboard-nav";

export default function MusicianLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RoleDashboardShell
            role="musician"
            profilePath="/musician/profile"
            navItems={MUSICIAN_NAV}
        >
            {children}
        </RoleDashboardShell>
    );
}
