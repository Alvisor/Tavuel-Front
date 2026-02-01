"use client";

import { usePathname } from "next/navigation";
import { Bell, ChevronRight, CircleUser } from "lucide-react";
import { useState } from "react";

const routeLabels: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/users": "Usuarios",
  "/providers": "Proveedores",
  "/bookings": "Bookings",
  "/pqrs": "PQRS",
  "/payments": "Pagos",
  "/reports": "Reportes",
  "/settings": "Configuración",
};

export function Header() {
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const currentLabel = routeLabels[pathname] || "Dashboard";

  const handleLogout = () => {
    localStorage.removeItem("tavuel_token");
    window.location.href = "/login";
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm">
        <span className="text-muted-foreground">Admin</span>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="font-medium text-foreground">{currentLabel}</span>
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive" />
          </span>
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
          >
            <CircleUser className="h-5 w-5 text-muted-foreground" />
            <span className="hidden font-medium sm:inline-block">Admin</span>
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-md border border-border bg-popover p-1 shadow-lg">
                <div className="px-3 py-2 text-sm">
                  <p className="font-medium">Administrador</p>
                  <p className="text-muted-foreground">admin@tavuel.com</p>
                </div>
                <div className="my-1 h-px bg-border" />
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center rounded-sm px-3 py-2 text-sm text-destructive hover:bg-accent"
                >
                  Cerrar sesión
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
