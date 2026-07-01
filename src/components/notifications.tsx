"use client";

import { useStore } from "@/lib/store";
import { useI18n } from "@/i18n/context";
import { Bell, AlertTriangle, Flag, Handshake, Info, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

export function NotificationBell() {
  const { state, dispatch } = useStore();
  const { locale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = state.notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const icon = (type: string) => {
    switch (type) {
      case "overdue": return <AlertTriangle className="h-3.5 w-3.5 text-danger" />;
      case "milestone": return <Flag className="h-3.5 w-3.5 text-cobalt" />;
      case "pipeline": return <Handshake className="h-3.5 w-3.5 text-gold-dark" />;
      default: return <Info className="h-3.5 w-3.5 text-muted-foreground" />;
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-md p-2 text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <Bell className="h-4.5 w-4.5" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-80 rounded-lg border border-border bg-popover shadow-lg">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <h3 className="text-sm font-semibold text-foreground">
              {locale === "fr" ? "Notifications" : "Notifications"}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={() => dispatch({ type: "MARK_ALL_NOTIFICATIONS_READ" })}
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <Check className="h-3 w-3" />
                {locale === "fr" ? "Tout marquer lu" : "Mark all read"}
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {state.notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                {locale === "fr" ? "Aucune notification" : "No notifications"}
              </div>
            ) : (
              state.notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => dispatch({ type: "MARK_NOTIFICATION_READ", id: n.id })}
                  className={cn(
                    "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors duration-100 hover:bg-muted/50",
                    !n.read && "bg-primary/3"
                  )}
                >
                  <div className="mt-0.5">{icon(n.type)}</div>
                  <div className="min-w-0 flex-1">
                    <p className={cn("text-sm text-foreground", !n.read && "font-medium")}>{n.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                  </div>
                  {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
