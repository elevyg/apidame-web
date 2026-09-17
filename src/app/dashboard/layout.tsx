import type { ReactNode } from "react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getAdminCatalog } from "@/lib/guide/queries";
import AdminSearch from "./AdminSearch";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const catalog = await getAdminCatalog();

  return (
    <main className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="page-shell border-rule border-b py-8">
        <AdminSearch items={catalog} />
      </div>
      {children}
      <SiteFooter />
    </main>
  );
}
