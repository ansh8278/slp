import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/auth";
import { logout } from "@/app/admin/actions";
import { prisma } from "@/lib/db";
import { DoodleShield, DoodleMic, DoodleHeadphones } from "@/components/DoodleIcons";
import { SignOutButton } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Admin Portal — Security Leader Podcast", robots: { index: false, follow: false } };

const NAV = [
  { href: "/admin", label: "Episodes", icon: "🎙️" },
  { href: "/admin/content", label: "Site Content", icon: "✏️" },
  { href: "/admin/scripts", label: "Code Injector", icon: "⚡" },
  { href: "/admin/messages", label: "Inbox Messages", icon: "📬" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminPage();
  const unread = await prisma.contactMessage.count({ where: { read: false } });

  return (
    <div className="min-h-svh bg-gradient-to-b from-ink via-ink-2 to-ink text-bone">
      
      {/* Top Glassmorphic Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-steel/15 bg-ink-2/90 backdrop-blur-xl shadow-lg">
        <div className="mx-auto flex max-w-[1340px] flex-wrap items-center gap-x-8 gap-y-3 px-[clamp(16px,3vw,36px)] py-4">
          
          {/* Logo & Portal Identity */}
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-steel/20 bg-ink-3 p-1.5 shadow-md transition-transform duration-300 group-hover:scale-105">
              <Image src="/brand/logo.png" alt="Logo" fill sizes="36px" className="object-contain p-1" />
            </div>
            <div>
              <span className="block font-mono text-[9.5px] tracking-[0.25em] text-steel-dim uppercase">
                SECURITY LEADER PODCAST
              </span>
              <div className="flex items-center gap-2">
                <span className="font-display text-[17px] text-bone font-bold">Admin Portal</span>
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center gap-2 sm:ml-4">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="group flex items-center gap-2 rounded-full border border-steel/15 bg-ink-3/70 px-4 py-2 font-mono text-[11px] tracking-[0.14em] text-steel uppercase transition-all duration-300 hover:border-steel/40 hover:bg-ink-3 hover:text-bone hover:scale-105"
              >
                <span>{n.icon}</span>
                <span>{n.label}</span>
                {n.href === "/admin/messages" && unread > 0 && (
                  <span className="ml-1 rounded-full bg-red-500 px-2 py-0.5 text-[9.5px] font-bold text-white shadow-md animate-pulse">
                    {unread}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Right Action Tools */}
          <div className="flex flex-wrap items-center gap-3 sm:ml-auto sm:gap-4">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-full border border-steel/20 bg-ink-3 px-4 py-2 font-mono text-[11px] tracking-[0.14em] text-steel uppercase transition-all duration-300 hover:border-signal hover:text-bone hover:scale-105"
            >
              View Public Site ↗
            </Link>
            <SignOutButton action={logout} />
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-[1340px] px-[clamp(16px,3vw,36px)] py-[clamp(28px,5vh,52px)]">
        {children}
      </main>

    </div>
  );
}
