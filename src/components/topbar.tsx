"use client";

import { useI18n } from "@/i18n/context";
import { useAuth } from "@/lib/auth";
import { useThemeToggle } from "@/lib/theme";
import { Globe, LogOut, Sun, Moon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationBell } from "@/components/notifications";

export function Topbar() {
  const { t, locale, setLocale } = useI18n();
  const { user, logout } = useAuth();
  const { isDark, toggle } = useThemeToggle();

  const initials = user
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "?";

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-3 sm:px-6">
      {/* Left: event name on mobile, search on desktop */}
      <p className="text-sm font-semibold text-foreground truncate max-w-[160px] sm:hidden">
        CEMAC Summit
      </p>
      <div className="relative hidden sm:block w-full max-w-sm">
        <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input
          type="text"
          placeholder={t.common.search}
          className="h-9 w-full rounded-md border border-input bg-muted/40 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors duration-150 ease-out focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggle}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-95"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Language picker */}
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            <Globe className="h-4 w-4" />
            <span className="text-xs font-medium uppercase">{locale}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem
              onClick={() => setLocale("fr")}
              className={locale === "fr" ? "font-semibold text-primary" : ""}
            >
              Français
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setLocale("en")}
              className={locale === "en" ? "font-semibold text-primary" : ""}
            >
              English
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <NotificationBell />

        {/* Avatar / user menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="ml-0.5 flex items-center gap-2 rounded-md px-1.5 py-1 transition-colors duration-150 hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden min-w-0 lg:block text-left">
              <p className="truncate text-sm font-medium text-foreground">{user?.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.organization}</p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium text-foreground">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              {locale === "fr" ? "Déconnexion" : "Sign out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
