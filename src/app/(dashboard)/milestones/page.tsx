"use client";

import { useI18n } from "@/i18n/context";
import { milestones, getMissionProgress, getUserById, milestoneTitle, milestoneSuccessCondition, missionTitle } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, CheckCircle2, Circle, AlertTriangle, Flag, Clock, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDateLong } from "@/lib/format";

function milestoneStatusLabel(status: string, locale: string): string {
  const map: Record<string, Record<string, string>> = {
    en: { reached: "Reached", pending: "Pending", at_risk: "At Risk", not_started: "Not Started", in_progress: "In Progress" },
    fr: { reached: "Atteint", pending: "En attente", at_risk: "À risque", not_started: "Non commencé", in_progress: "En cours" },
  };
  return (map[locale] || map.en)[status] || status;
}

function statusColor(status: string) {
  switch (status) {
    case "reached": return "text-success border-success/30";
    case "in_progress": return "text-cobalt border-cobalt/30";
    case "at_risk": return "text-danger border-danger/30";
    case "not_started": return "text-muted-foreground border-border";
    default: return "text-muted-foreground border-border";
  }
}

function getDaysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
}

function responsibleLabel(resp: string, locale: string) {
  if (resp === "joint") return locale === "fr" ? "Conjoint" : "Joint";
  if (resp === "partner_ecn") return "ECN";
  const user = getUserById(resp);
  return user ? user.name.split(" ")[0] : resp;
}

