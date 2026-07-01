"use client";

import { useState, useRef } from "react";
import { useI18n } from "@/i18n/context";
import { useStore } from "@/lib/store";
import { getUserById, getAssigneeFirstName, getAssignableUsers, sponsorTiers } from "@/lib/mock-data";
import type { PipelineTarget, EndorsementStage, SponsorStage, SpeakerStage, TargetCategory } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Award, Handshake, User, MessageSquare, DollarSign, Plus, Upload, GripVertical,
  AlertTriangle, MoreVertical, Pencil, Trash2, UserPlus, ArrowRightLeft, Thermometer,
  Mic2, FileText, FileCheck2, Check, Link as LinkIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format";
import { AssigneeCombobox } from "@/components/assignee-combobox";

const endorsementStages: EndorsementStage[] = ["identified", "approach_started", "meeting_held", "verbal_agreement", "obtained", "refused"];
const sponsorStages: SponsorStage[] = ["identified", "contacted", "in_discussion", "proposal_sent", "confirmed", "paid", "lost"];
const speakerStages: SpeakerStage[] = ["invited", "form_sent", "form_completed", "confirmed", "declined"];

// 15 is the launch-threshold milestone ("15 speakers confirmed, forms
// returned"); later checkpoints raise this to 30, then 40.
const SPEAKER_TARGET = 15;

function stagesForType(type: PipelineTarget["type"]): string[] {
  if (type === "endorsement") return endorsementStages;
  if (type === "sponsor") return sponsorStages;
  return speakerStages;
}

// "confirmed" is a mid-funnel stage for sponsors but the terminal stage for
// speakers, so terminal/negative status can't be determined from the stage
// string alone — it depends on the target's type too.
const POSITIVE_TERMINAL: Record<PipelineTarget["type"], string> = {
  endorsement: "obtained",
  sponsor: "paid",
  speaker: "confirmed",
};
const NEGATIVE_TERMINAL: Record<PipelineTarget["type"], string> = {
  endorsement: "refused",
  sponsor: "lost",
  speaker: "declined",
};

function isPositiveTerminal(type: PipelineTarget["type"], stage: string): boolean {
  return stage === POSITIVE_TERMINAL[type];
}
function isNegativeTerminal(type: PipelineTarget["type"], stage: string): boolean {
  return stage === NEGATIVE_TERMINAL[type];
}

function stageLabel(stage: string, t: ReturnType<typeof useI18n>["t"]): string {
  const map: Record<string, keyof typeof t.pipeline.stages> = {
    identified: "identified", approach_started: "approachStarted", meeting_held: "meetingHeld",
    verbal_agreement: "verbalAgreement", obtained: "obtained", refused: "refused",
    contacted: "contacted", in_discussion: "inDiscussion", proposal_sent: "proposalSent",
    confirmed: "confirmed", paid: "paid", lost: "lost",
    invited: "invited", form_sent: "formSent", form_completed: "formCompleted", declined: "declined",
  };
  return t.pipeline.stages[map[stage] || "identified"];
}

