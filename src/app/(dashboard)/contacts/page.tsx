"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/context";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Plus, Download, Search, Mail, Phone, Building, Mic2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Contact } from "@/lib/types";

function AddContactDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { dispatch } = useStore();
  const { locale } = useI18n();
  const isFr = locale === "fr";
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const contact: Contact = {
      id: `c${Date.now()}`,
      name: name.trim(),
      organization: organization.trim(),
      role: role.trim(),
      email: email.trim(),
      phone: phone.trim(),
    };
    dispatch({ type: "ADD_CONTACT", contact });
    setName(""); setOrganization(""); setRole(""); setEmail(""); setPhone("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isFr ? "Nouveau contact" : "New Contact"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>{isFr ? "Nom" : "Name"}</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>{isFr ? "Organisation" : "Organization"}</Label>
              <Input value={organization} onChange={(e) => setOrganization(e.target.value)} />
            </div>
            <div>
              <Label>{isFr ? "Rôle" : "Role"}</Label>
              <Input value={role} onChange={(e) => setRole(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label>{isFr ? "Téléphone" : "Phone"}</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
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

function exportContactsCsv(contacts: Contact[]) {
  const headers = ["Name", "Organization", "Role", "Email", "Phone"];
  const escape = (v: string) => `"${(v || "").replace(/"/g, '""')}"`;
  const rows = contacts.map((c) => [c.name, c.organization, c.role, c.email, c.phone].map(escape).join(","));
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `cemac-contacts-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function ContactsPage() {
  const { t, locale } = useI18n();
  const { user } = useAuth();
  const { state, dispatch } = useStore();
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const isAdmin = user?.role === "admin";
  const contacts = state.contacts;
  const isFr = locale === "fr";

  const filtered = contacts.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.organization.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  });

  const handleExport = () => {
    exportContactsCsv(filtered.length > 0 ? filtered : contacts);
    dispatch({
      type: "ADD_ACTIVITY",
      entry: {
        id: `a${Date.now()}`,
        userId: user?.id || "u1",
        action: "exported",
        target: `${contacts.length} ${isFr ? "contacts (CSV)" : "contacts (CSV)"}`,
        timestamp: new Date().toISOString(),
      },
    });
  };

  return (
    <div className="space-y-4 p-3 sm:p-5 lg:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">{t.contacts.title}</h1>
          <p className="text-sm text-muted-foreground">{t.contacts.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={contacts.length === 0}
              className="text-sm hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <Download className="mr-1.5 h-4 w-4" />
              {t.contacts.exportContacts}
            </Button>
          )}
          <Button
            onClick={() => setAddOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-cobalt-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.98] transition-transform duration-100"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            {t.contacts.newContact}
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.common.search}
            className="h-9 w-full rounded-md border border-input bg-muted/40 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors duration-150 ease-out focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {t.contacts.totalContacts}: <span className="font-medium text-foreground">{filtered.length}</span>
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-x-auto">
        <Table className="min-w-[560px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs font-medium uppercase tracking-wide">{t.common.name}</TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wide">{t.common.organization}</TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wide">{t.common.role}</TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wide">{t.common.email}</TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wide">{t.common.phone}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((contact) => (
              <TableRow key={contact.id} className="group">
                <TableCell className="font-medium text-foreground">
                  <div className="flex items-center gap-2">
                    <span>{contact.name}</span>
                    {contact.source === "speaker_form" && (
                      <Badge variant="outline" className="gap-1 text-[10px] font-normal text-ecn-dark border-ecn/30">
                        <Mic2 className="h-2.5 w-2.5" />
                        {isFr ? "Intervenant·e" : "Speaker"}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Building className="h-3.5 w-3.5" />
                    <span>{contact.organization}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{contact.role}</TableCell>
                <TableCell>
                  {contact.email ? (
                    <a
                      href={`mailto:${contact.email}`}
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      <Mail className="h-3 w-3" />
                      {contact.email}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    {contact.phone && <Phone className="h-3 w-3" />}
                    {contact.phone || "—"}
                  </span>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                  {contacts.length === 0
                    ? (isFr ? "Aucun contact pour le moment. Ajoutez le premier." : "No contacts yet. Add the first one.")
                    : (isFr ? "Aucun contact trouvé" : "No contacts found")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AddContactDialog open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