export default function MilestonesPage() {
  const { locale } = useI18n();
  const { state } = useStore();
  const missions = state.missions;
  const isFr = locale === "fr";

  const sorted = [...milestones].sort(
    (a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
  );

  const reachedCount = milestones.filter((m) => m.status === "reached").length;
  const inProgressCount = milestones.filter((m) => m.status === "in_progress").length;
  const notStartedCount = milestones.filter((m) => m.status === "not_started" || m.status === "pending").length;
  const atRiskCount = milestones.filter((m) => m.status === "at_risk").length;
  const totalProgress = milestones.length > 0
    ? Math.round((reachedCount / milestones.length) * 100)
    : 0;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {isFr ? "Jalons" : "Milestones"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isFr ? "Chemin critique et points de contrôle" : "Critical path and checkpoints"}
        </p>
      </div>

      {/* Overall progress bar */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-foreground">
            {isFr ? "Progression globale" : "Overall Progress"}
          </p>
          <span className="text-sm font-semibold tabular-nums text-foreground">{reachedCount}/{milestones.length}</span>
        </div>
        <Progress value={totalProgress} className="h-2 [&_[data-slot=progress-indicator]]:bg-success" />
        <div className="mt-3 flex flex-wrap gap-4">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-success" />
            <span className="text-xs text-muted-foreground">{reachedCount} {isFr ? "atteints" : "reached"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-cobalt" />
            <span className="text-xs text-muted-foreground">{inProgressCount} {isFr ? "en cours" : "in progress"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Circle className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{notStartedCount} {isFr ? "à venir" : "upcoming"}</span>
          </div>
          {atRiskCount > 0 && (
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-danger" />
              <span className="text-xs text-danger font-medium">{atRiskCount} {isFr ? "à risque" : "at risk"}</span>
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

        <div className="space-y-0">
          {sorted.map((milestone) => {
            const linkedMissions = milestone.missionIds
              .map((id) => missions.find((m) => m.id === id))
              .filter(Boolean);
            const milestoneProgress = linkedMissions.length > 0
              ? Math.round(linkedMissions.reduce((sum, m) => sum + getMissionProgress(m!), 0) / linkedMissions.length)
              : milestone.status === "reached" ? 100 : 0;
            const daysUntil = getDaysUntil(milestone.targetDate);
            const isPast = daysUntil < 0;
            const isReached = milestone.status === "reached";

            return (
              <div key={milestone.id} className="relative pl-12 pb-6 last:pb-0">
                {/* Timeline dot */}
                <div
                  className={cn(
                    "absolute left-3 top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2",
                    isReached && "border-success bg-success/10",
                    milestone.status === "in_progress" && "border-cobalt bg-cobalt/10",
                    (milestone.status === "pending" || milestone.status === "not_started") && "border-muted-foreground/40 bg-background",
                    milestone.status === "at_risk" && "border-danger bg-danger/10"
                  )}
                >
                  {isReached ? (
                    <CheckCircle2 className="h-3 w-3 text-success" />
                  ) : milestone.status === "at_risk" ? (
                    <AlertTriangle className="h-3 w-3 text-danger" />
                  ) : milestone.status === "in_progress" ? (
                    <Clock className="h-3 w-3 text-cobalt" />
                  ) : (
                    <Circle className="h-3 w-3 text-muted-foreground/50" />
                  )}
                </div>

                <div className={cn(
                  "rounded-lg border bg-card transition-colors duration-150",
                  isReached ? "border-success/20 bg-success/2" : "border-border",
                  milestone.status === "at_risk" && "border-danger/20",
                )}>
                  {/* Milestone header */}
                  <div className="flex items-start justify-between gap-3 p-4 pb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className={cn("text-sm font-semibold", isReached ? "text-success" : "text-foreground")}>
                          {milestoneTitle(milestone, locale)}
                        </h3>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDateLong(milestone.targetDate, locale)}
                        </span>
                        <span className="text-muted-foreground/30">·</span>
                        <span className={cn(
                          isPast && !isReached ? "text-danger font-medium" : "text-muted-foreground"
                        )}>
                          {isReached
                            ? (isFr ? "Terminé" : "Complete")
                            : isPast
                            ? (isFr ? `${Math.abs(daysUntil)}j en retard` : `${Math.abs(daysUntil)}d overdue`)
                            : (isFr ? `dans ${daysUntil}j` : `in ${daysUntil}d`)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Percentage circle */}
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full border-2",
                        milestoneProgress === 100 ? "border-success bg-success/10" :
                        milestoneProgress > 0 ? "border-cobalt bg-cobalt/5" :
                        "border-border bg-muted/30"
                      )}>
                        <span className={cn(
                          "text-xs font-bold tabular-nums",
                          milestoneProgress === 100 ? "text-success" :
                          milestoneProgress > 0 ? "text-cobalt" :
                          "text-muted-foreground"
                        )}>
                          {milestoneProgress}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Success condition */}
                  <div className="px-4 pb-2">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground/80">{isFr ? "Condition" : "Must be true"}:</span>{" "}
                      {milestoneSuccessCondition(milestone, locale)}
                    </p>
                  </div>

                  {/* Tags row */}
                  <div className="flex flex-wrap items-center gap-1.5 px-4 pb-3">
                    <Badge variant="outline" className={cn("text-[10px]", statusColor(milestone.status))}>
                      {milestoneStatusLabel(milestone.status, locale)}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] text-muted-foreground">
                      {responsibleLabel(milestone.responsible, locale)}
                    </Badge>
                    {linkedMissions.length > 0 && (
                      <Badge variant="outline" className="text-[10px] text-muted-foreground">
                        <Target className="mr-0.5 h-2.5 w-2.5" />
                        {linkedMissions.length} {linkedMissions.length === 1 ? "mission" : "missions"}
                      </Badge>
                    )}
                  </div>

                  {/* Linked missions */}
                  {linkedMissions.length > 0 && (
                    <div className="border-t border-border px-4 py-3">
                      <div className="space-y-2">
                        {linkedMissions.map((m) => {
                          if (!m) return null;
                          const progress = getMissionProgress(m);
                          const isOverdue = new Date(m.deadline) < new Date() && m.status !== "completed";
                          return (
                            <div key={m.id} className="flex items-center gap-2">
                              {progress === 100 ? (
                                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" />
                              ) : (
                                <Circle className={cn("h-3.5 w-3.5 shrink-0", isOverdue ? "text-danger" : "text-muted-foreground/50")} />
                              )}
                              <span className={cn("flex-1 truncate text-xs", progress === 100 ? "text-muted-foreground line-through" : "text-foreground")}>
                                {missionTitle(m, locale)}
                              </span>
                              <Progress value={progress} className="h-1 w-16 [&_[data-slot=progress-indicator]]:bg-success" />
                              <span className="text-[10px] tabular-nums text-muted-foreground w-7 text-right">{progress}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
