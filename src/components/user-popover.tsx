"use client";

import { useState, useRef, useEffect } from "react";
import { useStore } from "@/lib/store";
import { getUserById, getMissionProgress } from "@/lib/mock-data";
import { useI18n } from "@/i18n/context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, Users, Eye, Target } from "lucide-react";
import { cn } from "@/lib/utils";

function roleInfo(role: string, locale: string) {
  switch (role) {
    case "admin":
      return { icon: <Shield className="h-3 w-3" />, label: locale === "fr" ? "Administrateur" : "Administrator", color: "text-cobalt" };
    case "team":
      return { icon: <Users className="h-3 w-3" />, label: locale === "fr" ? "Équipe" : "Team", color: "text-ecn-dark" };
    case "partner_ecn":
      return { icon: <Eye className="h-3 w-3" />, label: locale === "fr" ? "Partenaire ECN" : "ECN Partner", color: "text-muted-foreground" };
    default:
      return { icon: null, label: role, color: "text-muted-foreground" };
  }
}

export function UserPopover({ userId, children }: { userId: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<"below" | "above">("below");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const { state } = useStore();
  const { locale } = useI18n();

  const user = getUserById(userId);
  if (!user) return <>{children}</>;

  const userMissions = state.missions.filter((m) => m.assignees.includes(userId));
  const completedCount = userMissions.filter((m) => m.status === "completed").length;
  const inProgressCount = userMissions.filter((m) => m.status === "in_progress").length;
  const overdueCount = userMissions.filter((m) => m.status !== "completed" && new Date(m.deadline) < new Date()).length;

  const initials = user.name.split(" ").map((n) => n[0]).join("").toUpperCase();
  const role = roleInfo(user.role, locale);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        popoverRef.current && !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleOpen = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition(rect.bottom + 240 > window.innerHeight ? "above" : "below");
    }
    setOpen(!open);
  };

  return (
    <span className="relative inline-flex">
      <button
        ref={triggerRef}
        onClick={(e) => { e.stopPropagation(); handleOpen(); }}
        className="inline-flex h-5 items-center rounded-full bg-muted px-1.5 text-[10px] font-medium text-muted-foreground transition-colors duration-100 hover:bg-primary/10 hover:text-primary"
      >
        {children}
      </button>

      {open && (
        <div
          ref={popoverRef}
          className={cn(
            "absolute left-0 z-50 w-64 rounded-lg border border-border bg-popover p-0 shadow-lg",
            "animate-in fade-in-0 zoom-in-95 duration-150",
            position === "below" ? "top-full mt-1.5" : "bottom-full mb-1.5"
          )}
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-border p-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className={cn(
                "text-sm font-semibold",
                user.role === "admin" && "bg-cobalt/10 text-cobalt",
                user.role === "team" && "bg-ecn/10 text-ecn-dark",
                user.role === "partner_ecn" && "bg-muted text-muted-foreground"
              )}>
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">{user.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={cn("flex items-center gap-1 text-xs", role.color)}>
                  {role.icon}
                  {role.label}
                </span>
                <span className="text-muted-foreground/40">·</span>
                <span className="text-xs text-muted-foreground">{user.organization}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
            <div className="p-2.5 text-center">
              <p className="text-lg font-semibold tabular-nums text-foreground">{userMissions.length}</p>
              <p className="text-[10px] text-muted-foreground">{locale === "fr" ? "Missions" : "Missions"}</p>
            </div>
            <div className="p-2.5 text-center">
              <p className="text-lg font-semibold tabular-nums text-success">{completedCount}</p>
              <p className="text-[10px] text-muted-foreground">{locale === "fr" ? "Terminées" : "Done"}</p>
            </div>
            <div className="p-2.5 text-center">
              <p className={cn("text-lg font-semibold tabular-nums", overdueCount > 0 ? "text-danger" : "text-foreground")}>{overdueCount}</p>
              <p className="text-[10px] text-muted-foreground">{locale === "fr" ? "En retard" : "Overdue"}</p>
            </div>
          </div>

          {/* Active missions */}
          {userMissions.filter(m => m.status !== "completed").length > 0 && (
            <div className="p-2.5">
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground mb-1.5">
                {locale === "fr" ? "Missions actives" : "Active missions"}
              </p>
              <div className="space-y-1.5">
                {userMissions
                  .filter((m) => m.status !== "completed")
                  .slice(0, 3)
                  .map((m) => {
                    const progress = getMissionProgress(m);
                    const isOverdue = new Date(m.deadline) < new Date();
                    return (
                      <div key={m.id} className="flex items-center gap-2">
                        <Target className={cn("h-3 w-3 shrink-0", isOverdue ? "text-danger" : "text-muted-foreground")} />
                        <span className="flex-1 truncate text-xs text-foreground">{m.title}</span>
                        <span className="text-[10px] tabular-nums text-muted-foreground">{progress}%</span>
                      </div>
                    );
                  })}
                {userMissions.filter(m => m.status !== "completed").length > 3 && (
                  <p className="text-[10px] text-muted-foreground">
                    +{userMissions.filter(m => m.status !== "completed").length - 3} {locale === "fr" ? "autres" : "more"}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </span>
  );
}
