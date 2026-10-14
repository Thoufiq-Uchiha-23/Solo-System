// src/components/Navbar.tsx
"use client";

import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut, Zap, User, Home } from "lucide-react";
import { useMemo } from "react";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  // { href: "/goals", label: "Goals", icon: Zap },
  { href: "/profile", label: "Profile", icon: User },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Hide navbar on login and register pages
  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  // Memoized active tab check
  const isActive = useMemo(
    () => (href: string) =>
      pathname === href || pathname.startsWith(href + "/"),
    [pathname],
  );

  return (
    <nav className="bg-[#2355c1]/10 fixed flex justify-between w-full top-0 z-50">
      <div className="w-full mx-auto px-20 py-7 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="text-4xl font-extralight font-solo bg-gradient-to-r from-[#2355c1] to-[#042469] bg-clip-text text-transparent hover:from-[#376cdf] hover:to-[#0740b9] transition-all"
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
              {/* Navigation Tabs - Only show when authenticated */}
              {status === "authenticated" && (
                <div className="hidden md:flex items-center p-1 gap-2 mx-auto">
                  {NAV_LINKS.map(({ href, label, icon: Icon }) => {
                    const active = isActive(href);
                    return (
                      <Link
                        key={href}
                        href={href}
                        className={`flex items-center gap-1 px-3 py-1 rounded-t-3xl rounded-bl-3xl rounded-br-lg transition-all duration-200 font-aeo text-xl font-medium ${
                          active
                            ? "bg-white/10 text-white border-[0.3px] border-white/3"
                            : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <p>{label}</p>
                      </Link>
                    );
                  })}
                </div>
              )}
              <div className="text-right font-aeo">
                <div className="font-medium text-white text-2xl">
                  {session.user.name || session.user.email}
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-3xl transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium text-xl">Log out</span>
              </button>
            </>
          )}

          {status === "unauthenticated" && (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-slate-300 hover:text-white transition-colors text-sm font-medium"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg font-medium text-sm transition-all"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
