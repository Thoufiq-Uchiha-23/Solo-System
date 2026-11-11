// src/components/Navbar.tsx
"use client";

import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut, User, Home, House, CircleUserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: House },
  // { href: "/goals", label: "Goals", icon: Zap },
  { href: "/profile", label: "Profile", icon: CircleUserRound },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // close on navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // close on outside tap
  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [menuOpen]);

  // Hide navbar on login and register pages
  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <nav className="bg-[#042469]/10 fixed flex justify-between w-full top-0 z-50">
      <div className="w-full mx-auto px-5 py-4 lg:px-20 lg:py-7 flex items-center justify-between backdrop-blur-xl">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="text-2xl md:text-3xl lg:text-4xl font-extralight font-solo bg-gradient-to-r from-[#2355c1] to-[#042469] bg-clip-text text-transparent hover:from-[#376cdf] hover:to-[#0740b9] transition-all"
        >
          Solo System
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-6">
          {status === "loading" && (
            <span className="text-slate-400 text-sm">Loading...</span>
          )}

          {status === "authenticated" && session?.user && (
            <>
              {/* Navigation Tabs */}
              <div className="hidden md:flex items-center p-1 gap-2 mx-auto">
                {NAV_LINKS.map(({ href, label, icon: Icon }) => {
                  const active = isActive(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`flex items-center gap-1 px-3 py-1 rounded-t-3xl rounded-bl-3xl rounded-br-lg transition-all duration-200 font-aeo text-base lg:text-xl font-medium ${
                        active
                          ? "bg-white/10 text-white border-[0.3px] border-white/3"
                          : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      <Icon className="w-4 h-4 lg:w-6 lg:h-6" />
                      <p>{label}</p>
                    </Link>
                  );
                })}
              </div>

              <div className="hidden md:block text-right font-aeo">
                <div className="font-medium text-white text-xl lg:text-2xl">
                  {session.user.name || session.user.email}
                </div>
              </div>

              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex items-center gap-2 px-4 py-2 font-aeo text-slate-300 hover:text-white hover:bg-slate-800 rounded-3xl transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline font-medium text-base lg:text-xl">
                  Log out
                </span>
              </button>

              {/* Avatar + dropdown (mobile only) */}
              <div className="relative md:hidden" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  aria-label="Account menu"
                  className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/10 font-aeo text-lg text-white"
                >
                  {session.user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={session.user.image}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    (session.user.name || session.user.email || "?")
                      .charAt(0)
                      .toUpperCase()
                  )}
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-full mt-3 w-56 rounded-2xl border border-white/10 bg-slate-900/90 p-2 font-aeo backdrop-blur-xl">
                    <p className="truncate px-3 py-2 text-lg text-white">
                      {session.user.name || session.user.email}
                    </p>
                    <button
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-lg text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      <LogOut className="w-4 h-4" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {status === "unauthenticated" && (
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className="px-3 md:px-6 py-2 text-base md:text-lg px-6 py-2 text-lg font-aeo text-zinc-300 hover:text-white transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-base md:text-lg font-aeo bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-full font-semibold transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile bottom navigation */}
      {status === "authenticated" && session?.user && (
        <div className="md:hidden fixed bottom-0 inset-x-0 z-50 flex justify-around py-1 bg-[#042469]/10 backdrop-blur-xl border-t border-white/10 font-aeo">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-0.5 px-4 py-1 text-xs font-medium transition-colors ${
                  active ? "text-white" : "text-slate-400"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="">{label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
