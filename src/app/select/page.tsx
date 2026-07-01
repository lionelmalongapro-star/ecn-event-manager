"use client";

import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Plus, X, Building2, LogOut } from "lucide-react";
import type { Client } from "@/lib/types";

const INDUSTRY_OPTIONS = [
  "Energy & Infrastructure",
  "Finance & Banking",
  "Technology",
  "Healthcare",
  "Government",
  "Education",
  "Media & Communication",
  "Other",
];

const COLOR_OPTIONS = [
  { label: "Orange", value: "oklch(0.70 0.19 45)" },
  { label: "Blue", value: "oklch(0.55 0.18 250)" },
  { label: "Green", value: "oklch(0.60 0.16 145)" },
  { label: "Purple", value: "oklch(0.58 0.20 300)" },
  { label: "Red", value: "oklch(0.60 0.20 25)" },
  { label: "Teal", value: "oklch(0.62 0.16 185)" },
];

export default function SelectPage() {
  const { user, isLoading, clients, setActiveClient, createClient, logout } = useAuth();
  const router = useRouter();

  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    initials: "",
    industry: INDUSTRY_OPTIONS[0],
    color: COLOR_OPTIONS[0].value,
  });

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.replace("/login"); return; }
    if (user.role !== "admin") { router.replace("/dashboard"); return; }
  }, [isLoading, user, router]);

  function handleEnter(clientId: string) {
    setActiveClient(clientId);
    router.push("/dashboard");
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.initials.trim()) return;
    setCreating(true);
    const newClient = createClient({
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      initials: form.initials.trim().toUpperCase().slice(0, 4),
      industry: form.industry,
      color: form.color,
    });
    setShowCreate(false);
    setForm({ name: "", description: "", initials: "", industry: INDUSTRY_OPTIONS[0], color: COLOR_OPTIONS[0].value });
    setCreating(false);
    setActiveClient(newClient.id);
    router.push("/dashboard");
  }

  if (isLoading || !user) {
    return (
      <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", background: "#07090f" }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid #c9a84c", borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#07090f", color: "#f0ebe0", fontFamily: "var(--font-sans, Inter, sans-serif)" }}>

      {/* Top bar */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 40px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg, #c9a84c 0%, #a07830 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700, color: "#fff",
          }}>MB</div>
          <span style={{ fontWeight: 700, fontSize: 14, color: "#f0ebe0", letterSpacing: "-0.01em" }}>MB Corporation</span>
        </div>
        <button
          onClick={() => { logout(); router.replace("/"); }}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "7px 14px", borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "transparent", color: "rgba(240,235,224,0.5)",
            fontSize: 13, fontWeight: 500, cursor: "pointer",
            transition: "color 0.15s, border-color 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#f0ebe0"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(240,235,224,0.5)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
        >
          <LogOut size={14} /> Déconnexion
        </button>
      </nav>

      {/* Main */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: "#c9a84c", marginBottom: 10, textTransform: "uppercase" }}>
            Espaces clients
          </p>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.025em", color: "#f0ebe0", marginBottom: 8 }}>
            Sélectionnez un client
          </h1>
          <p style={{ fontSize: 14, color: "rgba(240,235,224,0.45)", lineHeight: 1.6 }}>
            Chaque client dispose de son propre espace de travail isolé.
          </p>
        </div>

        {/* Client cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16, marginBottom: 20 }}>
          {clients.map((client) => (
            <ClientCard key={client.id} client={client} onEnter={handleEnter} />
          ))}

          {/* Create new card */}
          <button
            onClick={() => setShowCreate(true)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12,
              padding: "32px 24px", borderRadius: 14,
              border: "2px dashed rgba(255,255,255,0.10)",
              background: "transparent", color: "rgba(240,235,224,0.35)",
              cursor: "pointer", minHeight: 160,
              transition: "border-color 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.35)"; e.currentTarget.style.color = "#c9a84c"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)"; e.currentTarget.style.color = "rgba(240,235,224,0.35)"; }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              border: "2px dashed currentColor",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Plus size={20} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Nouveau client</span>
          </button>
        </div>
      </div>

      {/* Create modal */}
      {showCreate && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 50,
          background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
        }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowCreate(false); }}
        >
          <div style={{
            width: "100%", maxWidth: 480, borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.10)",
            background: "#0e1119", padding: "32px",
            boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f0ebe0" }}>Nouveau client</h2>
              <button
                onClick={() => setShowCreate(false)}
                style={{ background: "none", border: "none", color: "rgba(240,235,224,0.4)", cursor: "pointer", padding: 4 }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12 }}>
                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(240,235,224,0.45)" }}>
                    Nom du client *
                  </span>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setForm((f) => ({
                        ...f, name,
                        initials: f.initials || name.split(/\s+/).map(w => w[0]).join("").toUpperCase().slice(0, 4),
                      }));
                    }}
                    placeholder="Ex: ECN, CEMAC..."
                    style={inputStyle}
                  />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(240,235,224,0.45)" }}>
                    Initiales *
                  </span>
                  <input
                    required
                    value={form.initials}
                    onChange={(e) => setForm((f) => ({ ...f, initials: e.target.value.toUpperCase().slice(0, 4) }))}
                    placeholder="ECN"
                    maxLength={4}
                    style={{ ...inputStyle, width: 72 }}
                  />
                </label>
              </div>

              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(240,235,224,0.45)" }}>
                  Description
                </span>
                <input
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Optionnel"
                  style={inputStyle}
                />
              </label>

              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(240,235,224,0.45)" }}>
                  Secteur
                </span>
                <select
                  value={form.industry}
                  onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))}
                  style={inputStyle}
                >
                  {INDUSTRY_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </label>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(240,235,224,0.45)" }}>
                  Couleur
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  {COLOR_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, color: opt.value }))}
                      style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: opt.value,
                        border: form.color === opt.value ? "2px solid #f0ebe0" : "2px solid transparent",
                        cursor: "pointer", outline: "none",
                        boxShadow: form.color === opt.value ? "0 0 0 3px rgba(255,255,255,0.15)" : "none",
                        transition: "box-shadow 0.15s",
                      }}
                      title={opt.label}
                    />
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  style={{
                    flex: 1, padding: "10px", borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "transparent", color: "rgba(240,235,224,0.6)",
                    fontSize: 13, fontWeight: 600, cursor: "pointer",
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  style={{
                    flex: 2, padding: "10px", borderRadius: 8,
                    background: "linear-gradient(135deg, #c9a84c 0%, #a07830 100%)",
                    border: "none", color: "#fff",
                    fontSize: 13, fontWeight: 700, cursor: "pointer",
                    opacity: creating ? 0.7 : 1,
                  }}
                >
                  {creating ? "Création…" : "Créer et accéder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  height: 40, width: "100%", borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.05)",
  color: "#f0ebe0", fontSize: 13, padding: "0 12px",
  outline: "none", boxSizing: "border-box",
  appearance: "none",
};

function ClientCard({ client, onEnter }: { client: Client; onEnter: (id: string) => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "28px 24px", borderRadius: 14,
        border: `1px solid ${hovered ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.07)"}`,
        background: hovered ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
        cursor: "pointer", transition: "all 0.15s",
        display: "flex", flexDirection: "column", gap: 16,
      }}
      onClick={() => onEnter(client.id)}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: client.color,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, fontWeight: 800, color: "#fff", letterSpacing: "0.02em",
          boxShadow: `0 4px 16px ${client.color}40`,
        }}>
          {client.initials}
        </div>
        <ArrowRight size={16} color={hovered ? "rgba(240,235,224,0.7)" : "rgba(240,235,224,0.2)"} style={{ transition: "color 0.15s", marginTop: 4 }} />
      </div>

      <div>
        <p style={{ fontWeight: 700, fontSize: 16, color: "#f0ebe0", marginBottom: 4 }}>{client.name}</p>
        {client.industry && (
          <p style={{ fontSize: 12, color: "rgba(240,235,224,0.4)", marginBottom: client.description ? 6 : 0 }}>{client.industry}</p>
        )}
        {client.description && (
          <p style={{ fontSize: 12, lineHeight: 1.5, color: "rgba(240,235,224,0.35)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {client.description}
          </p>
        )}
      </div>
    </div>
  );
}
