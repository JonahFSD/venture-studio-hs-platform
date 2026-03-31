import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { MobileNav } from "@/components/layout/mobile-nav";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar isAdmin />
      </div>

      {/* Main Content */}
      <div className="lg:pl-[240px]">
        <TopBar />
        <main className="p-4 md:p-6 lg:p-8 pb-24 lg:pb-8">{children}</main>
      </div>

      {/* Mobile Bottom Nav */}
      <MobileNav />
    </div>
  );
}
