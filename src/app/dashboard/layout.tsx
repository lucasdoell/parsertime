import { MainNav } from "@/components/dashboard/main-nav";
import { Search } from "@/components/dashboard/search";
import { TeamSwitcher } from "@/components/dashboard/team-switcher";
import Footer from "@/components/footer";
import { ModeToggle } from "@/components/theme-switcher";
import { UserNav } from "@/components/user-nav";
import { auth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <>
      <div className="hidden flex-col md:flex min-h-[90vh]">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <TeamSwitcher session={session} />
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <Search />
              <ModeToggle />
              <UserNav />
            </div>
          </div>
        </div>
        {children}
      </div>
      <Footer />
    </>
  );
}
