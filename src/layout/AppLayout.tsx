import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import { cn } from "@/utils";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import Backdrop from "./Backdrop";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="h-screen xl:flex overflow-hidden">
      <AppSidebar />
      <Backdrop />

      <div
        className={cn(
          "flex-1 transition-[margin] duration-300 ease-in-out flex flex-col h-full overflow-hidden",
          isExpanded || isHovered ? "xl:ms-[260px]" : "xl:ms-16",
          isMobileOpen ? "ms-0" : "",
        )}
      >
        <AppHeader />
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6">
          <div className="mx-auto max-w-(--breakpoint-2xl)">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
