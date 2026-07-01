"use client";

import { useState, useRef, useEffect } from "react";
import { getAssignableUsers, getUserById } from "@/lib/mock-data";
import { Label } from "@/components/ui/label";
import { Check, ChevronDown, UserCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function AssigneeCombobox({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  const assignable = getAssignableUsers();
  const knownUser = getUserById(value);
  const [query, setQuery] = useState(knownUser ? knownUser.name : value);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const u = getUserById(value);
    setQuery(u ? u.name : value);
  }, [value]);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        // Commit whatever is currently typed — either a known user's name or free text
        const match = assignable.find((u) => u.name.toLowerCase() === query.trim().toLowerCase());
        onChange(match ? match.id : query.trim() || value);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, query]);

  const filtered = assignable.filter((u) =>
    u.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  const handleSelect = (userId: string) => {
    const u = getUserById(userId);
    setQuery(u ? u.name : userId);
    onChange(userId);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <Label>{label}</Label>
      <div className="relative">
        <UserCircle2 className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Type a name…"
          className="h-9 w-full rounded-md border border-input bg-background pl-8 pr-7 text-sm text-foreground transition-colors duration-150 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
        <ChevronDown className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-48 overflow-y-auto rounded-md border border-border bg-popover shadow-lg">
          {filtered.length > 0 ? (
            filtered.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleSelect(u.id)}
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-foreground transition-colors duration-100 hover:bg-muted"
              >
                <span>
                  {u.name}
                  <span className="ml-1.5 text-xs text-muted-foreground">· {u.organization}</span>
                </span>
                {u.id === value && <Check className="h-3.5 w-3.5 text-primary" />}
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-xs text-muted-foreground">
              No match — press away to use &ldquo;{query.trim()}&rdquo; as a free-text name
            </div>
          )}
        </div>
      )}
    </div>
  );
}
