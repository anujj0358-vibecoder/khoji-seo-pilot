import { Outlet, useNavigate } from "react-router-dom";
import { DashboardSidebar } from "./DashboardSidebar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/khoji/Logo";
import { toast } from "sonner";

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    toast.success("Logged out");
    navigate("/");
  };
  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-background/80 backdrop-blur sticky top-0 z-40">
          <div className="md:hidden">
            <Logo size="sm" />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden sm:inline text-sm text-muted-foreground">founder@startup.in</span>
            <Button onClick={handleLogout} variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>
        <main className="flex-1 p-6 md:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};