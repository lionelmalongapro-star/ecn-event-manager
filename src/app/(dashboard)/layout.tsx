"use client";

import { useAuth } from "@/lib/auth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import Link from "next/link";
import { useI18n } from "@/i18n/context";
import { LayoutDashboard, Target, Flag, Handshake, Users, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { key: "dashboard" as const, href: "/", icon: LayoutDashboard },
  { key: "missions" as const, href: "/missions", icon: Target },
  { key: "milestones" as const, href: "/milestones", icon: Flag },
  { key: "pipeline" as const, href: "/pipeline", icon: Handshake },
  { key: "contacts" as const, href: "/contacts", icon: Users, adminOnly: true },
  { key: "settings" as const, href: "/settings", icon: Settings },
];

function MobileBottomNav() {
  const { t } = useI18n();
  const { user } = useAuth();
  const pathname = usePathname();
  const isAdmin = user?.role === "admin";
  const visible = navItems.filter((item) => !item.adminOnly || isAdmin);

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 flex border-t border-border bg-sidebar">
      {visible.map((item) => {
        const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.key}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors duration-150",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Icon className={cn("h-5 w-5", isActive && "drop-shadow-[0_0_6px_oklch(0.70_0.19_45/0.6)]")} />
            <span className="truncate max-w-[52px] text-center">{t.nav[item.key]}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">{children}</main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
