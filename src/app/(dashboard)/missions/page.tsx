"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/context";
import { useStore } from "@/lib/store";
import { getMissionProgress, getAssigneeFirstName, getAssignableUsers, milestones, missionTitle, milestoneTitle, subtaskTitle } from "@/lib/mock-data";
import type { Mission, MissionStatus, MissionCategory, Priority } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus, Calendar, LayoutGrid, List, CheckCircle2, Circle,
  AlertTriangle, ChevronDown, ChevronRight, Flag, MoreVertical,
  Pencil, Trash2, UserPlus, ArrowRightLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";
import { UserPopover } from "@/components/user-popover";
import { AssigneeCombobox } from "@/components/assignee-combobox";

type BoardColumn = {
  status: MissionStatus;
  labelKey: "notStarted" | "inProgress" | "completed";
  dotColor: string;
};

const columns: BoardColumn[] = [
  { status: "not_started", labelKey: "notStarted", dotColor: "bg-muted-foreground" },
  { status: "in_progress", labelKey: "inProgress", dotColor: "bg-cobalt" },
  { status: "completed", labelKey: "completed", dotColor: "bg-success" },
];

const categoryOptions: { value: MissionCategory; labelFr: string; labelEn: string }[] = [
  { value: "venue", labelFr: "Lieu", labelEn: "Venue" },
  { value: "communication", labelFr: "Communication", labelEn: "Communication" },
  { value: "logistics", labelFr: "Logistique", labelEn: "Logistics" },
  { value: "partnerships", labelFr: "Partenariats", labelEn: "Partnerships" },
  { value: "content", labelFr: "Contenu", labelEn: "Content" },
  { value: "finance", labelFr: "Finance", labelEn: "Finance" },
  { value: "speakers", labelFr: "Intervenants", labelEn: "Speakers" },
  { value: "sponsors", labelFr: "Sponsors", labelEn: "Sponsors" },
];

