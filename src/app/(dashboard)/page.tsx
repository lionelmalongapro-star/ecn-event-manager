"use client";

import { useI18n } from "@/i18n/context";
import { useStore } from "@/lib/store";
import { milestones, event, getMissionProgress, getUserById, getAssigneeFirstName, missionTitle, milestoneTitle, milestoneSuccessCondition } from "@/lib/mock-data";
import { formatDate, formatDateTime, formatCurrency } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle, ArrowRight, CheckCircle2, Clock, TrendingUp,
  Handshake, Award, DollarSign, Calendar,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { t, locale } = useI18n();
  const { state } = useStore();

  const allMissions = state.missions;
  const overdueMissions = allMissions.filter(
    (m) => m.status !== "completed" && new Date(m.deadline) < new Date()
  );
  const inProgressMissions = allMissions.filter((m) => m.status === "in_progress");
  const completedMissions = allMissions.filter((m) => m.status === "completed");

  const endorsements = state.pipelineTargets.filter((p) => p.type === "endorsement");
  const sponsors = state.pipelineTargets.filter((p) => p.type === "sponsor");
  const endorsementsObtained = endorsements.filter((e) => e.stage === "obtained").length;
  const sponsorsConfirmed = sponsors.filter((s) => s.stage === "confirmed" || s.stage === "paid").length;

  const totalRaised = sponsors
    .filter((s) => s.paymentStatus)
    .reduce((sum, s) => sum + (s.amount || 0), 0);

  const globalProgress = allMissions.length > 0
    ? Math.round(allMissions.reduce((sum, m) => sum + getMissionProgress(m), 0) / allMissions.length)
    : 0;

  const nextMilestone = milestones
    .filter((ml) => ml.status !== "reached")
    .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime())[0];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">{t.dashboard.title}</h1>
        <p className="text-sm text-muted-foreground">{event.name} — {event.dates}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t.dashboard.globalProgress}</p>
            <TrendingUp className="h-4 w-4 text-cobalt-light" />
          </div>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">{globalProgress}%</p>
          <Progress value={globalProgress} className="mt-3 h-1.5 [&_[data-slot=progress-indicator]]:bg-success" />
        </div>

        <div className={cn("rounded-lg border p-4", overdueMissions.length > 0 ? "border-danger/30 bg-danger/5" : "border-border bg-card")}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t.dashboard.missionsOverdue}</p>
            <AlertTriangle className={cn("h-4 w-4", overdueMissions.length > 0 ? "text-danger" : "text-muted-foreground")} />
          </div>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">{overdueMissions.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">/ {allMissions.length} {t.nav.missions.toLowerCase()}</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t.dashboard.missionsInProgress}</p>
            <Clock className="h-4 w-4 text-gold" />
          </div>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">{inProgressMissions.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">{completedMissions.length} {t.common.completed.toLowerCase()}</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t.dashboard.endorsements}</p>
            <Award className="h-4 w-4 text-cobalt" />
          </div>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">{endorsementsObtained}<span className="text-base text-muted-foreground">/{endorsements.length}</span></p>
          <Progress value={endorsements.length > 0 ? (endorsementsObtained / endorsements.length) * 100 : 0} className="mt-3 h-1.5 [&_[data-slot=progress-indicator]]:bg-success" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {overdueMissions.length > 0 && (
            <div className="rounded-lg border border-danger/20 bg-card">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-danger">
                  <AlertTriangle className="h-4 w-4" />
                  {t.dashboard.overdueItems}
                </h2>
                <Link href="/missions" className="text-xs font-medium text-primary hover:underline">
                  {locale === "fr" ? "Voir tout" : "View all"} <ArrowRight className="inline h-3 w-3" />
                </Link>
              </div>
              <div className="divide-y divide-border">
                {overdueMissions.map((m) => (
                  <div key={m.id} className="flex items-center justify-between px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{missionTitle(m, locale)}</p>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span className="text-xs text-danger font-medium">{formatDate(m.deadline, locale)}</span>
                        <span className="text-xs text-muted-foreground">{m.assignees.map(getAssigneeFirstName).join(", ")}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs tabular-nums text-muted-foreground">{getMissionProgress(m)}%</span>
                      <Progress value={getMissionProgress(m)} className="h-1.5 w-16 [&_[data-slot=progress-indicator]]:bg-danger" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="text-sm font-semibold text-foreground">{locale === "fr" ? "Missions en cours" : "Active Missions"}</h2>
              <Link href="/missions" className="text-xs font-medium text-primary hover:underline">
                {locale === "fr" ? "Voir tout" : "View all"} <ArrowRight className="inline h-3 w-3" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {(inProgressMissions.length > 0 ? inProgressMissions : allMissions.filter(m => m.status !== "completed")).slice(0, 5).map((m) => {
                const progress = getMissionProgress(m);
                const isOverdue = new Date(m.deadline) < new Date();
                return (
                  <div key={m.id} className="flex items-center justify-between px-4 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{missionTitle(m, locale)}</p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className={cn("text-[10px] font-medium", m.priority === "high" && "border-danger/30 text-danger", m.priority === "medium" && "border-gold/30 text-gold-dark")}>
                          {t.common[m.priority]}
                        </Badge>
                        <span className={cn("text-xs", isOverdue ? "text-danger font-medium" : "text-muted-foreground")}>
                          <Calendar className="mr-0.5 inline h-3 w-3" />{formatDate(m.deadline, locale)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex items-center gap-2">
                      <span className="text-xs tabular-nums text-muted-foreground">{progress}%</span>
                      <Progress value={progress} className="h-1.5 w-20 [&_[data-slot=progress-indicator]]:bg-success" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {nextMilestone && (
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">{locale === "fr" ? "Prochain jalon" : "Next Milestone"}</h3>
                <Badge variant="outline" className={cn("text-[10px]", nextMilestone.status === "at_risk" && "border-danger/30 text-danger")}>
                  {nextMilestone.status === "reached" ? "Done" : nextMilestone.status === "in_progress" ? "In Progress" : "Pending"}
                </Badge>
              </div>
              <p className="mt-2 text-sm font-medium text-foreground">{milestoneTitle(nextMilestone, locale)}</p>
              <p className="mt-1 text-xs text-muted-foreground">{milestoneSuccessCondition(nextMilestone, locale)}</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate(nextMilestone.targetDate, locale)}</span>
              </div>
              <Link href="/milestones" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                {locale === "fr" ? "Tous les jalons" : "All milestones"} <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}

          <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border px-4 py-3">
              <h3 className="text-sm font-semibold text-foreground">{t.dashboard.upcomingDeadlines}</h3>
            </div>
            <div className="divide-y divide-border">
              {allMissions
                .filter((m) => m.status !== "completed")
                .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                .slice(0, 5)
                .map((m) => {
                  const isOverdue = new Date(m.deadline) < new Date();
                  return (
                    <div key={m.id} className="flex items-center justify-between px-4 py-2.5">
                      <p className="truncate text-sm text-foreground">{missionTitle(m, locale)}</p>
                      <span className={cn("shrink-0 text-xs tabular-nums", isOverdue ? "text-danger font-medium" : "text-muted-foreground")}>
                        {formatDate(m.deadline, locale)}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border px-4 py-3">
              <h3 className="text-sm font-semibold text-foreground">{t.dashboard.recentActivity}</h3>
            </div>
            <div className="divide-y divide-border">
              {state.activityLog.slice(0, 5).map((entry) => {
                const user = getUserById(entry.userId);
                return (
                  <div key={entry.id} className="px-4 py-2.5">
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{user?.name.split(" ")[0]}</span>{" "}
                      <span className="text-muted-foreground">{entry.target}</span>
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{formatDateTime(entry.timestamp, locale)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
