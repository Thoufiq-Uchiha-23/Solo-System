// src/components/Navbar.tsx
"use client";

import { useEffect, useRef, useState } from "react"; // NEW
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut, User, Home } from "lucide-react";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  // { href: "/goals", label: "Goals", icon: Zap },
  { href: "/profile", label: "Profile", icon: User },
];

// NEW: your tab shape, shared by the links and the sliding highlight
const TAB_SHAPE = "rounded-t-3xl rounded-bl-3xl rounded-br-lg";

// NEW: sliding highlight behind the active tab
const HIGHLIGHT = `absolute inset-y-0 left-0 ${TAB_SHAPE} border border-blue-400/30 bg-gradient-to-b from-[#2355c1]/30 to-[#042469]/30 shadow-[0_0_20px_rgba(55,108,223,0.3)] transition-transform duration-300 ease-out`;

// NEW: shared glass style
const GLASS =
  "border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_8px_32px_rgba(4,36,105,0.35)]";

export default function Nav3() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false); // NEW
  const menuRef = useRef<HTMLDivElement>(null); // NEW

  // NEW: close avatar menu on navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // NEW: close avatar menu on outside tap
  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [menuOpen]);

  // Hide navbar on login and register pages
  // (hooks stay ABOVE this early return)
  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  // NEW: values for the sliding highlight
  const activeIndex = NAV_LINKS.findIndex((l) => isActive(l.href));
  const count = NAV_LINKS.length;
  const highlightStyle = {
    width: `${100 / count}%`,
    transform: `translateX(${Math.max(activeIndex, 0) * 100}%)`,
    opacity: activeIndex === -1 ? 0 : 1,
  };

  // NEW: user helpers
  const displayName = session?.user?.name || session?.user?.email || "";
  const initial = displayName.charAt(0).toUpperCase();
  const authenticated = status === "authenticated" && !!session?.user;

  return (
    <>
      {/* CHANGED: floating glass pill instead of full-width bar */}
      <nav
        className={`mt-[100px] top-3 md:top-4 inset-x-3 md:inset-x-6 lg:inset-x-20 z-50 flex items-center justify-between rounded-3xl px-5 py-2.5 md:px-8 md:py-3 ${GLASS}`}
      >
        {/* Logo (CHANGED: smaller on mobile) */}
        <Link
          href="/dashboard"
          className="text-2xl md:text-3xl font-extralight font-solo bg-gradient-to-r from-[#2355c1] to-[#042469] bg-clip-text text-transparent hover:from-[#376cdf] hover:to-[#0740b9] transition-all"
        >
          Solo System
        </Link>

        {/* CHANGED: no longer hidden on mobile */}
        <div className="flex items-center gap-4 md:gap-6">
          {status === "loading" && (
            <span className="text-slate-400 text-sm">Loading...</span>
          )}

          {authenticated && (
            <>
              {/* CHANGED: desktop tabs with sliding highlight */}
              <div
                className="relative hidden md:grid font-aeo"
                style={{ gridTemplateColumns: `repeat(${count}, 9rem)` }}
              >
                <span aria-hidden className={HIGHLIGHT} style={highlightStyle} />
                {NAV_LINKS.map(({ href, label, icon: Icon }) => {
                  const active = isActive(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={`relative z-10 flex items-center justify-center gap-2 py-1.5 text-xl font-medium transition-colors duration-200 ${TAB_SHAPE} ${
                        active
                          ? "text-white"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${active ? "text-amber-400" : ""}`}
                      />
                      <span>{label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* CHANGED: desktop name + logout (hidden on mobile) */}
              <div className="hidden md:flex items-center gap-4 font-aeo">
                <span className="font-medium text-white text-xl">
                  {displayName}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="flex items-center gap-2 px-4 py-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-3xl transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium text-xl">Log out</span>
                </button>
              </div>

              {/* NEW: mobile avatar + dropdown */}
              <div className="relative md:hidden" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  aria-label="Account menu"
                  aria-expanded={menuOpen}
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
                    initial
                  )}
                </button>

                {menuOpen && (
                  <div
                    className={`absolute right-0 top-full mt-3 w-56 rounded-2xl p-2 font-aeo ${GLASS}`}
                  >
                    <p className="truncate px-3 py-2 text-lg text-white">
                      {displayName}
                    </p>
                    <button
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-lg text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* CHANGED: now visible on mobile too (was hidden md:flex) */}
          {status === "unauthenticated" && (
            <div className="flex items-center gap-1 md:gap-3">
              <Link
                href="/login"
                className="px-3 md:px-6 py-2 text-base md:text-lg font-aeo text-zinc-300 hover:text-white transition-colors"
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
      </nav>

      {/* NEW: mobile floating bottom tab bar */}
      {authenticated && (
        <nav
          aria-label="Main"
          className={`md:hidden fixed inset-x-4 z-50 rounded-3xl p-1.5 font-aeo ${GLASS}`}
          style={{ bottom: "calc(1rem + env(safe-area-inset-bottom))" }}
        >
          <div
            className="relative grid"
            style={{ gridTemplateColumns: `repeat(${count}, 1fr)` }}
          >
            <span aria-hidden className={HIGHLIGHT} style={highlightStyle} />
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`relative z-10 flex flex-col items-center gap-0.5 py-2 text-sm font-medium transition-colors duration-200 ${
                    active ? "text-white" : "text-slate-400"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${active ? "text-amber-400" : ""}`}
                  />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}