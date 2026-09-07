"use client";

import RoleDashboardShell from "@/components/dashboard/role-dashboard-shell";
import { CONTRACTOR_NAV } from "@/lib/dashboard-nav";

export default function ContractorLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RoleDashboardShell
            role="contractor"
            profilePath="/contractor/profile"
            navItems={CONTRACTOR_NAV}
        >
            {children}
        </RoleDashboardShell>
    );
}
