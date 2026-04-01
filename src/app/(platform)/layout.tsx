import {
  PlatformMainPadding,
  SidebarProvider,
} from "@/components/layout/sidebar-context";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { MobileNav } from "@/components/layout/mobile-nav";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="min-h-dvh">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar isAdmin />
        </div>

        {/* Main Content — padding tracks sidebar width when collapsed */}
        <PlatformMainPadding>
          <TopBar />
          <main className="p-4 md:p-6 lg:p-8 pb-24 lg:pb-8">{children}</main>
        </PlatformMainPadding>

        {/* Mobile Bottom Nav */}
        <MobileNav />
      </div>
    </SidebarProvider>
  );
}