function EditMissionDialog({ mission, open, onClose }: { mission: Mission; open: boolean; onClose: () => void }) {
  const { dispatch } = useStore();
  const { locale } = useI18n();
  const isFr = locale === "fr";
  const [title, setTitle] = useState(mission.title);
  const [desc, setDesc] = useState(mission.description);
  const [category, setCategory] = useState<MissionCategory>(mission.category);
  const [priority, setPriority] = useState<Priority>(mission.priority);
  const [status, setStatus] = useState<MissionStatus>(mission.status);
  const [deadline, setDeadline] = useState(mission.deadline);
  const [assignee, setAssignee] = useState(mission.assignees[0] || "u1");
  const [milestoneId, setMilestoneId] = useState(mission.milestoneId || "none");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: "UPDATE_MISSION",
      id: mission.id,
      updates: {
        title: title.trim(),
        description: desc.trim(),
        category,
        priority,
        status,
        deadline,
        assignees: [assignee],
        milestoneId: milestoneId !== "none" ? milestoneId : undefined,
      },
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isFr ? "Modifier la mission" : "Edit Mission"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>{isFr ? "Titre" : "Title"}</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>{isFr ? "Statut" : "Status"}</Label>
              <Select value={status} onValueChange={(v) => { if (v) setStatus(v as MissionStatus); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_started">{isFr ? "Non commencé" : "Not Started"}</SelectItem>
                  <SelectItem value="in_progress">{isFr ? "En cours" : "In Progress"}</SelectItem>
                  <SelectItem value="completed">{isFr ? "Terminé" : "Completed"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{isFr ? "Priorité" : "Priority"}</Label>
              <Select value={priority} onValueChange={(v) => { if (v) setPriority(v as Priority); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">{isFr ? "Haute" : "High"}</SelectItem>
                  <SelectItem value="medium">{isFr ? "Moyenne" : "Medium"}</SelectItem>
                  <SelectItem value="low">{isFr ? "Basse" : "Low"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>{isFr ? "Catégorie" : "Category"}</Label>
              <Select value={category} onValueChange={(v) => { if (v) setCategory(v as MissionCategory); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{isFr ? c.labelFr : c.labelEn}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{isFr ? "Échéance" : "Deadline"}</Label>
              <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <AssigneeCombobox
              value={assignee}
              onChange={setAssignee}
              label={isFr ? "Responsable" : "Assignee"}
            />
            <div>
              <Label>{isFr ? "Jalon lié" : "Linked Milestone"}</Label>
              <Select value={milestoneId} onValueChange={(v) => { if (v) setMilestoneId(v); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{isFr ? "Aucun" : "None"}</SelectItem>
                  {milestones.map((ml) => (
                    <SelectItem key={ml.id} value={ml.id}>
                      {(() => { const t = milestoneTitle(ml, locale); return t.length > 35 ? t.slice(0, 35) + "…" : t; })()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {isFr ? "Annuler" : "Cancel"}
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-cobalt-dark">
              {isFr ? "Enregistrer" : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function MissionCard({ mission, locale }: { mission: Mission; locale: string }) {
  const { t } = useI18n();
  const { dispatch } = useStore();
  const progress = getMissionProgress(mission);
  const isOverdue = new Date(mission.deadline) < new Date() && mission.status !== "completed";
  const [expanded, setExpanded] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const isFr = locale === "fr";

  const handleQuickStatus = (status: MissionStatus) => {
    dispatch({ type: "UPDATE_MISSION", id: mission.id, updates: { status } });
  };

  const handleQuickAssign = (userId: string) => {
    dispatch({ type: "UPDATE_MISSION", id: mission.id, updates: { assignees: [userId] } });
  };

  return (
    <>
      <div className="rounded-md border border-border bg-card p-3 transition-shadow duration-150 ease-out hover:shadow-[0_2px_8px_oklch(0.52_0.14_258/0.08)]">
        <div className="flex items-start justify-between gap-1">
          <p className="text-sm font-medium text-foreground leading-snug flex-1">{missionTitle(mission, locale)}</p>
          <div className="flex items-center gap-1 shrink-0">
            <Badge
              variant="outline"
              className={cn(
                "text-[10px]",
                mission.priority === "high" && "border-danger/30 text-danger",
                mission.priority === "medium" && "border-gold/30 text-gold-dark",
                mission.priority === "low" && "border-border text-muted-foreground"
              )}
            >
              {t.common[mission.priority]}
            </Badge>

            {/* Three-dot menu */}
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded p-0.5 text-muted-foreground/50 transition-colors duration-100 hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary">
                <MoreVertical className="h-3.5 w-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                  <Pencil className="mr-2 h-3.5 w-3.5" />
                  {isFr ? "Modifier" : "Edit"}
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Quick status change */}
                <div className="px-2 py-1">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground mb-1">
                    {isFr ? "Changer le statut" : "Change status"}
                  </p>
                  {(["not_started", "in_progress", "completed"] as MissionStatus[]).map((s) => (
                    <DropdownMenuItem
                      key={s}
                      onClick={() => handleQuickStatus(s)}
                      className={cn(mission.status === s && "font-semibold text-primary")}
                    >
                      <ArrowRightLeft className="mr-2 h-3 w-3" />
                      {s === "not_started" ? (isFr ? "Non commencé" : "Not Started") :
                       s === "in_progress" ? (isFr ? "En cours" : "In Progress") :
                       (isFr ? "Terminé" : "Completed")}
                    </DropdownMenuItem>
                  ))}
                </div>

                <DropdownMenuSeparator />

                {/* Quick reassign */}
                <div className="px-2 py-1">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground mb-1">
                    {isFr ? "Réassigner" : "Reassign"}
                  </p>
                  {getAssignableUsers().map((u) => (
                    <DropdownMenuItem
                      key={u.id}
                      onClick={() => handleQuickAssign(u.id)}
                      className={cn(mission.assignees.includes(u.id) && "font-semibold text-primary")}
                    >
                      <UserPlus className="mr-2 h-3 w-3" />
                      {u.name}
                    </DropdownMenuItem>
                  ))}
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => dispatch({ type: "DELETE_MISSION", id: mission.id })}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  {isFr ? "Supprimer" : "Delete"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span className={cn(isOverdue && "text-danger font-medium")}>{formatDate(mission.deadline, locale)}</span>
          {isOverdue && <AlertTriangle className="h-3 w-3 text-danger" />}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {mission.assignees.map((a) => (
            <UserPopover key={a} userId={a}>
              {getAssigneeFirstName(a)}
            </UserPopover>
          ))}
          {mission.milestoneId && (() => {
            const ml = milestones.find((m) => m.id === mission.milestoneId);
            return ml ? (
              <span className="inline-flex h-5 items-center gap-0.5 rounded-full bg-cobalt/8 px-1.5 text-[10px] font-medium text-cobalt">
                <Flag className="h-2.5 w-2.5" />
                {(() => { const t = milestoneTitle(ml, locale); return t.length > 20 ? t.slice(0, 20) + "…" : t; })()}
              </span>
            ) : null;
          })()}
        </div>

        {mission.subtasks.length > 0 && (
          <div className="mt-2.5">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex w-full items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors duration-150"
            >
              {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              <span>{mission.subtasks.filter((s) => s.done).length}/{mission.subtasks.length} {t.missions.subtasks.toLowerCase()}</span>
            </button>
            {expanded && (
              <div className="mt-1.5 space-y-1">
                {mission.subtasks.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => dispatch({ type: "TOGGLE_SUBTASK", missionId: mission.id, subtaskId: st.id })}
                    className="flex w-full items-center gap-1.5 text-xs text-left hover:bg-muted/50 rounded px-1 py-0.5 transition-colors duration-100"
                  >
                    {st.done ? (
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" />
                    ) : (
                      <Circle className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    )}
                    <span className={cn("truncate", st.done && "line-through text-muted-foreground")}>{subtaskTitle(st, locale)}</span>
                  </button>
                ))}
              </div>
            )}
            <Progress value={progress} className="mt-2 h-1 [&_[data-slot=progress-indicator]]:bg-success" />
          </div>
        )}
      </div>

      {editOpen && <EditMissionDialog mission={mission} open={editOpen} onClose={() => setEditOpen(false)} />}
    </>
  );
}

function AddMissionDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { dispatch } = useStore();
  const { locale } = useI18n();
  const isFr = locale === "fr";
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState<MissionCategory>("venue");
  const [priority, setPriority] = useState<Priority>("medium");
  const [deadline, setDeadline] = useState("");
  const [assignee, setAssignee] = useState("u1");
  const [milestoneId, setMilestoneId] = useState("none");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const mission: Mission = {
      id: `m${Date.now()}`,
      title: title.trim(),
      description: desc.trim(),
      assignees: [assignee],
      deadline: deadline || "2026-10-20",
      priority,
      status: "not_started",
      category,
      phase: "Pre-launch",
      subtasks: [],
      milestoneId: milestoneId !== "none" ? milestoneId : undefined,
      eventId: "evt1",
    };
    dispatch({ type: "ADD_MISSION", mission });
    setTitle(""); setDesc(""); setDeadline(""); setMilestoneId("none");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isFr ? "Nouvelle mission" : "New Mission"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>{isFr ? "Titre" : "Title"}</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>{isFr ? "Catégorie" : "Category"}</Label>
              <Select value={category} onValueChange={(v) => { if (v) setCategory(v as MissionCategory); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{isFr ? c.labelFr : c.labelEn}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{isFr ? "Priorité" : "Priority"}</Label>
              <Select value={priority} onValueChange={(v) => { if (v) setPriority(v as Priority); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">{isFr ? "Haute" : "High"}</SelectItem>
                  <SelectItem value="medium">{isFr ? "Moyenne" : "Medium"}</SelectItem>
                  <SelectItem value="low">{isFr ? "Basse" : "Low"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>{isFr ? "Échéance" : "Deadline"}</Label>
              <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </div>
            <AssigneeCombobox
              value={assignee}
              onChange={setAssignee}
              label={isFr ? "Responsable" : "Assignee"}
            />
          </div>
          <div>
            <Label>{isFr ? "Jalon lié" : "Linked Milestone"}</Label>
            <Select value={milestoneId} onValueChange={(v) => { if (v) setMilestoneId(v); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{isFr ? "Aucun" : "None"}</SelectItem>
                {milestones.map((ml) => (
                  <SelectItem key={ml.id} value={ml.id}>
                    {(() => { const t = milestoneTitle(ml, locale); return t.length > 40 ? t.slice(0, 40) + "…" : t; })()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {isFr ? "Annuler" : "Cancel"}
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-cobalt-dark">
              {isFr ? "Créer" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function MissionsPage() {
  const { t, locale } = useI18n();
  const { state } = useStore();
  const [view, setView] = useState<"board" | "list">("board");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [addOpen, setAddOpen] = useState(false);
  const isFr = locale === "fr";

  const allMissions = state.missions;
  const filteredMissions = categoryFilter === "all"
    ? allMissions
    : allMissions.filter((m) => m.category === categoryFilter);
  const categories = ["all", ...new Set(allMissions.map((m) => m.category))];

  return (
    <div className="space-y-4 p-3 sm:p-5 lg:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">{t.missions.title}</h1>
          <p className="text-sm text-muted-foreground">{t.missions.subtitle}</p>
        </div>
        <Button
          onClick={() => setAddOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-cobalt-dark active:scale-[0.98] transition-transform duration-100"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          {t.missions.newMission}
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors duration-150",
                "hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                categoryFilter === cat ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              )}
            >
              {cat === "all" ? t.common.all : t.missions.categories[cat as keyof typeof t.missions.categories] || cat}
            </button>
          ))}
        </div>
        <Tabs value={view} onValueChange={(v) => setView(v as "board" | "list")}>
          <TabsList className="h-8">
            <TabsTrigger value="board" className="gap-1 text-xs">
              <LayoutGrid className="h-3.5 w-3.5" />
              {t.missions.board}
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-1 text-xs">
              <List className="h-3.5 w-3.5" />
              {t.missions.list}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {view === "board" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {columns.map((col) => {
            const colMissions = filteredMissions.filter((m) => m.status === col.status);
            return (
              <div key={col.status} className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <span className={cn("h-2 w-2 rounded-full", col.dotColor)} />
                  <h3 className="text-sm font-semibold text-foreground">{t.common[col.labelKey]}</h3>
                  <span className="ml-auto text-xs tabular-nums text-muted-foreground">{colMissions.length}</span>
                </div>
                <div className="space-y-2">
                  {colMissions.map((m) => (
                    <MissionCard key={m.id} mission={m} locale={locale} />
                  ))}
                  {colMissions.length === 0 && (
                    <div className="rounded-md border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                      {isFr ? "Aucune mission" : "No missions"}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-x-auto">
          <div className="grid grid-cols-[1fr_100px_100px_120px_80px] gap-2 border-b border-border px-4 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground min-w-[560px]">
            <span>Mission</span>
            <span>{t.common.status}</span>
            <span>{t.common.priority}</span>
            <span>{t.common.deadline}</span>
            <span>{t.missions.progress}</span>
          </div>
          <div className="divide-y divide-border">
            {filteredMissions.map((m) => {
              const progress = getMissionProgress(m);
              const isOverdue = new Date(m.deadline) < new Date() && m.status !== "completed";
              return (
                <div key={m.id} className="grid grid-cols-[1fr_100px_100px_120px_80px] items-center gap-2 px-4 py-3 text-sm min-w-[560px]">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{missionTitle(m, locale)}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {m.assignees.map(getAssigneeFirstName).join(", ")}
                    </p>
                  </div>
                  <Badge variant="outline" className={cn("w-fit text-[10px]", m.status === "completed" && "border-success/30 text-success", m.status === "in_progress" && "border-cobalt/30 text-cobalt")}>
                    {t.common[m.status === "not_started" ? "notStarted" : m.status === "in_progress" ? "inProgress" : "completed"]}
                  </Badge>
                  <Badge variant="outline" className={cn("w-fit text-[10px]", m.priority === "high" && "border-danger/30 text-danger", m.priority === "medium" && "border-gold/30 text-gold-dark")}>
                    {t.common[m.priority]}
                  </Badge>
                  <span className={cn("text-xs tabular-nums", isOverdue ? "text-danger font-medium" : "text-muted-foreground")}>
                    {formatDate(m.deadline, locale)}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs tabular-nums text-muted-foreground">{progress}%</span>
                    <Progress value={progress} className="h-1 flex-1 [&_[data-slot=progress-indicator]]:bg-success" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <AddMissionDialog open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
