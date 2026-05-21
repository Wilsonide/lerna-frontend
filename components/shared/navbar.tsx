"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Menu, ShoppingCart, Search, X, Shield } from "lucide-react";
import { useSelector } from "react-redux";

import Container from "@/components/shared/container";
import { Input } from "@/components/ui/input";

import { RootState } from "@/app/features/store";
import useAuth from "@/app/hooks/useAuth";
import { UserButton } from "../auth/userButton";

// 👇 NEW COMPONENT

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { auth } = useAuth();

  const isAdmin = auth?.role === "ADMIN";

  const cartCount = useSelector((state: RootState) =>
    state.cart.items.reduce((t, i) => t + i.quantity, 0),
  );

  const navLinks = [
    { label: "Books", href: "/books" },
    { label: "Authors", href: "/author" },
    { label: "Categories", href: "/category" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-xl">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          {/* LOGO */}
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-slate-900"
          >
            Bookstore
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative text-sm font-medium transition ${
                    isActive ? "text-black" : "text-slate-500 hover:text-black"
                  }`}
                >
                  {link.label}

                  <span
                    className={`absolute -bottom-1 left-0 h-[2px] bg-black transition-all ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}

            {/* ADMIN LINK */}
            {isAdmin && (
              <Link
                href="/admin"
                className="group relative flex items-center gap-2 text-sm font-semibold tracking-wide text-slate-600 transition hover:text-black"
              >
                <span className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 transition group-hover:border-black group-hover:bg-black group-hover:text-white">
                  <Shield className="h-4 w-4" />
                  Admin
                </span>

                <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-black transition-all group-hover:w-full" />
              </Link>
            )}
          </nav>

          {/* SEARCH */}
          <div className="hidden w-full max-w-sm items-center md:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search books..."
                className="h-11 rounded-xl pl-10"
              />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">
            {/* CART */}
            <Link href="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-slate-700" />

              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-black px-1 text-[10px] text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* 👇 REPLACED LOGIN/USER LOGIC */}
            <UserButton />

            {/* MOBILE MENU */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 hover:bg-slate-100 md:hidden"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`overflow-hidden transition-all md:hidden ${
            mobileMenuOpen ? "max-h-[500px] py-4" : "max-h-0"
          }`}
        >
          <div className="space-y-5 border-t pt-5">
            {/* SEARCH */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search books..."
                className="h-11 rounded-xl pl-10"
              />
            </div>

            {/* LINKS */}
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-black text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* ADMIN MOBILE */}
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
                >
                  <Shield className="h-4 w-4" />
                  Admin
                </Link>
              )}
            </nav>
          </div>
        </div>
      </Container>
    </header>
  );
}