function EditTargetDialog({ target, open, onClose }: { target: PipelineTarget; open: boolean; onClose: () => void }) {
  const { dispatch } = useStore();
  const { locale, t } = useI18n();
  const isFr = locale === "fr";
  const [org, setOrg] = useState(target.organization);
  const [contact, setContact] = useState(target.contactName);
  const [contactRole, setContactRole] = useState(target.contactRole || "");
  const [category, setCategory] = useState<TargetCategory>(target.category);
  const [notes, setNotes] = useState(target.notes);
  const [amount, setAmount] = useState(target.amount?.toString() || "");
  const [assignee, setAssignee] = useState(target.assignee);
  const [temperature, setTemperature] = useState(target.temperature || "cold");
  const [stage, setStage] = useState<string>(target.stage);

  const stages = stagesForType(target.type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: "UPDATE_PIPELINE_TARGET",
      id: target.id,
      updates: {
        organization: org.trim(),
        contactName: contact.trim(),
        contactRole: contactRole.trim() || undefined,
        category,
        notes: notes.trim(),
        amount: amount ? parseFloat(amount) : undefined,
        assignee,
        temperature: target.type === "sponsor" ? temperature : undefined,
        stage: stage as EndorsementStage | SponsorStage | SpeakerStage,
      },
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {target.type === "endorsement"
              ? (isFr ? "Modifier l'endorsement" : "Edit Endorsement")
              : target.type === "sponsor"
              ? (isFr ? "Modifier le sponsor" : "Edit Sponsor")
              : (isFr ? "Modifier l'intervenant·e" : "Edit Speaker")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>{target.type === "speaker" ? (isFr ? "Nom de l'intervenant·e" : "Speaker Name") : (isFr ? "Organisation" : "Organization")}</Label>
            <Input value={org} onChange={(e) => setOrg(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>{target.type === "speaker" ? (isFr ? "Titre & organisation" : "Title & Organization") : (isFr ? "Contact clé" : "Key Contact")}</Label>
              <Input value={contact} onChange={(e) => setContact(e.target.value)} />
            </div>
            {target.type !== "speaker" && (
              <div>
                <Label>{isFr ? "Rôle" : "Role"}</Label>
                <Input value={contactRole} onChange={(e) => setContactRole(e.target.value)} />
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {target.type !== "speaker" && (
              <div>
                <Label>{isFr ? "Catégorie" : "Category"}</Label>
                <Select value={category} onValueChange={(v) => { if (v) setCategory(v as TargetCategory); }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="government">{isFr ? "Gouvernement" : "Government"}</SelectItem>
                    <SelectItem value="corporate">Corporate</SelectItem>
                    <SelectItem value="media">{isFr ? "Média" : "Media"}</SelectItem>
                    <SelectItem value="ecosystem">{isFr ? "Écosystème" : "Ecosystem"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label>{isFr ? "Étape" : "Stage"}</Label>
              <Select value={stage} onValueChange={(v) => { if (v) setStage(v); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {stages.map((s) => (
                    <SelectItem key={s} value={s}>{stageLabel(s, t)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <AssigneeCombobox
              value={assignee}
              onChange={setAssignee}
              label={isFr ? "Responsable" : "Assignee"}
            />
            {target.type === "sponsor" && (
              <div>
                <Label>{isFr ? "Température" : "Temperature"}</Label>
                <Select value={temperature} onValueChange={(v) => { if (v) setTemperature(v as "hot" | "warm" | "cold"); }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hot">{isFr ? "Chaud" : "Hot"}</SelectItem>
                    <SelectItem value="warm">{isFr ? "Tiède" : "Warm"}</SelectItem>
                    <SelectItem value="cold">{isFr ? "Froid" : "Cold"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          {target.type === "sponsor" && (
            <div>
              <Label>{isFr ? "Montant (€)" : "Amount (€)"}</Label>
              <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
          )}
          <div>
            <Label>Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
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

function PipelineCard({
  target,
  onDragStart,
}: {
  target: PipelineTarget;
  onDragStart: (e: React.DragEvent, id: string) => void;
}) {
  const { t, locale } = useI18n();
  const { dispatch } = useStore();
  const isPositive = isPositiveTerminal(target.type, target.stage);
  const isNegative = isNegativeTerminal(target.type, target.stage);
  const isFr = locale === "fr";
  const [editOpen, setEditOpen] = useState(false);
  const stages = stagesForType(target.type);

  const handleQuickStage = (stage: string) => {
    dispatch({ type: "MOVE_PIPELINE_TARGET", id: target.id, stage: stage as EndorsementStage | SponsorStage | SpeakerStage });
  };

  const handleQuickAssign = (userId: string) => {
    dispatch({ type: "UPDATE_PIPELINE_TARGET", id: target.id, updates: { assignee: userId } });
  };

  const handleQuickTemp = (temp: "hot" | "warm" | "cold") => {
    dispatch({ type: "UPDATE_PIPELINE_TARGET", id: target.id, updates: { temperature: temp } });
  };

  return (
    <>
      <div
        draggable
        onDragStart={(e) => onDragStart(e, target.id)}
        className={cn(
          "group cursor-grab rounded-md border bg-card p-3 transition-all duration-150 ease-out",
          "hover:shadow-[0_4px_12px_oklch(0.52_0.14_258/0.12)] hover:border-primary/30 hover:-translate-y-0.5",
          "active:cursor-grabbing active:shadow-[0_8px_20px_oklch(0.52_0.14_258/0.18)] active:scale-[1.02]",
          isPositive ? "border-success/30" : isNegative ? "border-danger/20" : "border-border"
        )}
      >
        <div className="flex items-start justify-between gap-1">
          <div className="flex items-start gap-1.5 flex-1 min-w-0">
            <GripVertical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/40 opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
            {target.type === "speaker" && target.photoDataUrl && (
              <img src={target.photoDataUrl} alt="" className="h-6 w-6 shrink-0 rounded-full object-cover" />
            )}
            <p className="text-sm font-medium text-foreground leading-snug">{target.organization}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {target.temperature && (
              <span
                className={cn(
                  "h-2.5 w-2.5 shrink-0 rounded-full",
                  target.temperature === "hot" && "bg-hot",
                  target.temperature === "warm" && "bg-warm",
                  target.temperature === "cold" && "bg-cold"
                )}
                title={t.pipeline.temperature[target.temperature]}
              />
            )}
            {target.nameVerified && target.nameVerified !== "verified" && (
              <span title={target.nameVerified === "verify" ? "Name needs verification" : "Contact TBD"}>
                <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-warning" />
              </span>
            )}

            {/* Three-dot menu */}
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded p-0.5 text-muted-foreground/50 transition-colors duration-100 hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary">
                <MoreVertical className="h-3.5 w-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                  <Pencil className="mr-2 h-3.5 w-3.5" />
                  {isFr ? "Modifier" : "Edit"}
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <div className="px-2 py-1">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground mb-1">
                    {isFr ? "Changer l'étape" : "Change stage"}
                  </p>
                  {stages.map((s) => (
                    <DropdownMenuItem
                      key={s}
                      onClick={() => handleQuickStage(s)}
                      className={cn(target.stage === s && "font-semibold text-primary")}
                    >
                      <ArrowRightLeft className="mr-2 h-3 w-3" />
                      {stageLabel(s, t)}
                    </DropdownMenuItem>
                  ))}
                </div>

                <DropdownMenuSeparator />

                <div className="px-2 py-1">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground mb-1">
                    {isFr ? "Réassigner" : "Reassign"}
                  </p>
                  {getAssignableUsers().map((u) => (
                    <DropdownMenuItem
                      key={u.id}
                      onClick={() => handleQuickAssign(u.id)}
                      className={cn(target.assignee === u.id && "font-semibold text-primary")}
                    >
                      <UserPlus className="mr-2 h-3 w-3" />
                      {u.name}
                    </DropdownMenuItem>
                  ))}
                </div>

                {target.type === "sponsor" && (
                  <>
                    <DropdownMenuSeparator />
                    <div className="px-2 py-1">
                      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground mb-1">
                        {isFr ? "Température" : "Temperature"}
                      </p>
                      {(["hot", "warm", "cold"] as const).map((temp) => (
                        <DropdownMenuItem
                          key={temp}
                          onClick={() => handleQuickTemp(temp)}
                          className={cn(target.temperature === temp && "font-semibold text-primary")}
                        >
                          <Thermometer className="mr-2 h-3 w-3" />
                          {t.pipeline.temperature[temp]}
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => dispatch({ type: "DELETE_PIPELINE_TARGET", id: target.id })}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  {isFr ? "Supprimer" : "Delete"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <p className="mt-1 text-xs text-muted-foreground">{target.contactName}</p>
        {target.type === "speaker" && target.email && (
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground/80">{target.email}</p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {target.type !== "speaker" && (
            <Badge variant="outline" className="text-[10px] text-muted-foreground">
              {t.pipeline.categories[target.category as keyof typeof t.pipeline.categories] || target.category}
            </Badge>
          )}
          {target.amount != null && (
            <Badge variant="outline" className="text-[10px] font-medium text-gold-dark">
              <DollarSign className="mr-0.5 h-2.5 w-2.5" />
              {formatCurrency(target.amount)}
            </Badge>
          )}
          {target.type === "speaker" && target.formSubmittedAt && (
            <>
              <Badge variant="outline" className={cn("text-[10px]", target.presentationApproval ? "text-success border-success/30" : "text-muted-foreground")}>
                <FileText className="mr-0.5 h-2.5 w-2.5" />
                PPT {target.presentationApproval ? "✓" : "✗"}
              </Badge>
              <Badge variant="outline" className={cn("text-[10px]", target.videoApproval ? "text-success border-success/30" : "text-muted-foreground")}>
                {isFr ? "Vidéo" : "Video"} {target.videoApproval ? "✓" : "✗"}
              </Badge>
            </>
          )}
        </div>
        {(target.notes || (target.type === "speaker" && target.bio)) && (
          <div className="mt-2 flex items-start gap-1.5">
            <MessageSquare className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground/60" />
            <p className="text-xs text-muted-foreground line-clamp-2">{target.notes || target.bio}</p>
          </div>
        )}
        <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <User className="h-3 w-3" />
          <span>{getAssigneeFirstName(target.assignee)}</span>
        </div>
      </div>

      {editOpen && <EditTargetDialog target={target} open={editOpen} onClose={() => setEditOpen(false)} />}
    </>
  );
}

function KanbanBoard({
  type,
  stages,
  targets,
  onMove,
}: {
  type: PipelineTarget["type"];
  stages: string[];
  targets: PipelineTarget[];
  onMove: (id: string, stage: string) => void;
}) {
  const { t } = useI18n();
  const [dragOver, setDragOver] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, stage: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver(stage);
  };

  const handleDrop = (e: React.DragEvent, stage: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (id) onMove(id, stage);
    setDragOver(null);
  };

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {stages.map((stage) => {
        const stageTargets = targets.filter((t) => t.stage === stage);
        const isTerminal = isPositiveTerminal(type, stage);
        const isNegative = isNegativeTerminal(type, stage);
        const isDragTarget = dragOver === stage;

        return (
          <div key={stage} className="min-w-[220px] flex-shrink-0 w-[220px]">
            <div className="mb-2 flex items-center justify-between px-1">
              <h4 className={cn("text-xs font-semibold", isNegative ? "text-danger" : isTerminal ? "text-success" : "text-muted-foreground")}>
                {stageLabel(stage, t)}
              </h4>
              <span className="text-[10px] tabular-nums text-muted-foreground">{stageTargets.length}</span>
            </div>
            <div
              onDragOver={(e) => handleDragOver(e, stage)}
              onDragLeave={() => setDragOver(null)}
              onDrop={(e) => handleDrop(e, stage)}
              className={cn(
                "min-h-[120px] space-y-2 rounded-md border border-dashed p-2 transition-colors duration-150",
                isDragTarget
                  ? "border-primary bg-primary/5"
                  : isNegative ? "border-danger/20 bg-danger/3" : isTerminal ? "border-success/20 bg-success/3" : "border-border bg-muted/30"
              )}
            >
              {stageTargets.map((target) => (
                <PipelineCard key={target.id} target={target} onDragStart={handleDragStart} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AddTargetDialog({ open, onClose, type }: { open: boolean; onClose: () => void; type: "endorsement" | "sponsor" | "speaker" }) {
  const { dispatch } = useStore();
  const { locale } = useI18n();
  const isFr = locale === "fr";
  const [org, setOrg] = useState("");
  const [contact, setContact] = useState("");
  const [category, setCategory] = useState<TargetCategory>("corporate");
  const [notes, setNotes] = useState("");
  const [amount, setAmount] = useState("");
  const [assignee, setAssignee] = useState("u1");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!org.trim()) return;
    const target: PipelineTarget = {
      id: `p${Date.now()}`,
      type,
      organization: org.trim(),
      contactName: contact.trim(),
      category,
      stage: type === "speaker" ? "invited" : "identified",
      assignee,
      notes: notes.trim(),
      amount: amount ? parseFloat(amount) : undefined,
      temperature: type === "sponsor" ? "cold" : undefined,
      eventId: "evt1",
    };
    dispatch({ type: "ADD_PIPELINE_TARGET", target });
    setOrg(""); setContact(""); setNotes(""); setAmount(""); setAssignee("u1");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {type === "endorsement"
              ? (isFr ? "Ajouter un endorsement" : "Add Endorsement")
              : type === "sponsor"
              ? (isFr ? "Ajouter un sponsor" : "Add Sponsor")
              : (isFr ? "Ajouter un·e intervenant·e" : "Add Speaker")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>{type === "speaker" ? (isFr ? "Nom de l'intervenant·e" : "Speaker Name") : (isFr ? "Organisation" : "Organization")}</Label>
            <Input value={org} onChange={(e) => setOrg(e.target.value)} required />
          </div>
          <div>
            <Label>{type === "speaker" ? (isFr ? "Titre & organisation" : "Title & Organization") : (isFr ? "Contact clé" : "Key Contact")}</Label>
            <Input value={contact} onChange={(e) => setContact(e.target.value)} />
          </div>
          {type !== "speaker" && (
            <div>
              <Label>{isFr ? "Catégorie" : "Category"}</Label>
              <Select value={category} onValueChange={(v) => { if (v) setCategory(v as TargetCategory); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="government">{isFr ? "Gouvernement" : "Government"}</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                  <SelectItem value="media">{isFr ? "Média" : "Media"}</SelectItem>
                  <SelectItem value="ecosystem">{isFr ? "Écosystème" : "Ecosystem"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {type === "sponsor" && (
            <div>
              <Label>{isFr ? "Montant (€)" : "Amount (€)"}</Label>
              <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
          )}
          <AssigneeCombobox
            value={assignee}
            onChange={setAssignee}
            label={isFr ? "Responsable" : "Assignee"}
          />
          <div>
            <Label>Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {isFr ? "Annuler" : "Cancel"}
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-cobalt-dark">
              {isFr ? "Ajouter" : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ImportDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { dispatch } = useStore();
  const { locale } = useI18n();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<PipelineTarget[]>([]);
  const [error, setError] = useState("");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result as string;
        const lines = text.split("\n").filter(Boolean);
        if (lines.length < 2) { setError("File must have a header row and at least one data row."); return; }
        const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/"/g, ""));
        const orgIdx = headers.findIndex((h) => h.includes("org") || h.includes("company") || h.includes("name"));
        const typeIdx = headers.findIndex((h) => h.includes("type"));
        const contactIdx = headers.findIndex((h) => h.includes("contact"));
        const catIdx = headers.findIndex((h) => h.includes("categ") || h.includes("category"));
        if (orgIdx === -1) { setError("CSV must have an 'organization' or 'company' column."); return; }
        const targets: PipelineTarget[] = lines.slice(1).map((line, i) => {
          const cols = line.split(",").map((c) => c.trim().replace(/"/g, ""));
          const rawType = typeIdx >= 0 ? cols[typeIdx]?.toLowerCase() : "";
          const pType = rawType.includes("sponsor") ? "sponsor" as const
            : rawType.includes("speaker") ? "speaker" as const
            : "endorsement" as const;
          const rawCat = catIdx >= 0 ? cols[catIdx]?.toLowerCase() : "";
          let cat: TargetCategory = "corporate";
          if (rawCat.includes("gov")) cat = "government";
          else if (rawCat.includes("media")) cat = "media";
          else if (rawCat.includes("eco")) cat = "ecosystem";
          return {
            id: `imp${Date.now()}_${i}`,
            type: pType,
            organization: cols[orgIdx] || "",
            contactName: contactIdx >= 0 ? cols[contactIdx] || "" : "",
            category: cat,
            stage: pType === "speaker" ? ("invited" as const) : ("identified" as const),
            assignee: "u1",
            notes: "",
            temperature: pType === "sponsor" ? "cold" as const : undefined,
            eventId: "evt1",
          };
        }).filter((t) => t.organization);
        setPreview(targets);
      } catch {
        setError("Failed to parse CSV file.");
      }
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (preview.length === 0) return;
    dispatch({ type: "IMPORT_PIPELINE_TARGETS", targets: preview });
    setPreview([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{locale === "fr" ? "Importer une liste" : "Import List"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            {locale === "fr"
              ? "CSV avec colonnes : organization, type (endorsement/sponsor/speaker), contact, category (government/corporate/media/ecosystem)"
              : "CSV with columns: organization, type (endorsement/sponsor/speaker), contact, category (government/corporate/media/ecosystem)"}
          </p>
          <input ref={fileRef} type="file" accept=".csv" onChange={handleFile} className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-primary-foreground hover:file:bg-cobalt-dark" />
          {error && <p className="text-xs text-danger">{error}</p>}
          {preview.length > 0 && (
            <div className="rounded-md border border-border bg-muted/30 p-3">
              <p className="text-sm font-medium text-foreground">
                {preview.length} {locale === "fr" ? "cibles trouvées" : "targets found"}
              </p>
              <div className="mt-2 max-h-40 space-y-1 overflow-y-auto">
                {preview.map((t) => (
                  <div key={t.id} className="flex items-center justify-between text-xs">
                    <span className="text-foreground">{t.organization}</span>
                    <Badge variant="outline" className="text-[10px]">{t.type}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {locale === "fr" ? "Annuler" : "Cancel"}
            </Button>
            <Button onClick={handleImport} disabled={preview.length === 0} className="bg-primary text-primary-foreground hover:bg-cobalt-dark">
              {locale === "fr" ? `Importer ${preview.length} cibles` : `Import ${preview.length} targets`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function PipelinePage() {
  const { t, locale } = useI18n();
  const { state, dispatch } = useStore();
  const isFr = locale === "fr";
  const [tab, setTab] = useState<"endorsements" | "sponsors" | "speakers">("endorsements");
  const [addDialog, setAddDialog] = useState<"endorsement" | "sponsor" | "speaker" | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleCopyFormLink = () => {
    const url = `${window.location.origin}/speaker-form`;
    navigator.clipboard.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 1800);
  };

  const endorsements = state.pipelineTargets.filter((p) => p.type === "endorsement");
  const sponsors = state.pipelineTargets.filter((p) => p.type === "sponsor");
  const speakers = state.pipelineTargets.filter((p) => p.type === "speaker");
  const endorsementsObtained = endorsements.filter((e) => e.stage === "obtained").length;
  const sponsorsConfirmed = sponsors.filter((s) => s.stage === "confirmed" || s.stage === "paid").length;
  const totalCommitted = sponsors.filter((s) => s.paymentStatus).reduce((sum, s) => sum + (s.amount || 0), 0);

  // Speaker funnel — each stage is a superset of the one before it, so a
  // speaker who already filled the form still counts toward "form sent".
  const speakersFormSent = speakers.filter((s) => ["form_sent", "form_completed", "confirmed"].includes(s.stage)).length;
  const speakersFormCompleted = speakers.filter((s) => ["form_completed", "confirmed"].includes(s.stage)).length;
  const speakersConfirmed = speakers.filter((s) => s.stage === "confirmed").length;

  const handleMove = (id: string, stage: string) => {
    dispatch({ type: "MOVE_PIPELINE_TARGET", id, stage: stage as EndorsementStage | SponsorStage | SpeakerStage });
  };

  return (
    <div className="space-y-4 p-3 sm:p-5 lg:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">{t.pipeline.title}</h1>
          <p className="text-sm text-muted-foreground">{t.pipeline.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          {tab === "speakers" && (
            <Button variant="outline" onClick={handleCopyFormLink} className="text-sm hover:bg-muted">
              {linkCopied ? <Check className="mr-1.5 h-4 w-4 text-success" /> : <LinkIcon className="mr-1.5 h-4 w-4" />}
              {linkCopied ? (isFr ? "Lien copié" : "Link copied") : (isFr ? "Copier le lien d'inscription" : "Copy registration link")}
            </Button>
          )}
          <Button variant="outline" onClick={() => setImportOpen(true)} className="text-sm hover:bg-muted">
            <Upload className="mr-1.5 h-4 w-4" />
            {isFr ? "Importer" : "Import"}
          </Button>
          <Button
            onClick={() => setAddDialog(tab === "endorsements" ? "endorsement" : tab === "sponsors" ? "sponsor" : "speaker")}
            className="bg-primary text-primary-foreground hover:bg-cobalt-dark active:scale-[0.98] transition-transform duration-100"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            {tab === "endorsements"
              ? (isFr ? "Ajouter endorsement" : "Add Endorsement")
              : tab === "sponsors"
              ? (isFr ? "Ajouter sponsor" : "Add Sponsor")
              : (isFr ? "Ajouter intervenant·e" : "Add Speaker")}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-3 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-cobalt/10">
            <Award className="h-4.5 w-4.5 text-cobalt" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t.dashboard.endorsements}</p>
            <p className="text-lg font-semibold tabular-nums text-foreground">
              {endorsementsObtained}<span className="text-sm text-muted-foreground">/{endorsements.length}</span>
            </p>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-3 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gold/10">
            <Handshake className="h-4.5 w-4.5 text-gold-dark" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t.dashboard.sponsors}</p>
            <p className="text-lg font-semibold tabular-nums text-foreground">
              {sponsorsConfirmed}<span className="text-sm text-muted-foreground">/{sponsors.length}</span>
            </p>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-3 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-success/10">
            <DollarSign className="h-4.5 w-4.5 text-success" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t.dashboard.amountRaised}</p>
            <p className="text-lg font-semibold tabular-nums text-foreground">{formatCurrency(totalCommitted)}</p>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-ecn/10">
              <Mic2 className="h-4.5 w-4.5 text-ecn-dark" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{isFr ? "Intervenants confirmés" : "Speakers Confirmed"}</p>
              <p className="text-lg font-semibold tabular-nums text-foreground">
                {speakersConfirmed}<span className="text-sm text-muted-foreground">/{SPEAKER_TARGET}</span>
              </p>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-3 border-t border-border pt-2 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              {speakersFormSent} {isFr ? "envoyés" : "sent"}
            </span>
            <span className="flex items-center gap-1">
              <FileCheck2 className="h-3 w-3" />
              {speakersFormCompleted} {isFr ? "reçus" : "completed"}
            </span>
          </div>
        </div>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as "endorsements" | "sponsors" | "speakers")}>
        <TabsList>
          <TabsTrigger value="endorsements" className="gap-1.5">
            <Award className="h-3.5 w-3.5" />
            {t.pipeline.endorsementsPipeline}
          </TabsTrigger>
          <TabsTrigger value="sponsors" className="gap-1.5">
            <Handshake className="h-3.5 w-3.5" />
            {t.pipeline.sponsorsPipeline}
          </TabsTrigger>
          <TabsTrigger value="speakers" className="gap-1.5">
            <Mic2 className="h-3.5 w-3.5" />
            {t.pipeline.speakersPipeline}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {tab === "endorsements" ? (
        <KanbanBoard type="endorsement" stages={endorsementStages} targets={endorsements} onMove={handleMove} />
      ) : tab === "sponsors" ? (
        <KanbanBoard type="sponsor" stages={sponsorStages} targets={sponsors} onMove={handleMove} />
      ) : (
        <KanbanBoard type="speaker" stages={speakerStages} targets={speakers} onMove={handleMove} />
      )}

      {addDialog && <AddTargetDialog open type={addDialog} onClose={() => setAddDialog(null)} />}
      <ImportDialog open={importOpen} onClose={() => setImportOpen(false)} />
    </div>
  );
}
