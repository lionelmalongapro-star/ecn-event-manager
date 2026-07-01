"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/context";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";
import { event } from "@/lib/mock-data";
import { getMissionProgress } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Calendar, MapPin, UserPlus, Shield, Users, Eye, Copy, Check,
  Mail, AlertTriangle, Briefcase, TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/types";

function InviteMemberDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { inviteMember } = useAuth();
  const { dispatch } = useStore();
  const { locale } = useI18n();
  const isFr = locale === "fr";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("team");
  const [organization, setOrganization] = useState("ECN");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ email: string; password: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim()) return;
    const res = inviteMember({ name, email, role, organization });
    if (typeof res === "string") {
      setError(res);
      return;
    }
    dispatch({
      type: "ADD_ACTIVITY",
      entry: {
        id: `a${Date.now()}`,
        userId: "u1",
        action: "invited",
        target: `${res.user.name} (${res.user.email}) as ${res.user.role}`,
        timestamp: new Date().toISOString(),
      },
    });
    setResult({ email: res.user.email, password: res.password });
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(
      `Email: ${result.email}\n${isFr ? "Mot de passe" : "Password"}: ${result.password}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleClose = () => {
    setName(""); setEmail(""); setRole("team"); setOrganization("ECN");
    setError(""); setResult(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isFr ? "Inviter un membre" : "Invite Member"}</DialogTitle>
        </DialogHeader>

        {result ? (
          <div className="space-y-4">
            <div className="flex items-start gap-2 rounded-md bg-success/10 px-3 py-2.5">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              <p className="text-sm text-foreground">
                {isFr
                  ? "Compte créé. Aucun service d'envoi d'email n'est encore connecté à cette démo — transmettez ces identifiants manuellement à la personne."
                  : "Account created. No email service is connected to this demo yet — share these credentials with the person manually."}
              </p>
            </div>

            <div className="rounded-md border border-border bg-muted/40 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Email</span>
                <span className="text-sm font-mono text-foreground">{result.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{isFr ? "Mot de passe" : "Password"}</span>
                <span className="text-sm font-mono text-foreground">{result.password}</span>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleCopy}
              variant="outline"
              className="w-full"
            >
              {copied ? <Check className="mr-1.5 h-4 w-4 text-success" /> : <Copy className="mr-1.5 h-4 w-4" />}
              {copied ? (isFr ? "Copié" : "Copied") : (isFr ? "Copier les identifiants" : "Copy credentials")}
            </Button>

            <div className="flex justify-end">
              <Button type="button" onClick={handleClose} className="bg-primary text-primary-foreground hover:bg-cobalt-dark">
                {isFr ? "Terminé" : "Done"}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>{isFr ? "Nom complet" : "Full name"}</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>{isFr ? "Rôle" : "Role"}</Label>
                <Select value={role} onValueChange={(v) => { if (v) setRole(v as UserRole); }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">{isFr ? "Administrateur" : "Administrator"}</SelectItem>
                    <SelectItem value="team">{isFr ? "Équipe" : "Team"}</SelectItem>
                    <SelectItem value="partner_ecn">{isFr ? "Partenaire ECN" : "ECN Partner"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{isFr ? "Organisation" : "Organization"}</Label>
                <Input value={organization} onChange={(e) => setOrganization(e.target.value)} />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                {isFr ? "Annuler" : "Cancel"}
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-cobalt-dark">
                <Mail className="mr-1.5 h-4 w-4" />
                {isFr ? "Envoyer l'invitation" : "Send Invite"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function TeamPerformance() {
  const { accounts } = useAuth();
  const { state } = useStore();
  const { locale } = useI18n();
  const isFr = locale === "fr";

  const workMembers = accounts.filter((u) => u.role === "admin" || u.role === "team");

  const rows = workMembers.map((member) => {
    const missions = state.missions.filter((m) => m.assignees.includes(member.id));
    const completed = missions.filter((m) => m.status === "completed").length;
    const inProgress = missions.filter((m) => m.status === "in_progress").length;
    const overdue = missions.filter((m) => m.status !== "completed" && new Date(m.deadline) < new Date()).length;
    const avgProgress = missions.length > 0
      ? Math.round(missions.reduce((sum, m) => sum + getMissionProgress(m), 0) / missions.length)
      : 0;
    const pipelineCount = state.pipelineTargets.filter((p) => p.assignee === member.id).length;
    return { member, total: missions.length, completed, inProgress, overdue, avgProgress, pipelineCount };
  }).sort((a, b) => b.total - a.total);

  return (
    <section className="rounded-lg border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <Briefcase className="h-4 w-4 text-cobalt" />
        <h2 className="text-sm font-semibold text-foreground">
          {isFr ? "Charge de travail de l'équipe" : "Team Workload"}
        </h2>
        <Badge variant="outline" className="ml-auto text-[10px] border-cobalt/30 text-cobalt">
          {isFr ? "Admin uniquement" : "Admin only"}
        </Badge>
      </div>
      <div className="divide-y divide-border">
        {rows.map(({ member, total, completed, inProgress, overdue, avgProgress, pipelineCount }) => {
          const initials = member.name.split(" ").map((n) => n[0]).join("").toUpperCase();
          return (
            <div key={member.id} className="px-5 py-4">
              <div className="flex items-center justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-2.5">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={cn(
                      "text-xs font-semibold",
                      member.role === "admin" ? "bg-cobalt/10 text-cobalt" : "bg-ecn/10 text-ecn-dark"
                    )}>
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.organization}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm font-semibold tabular-nums text-foreground">{avgProgress}%</span>
                </div>
              </div>

              <Progress value={avgProgress} className="h-1.5 [&_[data-slot=progress-indicator]]:bg-success mb-2.5" />

              <div className="grid grid-cols-5 gap-2 text-center">
                <div>
                  <p className="text-sm font-semibold tabular-nums text-foreground">{total}</p>
                  <p className="text-[10px] text-muted-foreground">{isFr ? "Missions" : "Missions"}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold tabular-nums text-success">{completed}</p>
                  <p className="text-[10px] text-muted-foreground">{isFr ? "Faites" : "Done"}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold tabular-nums text-cobalt">{inProgress}</p>
                  <p className="text-[10px] text-muted-foreground">{isFr ? "En cours" : "Active"}</p>
                </div>
                <div>
                  <p className={cn("text-sm font-semibold tabular-nums", overdue > 0 ? "text-danger" : "text-foreground")}>{overdue}</p>
                  <p className="text-[10px] text-muted-foreground">{isFr ? "Retard" : "Overdue"}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold tabular-nums text-gold-dark">{pipelineCount}</p>
                  <p className="text-[10px] text-muted-foreground">Pipeline</p>
                </div>
              </div>
            </div>
          );
        })}
        {rows.length === 0 && (
          <div className="px-5 py-8 text-center text-sm text-muted-foreground">
            {isFr ? "Aucun membre opérationnel" : "No operational members"}
          </div>
        )}
      </div>
    </section>
  );
}

export default function SettingsPage() {
  const { t, locale } = useI18n();
  const { user, accounts, onlineUserIds } = useAuth();
  const [inviteOpen, setInviteOpen] = useState(false);
  const isFr = locale === "fr";
  const isAdmin = user?.role === "admin";

  const roleIcon = (role: string) => {
    switch (role) {
      case "admin": return <Shield className="h-3.5 w-3.5 text-cobalt" />;
      case "team": return <Users className="h-3.5 w-3.5 text-ecn-dark" />;
      case "partner_ecn": return <Eye className="h-3.5 w-3.5 text-muted-foreground" />;
      default: return null;
    }
  };

  const roleLabel = (role: string) => {
    switch (role) {
      case "admin": return t.settings.roles.admin;
      case "team": return t.settings.roles.team;
      case "partner_ecn": return t.settings.roles.partnerECN;
      default: return role;
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">{t.settings.title}</h1>
        <p className="text-sm text-muted-foreground">{t.settings.subtitle}</p>
      </div>

      {/* Event details */}
      <section className="rounded-lg border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-foreground">{t.settings.eventDetails}</h2>
        </div>
        <div className="space-y-4 p-5">
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {isFr ? "Nom de l'événement" : "Event Name"}
            </label>
            <p className="mt-1 text-sm font-medium text-foreground">{t.event.fullName}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {isFr ? "Dates" : "Dates"}
              </label>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-foreground">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                {t.event.dates}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {isFr ? "Lieu" : "Location"}
              </label>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-foreground">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                {t.event.location}
              </p>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t.common.status}
            </label>
            <div className="mt-1">
              <Badge variant="outline" className="border-cobalt/30 text-cobalt text-xs">
                {event.status}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Team members */}
      <section className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-foreground">{t.settings.teamMembers}</h2>
          {isAdmin && (
            <Button
              size="sm"
              onClick={() => setInviteOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-cobalt-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.98] transition-transform duration-100"
            >
              <UserPlus className="mr-1.5 h-3.5 w-3.5" />
              {t.settings.inviteMember}
            </Button>
          )}
        </div>
        <div className="divide-y divide-border">
          {accounts.map((member) => {
            const initials = member.name.split(" ").map((n) => n[0]).join("").toUpperCase();
            const isOnline = onlineUserIds.has(member.id);

            return (
              <div key={member.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback
                        className={cn(
                          "text-xs font-semibold",
                          member.role === "admin" && "bg-cobalt/10 text-cobalt",
                          member.role === "team" && "bg-ecn/10 text-ecn-dark",
                          member.role === "partner_ecn" && "bg-muted text-muted-foreground"
                        )}
                      >
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    {isAdmin && (
                      <span
                        className={cn(
                          "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card",
                          isOnline ? "bg-success" : "bg-muted-foreground/40"
                        )}
                        title={isOnline ? (isFr ? "En ligne" : "Online") : (isFr ? "Hors ligne" : "Offline")}
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {member.name}
                      {member.id === user?.id && (
                        <span className="ml-1.5 text-xs text-muted-foreground">
                          ({isFr ? "vous" : "you"})
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {isAdmin && (
                    <span className={cn("text-[10px] font-medium", isOnline ? "text-success" : "text-muted-foreground")}>
                      {isOnline ? (isFr ? "En ligne" : "Online") : (isFr ? "Hors ligne" : "Offline")}
                    </span>
                  )}
                  <Badge variant="outline" className="text-[10px] text-muted-foreground">
                    {member.organization}
                  </Badge>
                  <div className="flex items-center gap-1">
                    {roleIcon(member.role)}
                    <span className="text-xs font-medium text-muted-foreground">{roleLabel(member.role)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Team performance — admin only */}
      {isAdmin && <TeamPerformance />}

      {/* Role explanations */}
      <section className="rounded-lg border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-3">
          {isFr ? "Rôles et permissions" : "Roles & Permissions"}
        </h2>
        <div className="space-y-3">
          {[
            {
              icon: <Shield className="h-4 w-4 text-cobalt" />,
              label: t.settings.roles.admin,
              desc: isFr
                ? "Contrôle total : crée les événements, missions, comptes. Gère les rôles. Seul à pouvoir exporter la base de contacts et voir la charge de travail de l'équipe."
                : "Full control: creates events, missions, accounts. Manages roles. Only one who can export the contact database and see team workload.",
            },
            {
              icon: <Users className="h-4 w-4 text-ecn-dark" />,
              label: t.settings.roles.team,
              desc: isFr
                ? "Accès opérationnel complet : missions, sous-tâches, pipeline. Jalons en lecture. Pas d'export ni de gestion de comptes."
                : "Full operational access: missions, subtasks, pipeline. Milestones read-only. No export or account management.",
            },
            {
              icon: <Eye className="h-4 w-4 text-muted-foreground" />,
              label: t.settings.roles.partnerECN,
              desc: isFr
                ? "Vue vitrine en lecture seule : tableau de bord, jalons, résumé du pipeline."
                : "Read-only showcase view: dashboard, milestones, pipeline summary.",
            },
          ].map((role) => (
            <div key={role.label} className="flex gap-3">
              <div className="mt-0.5">{role.icon}</div>
              <div>
                <p className="text-sm font-medium text-foreground">{role.label}</p>
                <p className="text-xs text-muted-foreground">{role.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {isAdmin && <InviteMemberDialog open={inviteOpen} onClose={() => setInviteOpen(false)} />}
    </div>
  );
}
