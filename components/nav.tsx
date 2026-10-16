"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession } from "@/lib/session";

export function Nav() {
  const pathname = usePathname();
  const { user, logout } = useSession();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home", active: pathname === "/" },
    { href: "/games", label: "Library", active: pathname.startsWith("/games") },
    { href: "/hall-of-fame", label: "Hall of Fame", active: pathname === "/hall-of-fame" },
    { href: "/about", label: "About", active: pathname === "/about" },
  ];
  const authActive = pathname === "/auth";
  const close = () => setOpen(false);

  return (
    <>
      <nav className="av-nav">
        <Link href="/" className="logo" onClick={close}>
          <div className="logo-mark"></div>
          <div className="logo-text neon-cyan">
            ARCADE <span className="neon-magenta">VAULT</span>
          </div>
        </Link>
        <div className="links">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className={l.active ? "active" : ""}>
              {l.label}
            </Link>
          ))}
        </div>
        <div className="spacer"></div>
        <div className="coin-counter">
          <span className="coin"></span>
          <span>CREDITS · 03</span>
        </div>
        {user ? (
          <button type="button" className="btn ghost auth-btn" onClick={logout}>
            {user.name} ▾
          </button>
        ) : (
          <Link href="/auth" className="btn auth-btn">
            Sign in
          </Link>
        )}
        <button
          type="button"
          className="btn ghost hamburger"
          onClick={() => setOpen(true)}
          aria-label="Menu"
        >
          ≡
        </button>
      </nav>

      <div
        className={"av-mobile-backdrop" + (open ? " open" : "")}
        onClick={close}
      ></div>
      <aside className={"av-mobile-panel" + (open ? " open" : "")}>
        <div className="pixel neon-cyan" style={{ fontSize: 11, marginBottom: 16 }}>
          MENU
        </div>
        {navLinks.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={l.active ? "active" : ""}
            onClick={close}
          >
            {l.label}
          </Link>
        ))}
        <Link href="/auth" className={authActive ? "active" : ""} onClick={close}>
          {user ? "Account" : "Sign in"}
        </Link>
        <div style={{ flex: 1 }}></div>
        <div
          className="pixel"
          style={{ fontSize: 9, color: "var(--ink-faint)", letterSpacing: "0.16em" }}
        >
          CREDITS · 03
        </div>
      </aside>
    </>
  );
}
