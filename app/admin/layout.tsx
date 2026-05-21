"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Book,
  Users,
  Tags,
  Settings,
  ShoppingCart,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* ================= NAV ITEM ================= */

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  active: boolean;
  onClick: () => void;
}

function NavItem({
  href,
  icon,
  label,
  collapsed,
  active,
  onClick,
}: NavItemProps) {
  return (
    <div className="relative group">
      <Link
        href={href}
        onClick={onClick}
        className={`
          flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all
          ${
            active
              ? "bg-indigo-100 text-indigo-700 font-medium"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }
        `}
      >
        <span className="shrink-0">{icon}</span>
        {!collapsed && <span className="truncate">{label}</span>}
      </Link>

      {/* Tooltip when collapsed */}
      {collapsed && (
        <div
          className="
            absolute left-full top-1/2 -translate-y-1/2 ml-3
            whitespace-nowrap rounded-md bg-black text-white text-xs
            px-2 py-1 opacity-0 scale-95
            group-hover:opacity-100 group-hover:scale-100
            transition-all duration-150
            pointer-events-none z-50
          "
        >
          {label}
        </div>
      )}
    </div>
  );
}

/* ================= LAYOUT ================= */

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "/admin", label: "Dashboard", icon: <LayoutDashboard /> },
    { href: "/admin/books", label: "Books", icon: <Book /> },
    { href: "/admin/authors", label: "Authors", icon: <Users /> },
    { href: "/admin/category", label: "Categories", icon: <Tags /> },
    { href: "/admin/orders", label: "Orders", icon: <ShoppingCart /> },
    { href: "/admin/settings", label: "Settings", icon: <Settings /> },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  /* ================= CLOSE ON OUTSIDE CLICK ================= */
  useEffect(() => {
    if (!mobileOpen) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // ignore sidebar clicks
      if (target.closest("aside")) return;

      setMobileOpen(false);
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [mobileOpen]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ================= OVERLAY (mobile) ================= */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          bg-white border-r
          transition-all duration-300
          w-64
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          ${collapsed ? "lg:w-16" : "lg:w-64"}
        `}
      >
        <nav className="p-2 pt-6 space-y-1">
          {links.map((l) => (
            <NavItem
              key={l.href}
              href={l.href}
              icon={l.icon}
              label={l.label}
              collapsed={collapsed}
              active={isActive(l.href)}
              onClick={() => setMobileOpen(false)}
            />
          ))}
        </nav>

        {/* collapse button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="
            hidden lg:flex absolute top-1/2 -right-4 -translate-y-1/2
            h-9 w-9 items-center justify-center
            rounded-full bg-white border shadow
            hover:bg-gray-50 transition
          "
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </aside>

      {/* ================= MAIN AREA ================= */}
      <div
        className={`
          flex-1 min-w-0 transition-all duration-300
          ${collapsed ? "lg:ml-16" : "lg:ml-64"}
        `}
      >
        {/* ================= NAVBAR ================= */}
        <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-4">
            {/* mobile menu button */}
            <button
              className="lg:hidden rounded-md p-2 hover:bg-gray-100 transition"
              onClick={() => setMobileOpen(true)}
            >
              <Menu />
            </button>

            {/* title */}
            <h1 className="text-sm font-semibold tracking-wide text-gray-700">
              Admin Panel
            </h1>

            {/* VIEW STORE */}
            <Link
              href="/"
              className="
                text-sm font-medium text-gray-600
                hover:text-black transition
                px-3 py-1.5 rounded-md
                hover:bg-gray-100
              "
            >
              View Store
            </Link>
          </div>
        </header>

        {/* ================= CONTENT ================= */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
