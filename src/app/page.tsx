"use client";

import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, Users, Flag, Layers } from "lucide-react";

export default function LandingPage() {
  const { user, isLoading, activeClientId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (user) {
      if (user.role === "admin" && !activeClientId) {
        router.replace("/select");
      } else if (user) {
        router.replace("/dashboard");
      }
    }
  }, [isLoading, user, activeClientId, router]);

  if (isLoading || user) {
    return (
      <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", background: "#07090f" }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid #c9a84c", borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#07090f", color: "#f0ebe0", fontFamily: "var(--font-sans, Inter, sans-serif)" }}>

      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 48px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #c9a84c 0%, #a07830 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: "0.02em"
          }}>
            MB
          </div>
          <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em", color: "#f0ebe0" }}>
            MB Corporation
          </span>
        </div>

        <Link
          href="/login"
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "9px 20px", borderRadius: 8,
            background: "linear-gradient(135deg, #c9a84c 0%, #a07830 100%)",
            color: "#fff", fontWeight: 600, fontSize: 13,
            textDecoration: "none", letterSpacing: "0.01em",
            boxShadow: "0 4px 20px rgba(201,168,76,0.25)",
            transition: "opacity 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Connexion <ArrowRight size={14} />
        </Link>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: "center", padding: "100px 24px 80px", position: "relative", overflow: "hidden" }}>
        {/* Background glow */}
        <div style={{
          position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)",
          width: 600, height: 400, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28,
          padding: "6px 14px", borderRadius: 999,
          border: "1px solid rgba(201,168,76,0.25)",
          background: "rgba(201,168,76,0.07)",
          fontSize: 12, fontWeight: 600, color: "#c9a84c", letterSpacing: "0.05em",
        }}>
          PLATEFORME DE GESTION D'ÉVÉNEMENTS
        </div>

        <h1 style={{
          fontSize: "clamp(36px, 6vw, 68px)",
          fontWeight: 800,
          lineHeight: 1.08,
          letterSpacing: "-0.03em",
          marginBottom: 24,
          background: "linear-gradient(135deg, #f0ebe0 0%, #c9a84c 60%, #a07830 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          maxWidth: 820,
          margin: "0 auto 24px",
        }}>
          Gérez vos événements<br />avec précision
        </h1>

        <p style={{
          fontSize: 18, lineHeight: 1.65, color: "rgba(240,235,224,0.55)",
          maxWidth: 560, margin: "0 auto 48px",
        }}>
          La plateforme tout-en-un pour piloter vos sommets, conférences et événements d'entreprise. Jalons, missions, pipeline — tout en un seul endroit.
        </p>

        <Link
          href="/login"
          style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "14px 32px", borderRadius: 10,
            background: "linear-gradient(135deg, #c9a84c 0%, #a07830 100%)",
            color: "#fff", fontWeight: 700, fontSize: 15,
            textDecoration: "none", letterSpacing: "0.01em",
            boxShadow: "0 8px 32px rgba(201,168,76,0.30), 0 2px 8px rgba(0,0,0,0.4)",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(201,168,76,0.40), 0 2px 8px rgba(0,0,0,0.4)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 8px 32px rgba(201,168,76,0.30), 0 2px 8px rgba(0,0,0,0.4)"; }}
        >
          Accéder à la plateforme <ArrowRight size={16} />
        </Link>
      </section>

      {/* Features */}
      <section style={{ padding: "0 24px 100px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          {[
            { icon: Flag, title: "Jalons & Objectifs", desc: "Suivez chaque étape clé de votre événement avec des indicateurs de statut en temps réel." },
            { icon: BarChart3, title: "Tableau de bord", desc: "Vue d'ensemble complète : progression globale, missions en retard, prochaines échéances." },
            { icon: Layers, title: "Pipeline de partenaires", desc: "Gérez endorsements, sponsors et intervenants dans un pipeline visuel et intuitif." },
            { icon: Users, title: "Espaces multi-clients", desc: "Gérez plusieurs clients en parallèle. Chaque client dispose de son propre espace cloisonné." },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              style={{
                padding: "28px 24px",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div style={{
                width: 42, height: 42, borderRadius: 10, marginBottom: 16,
                background: "rgba(201,168,76,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon size={20} color="#c9a84c" />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, color: "#f0ebe0" }}>{title}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(240,235,224,0.45)" }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "28px 48px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: "linear-gradient(135deg, #c9a84c 0%, #a07830 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700, color: "#fff",
          }}>MB</div>
          <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(240,235,224,0.6)" }}>MB Corporation</span>
        </div>
        <p style={{ fontSize: 12, color: "rgba(240,235,224,0.3)" }}>
          © {new Date().getFullYear()} MB Corporation. Tous droits réservés.
        </p>
      </footer>
    </div>
  );
}
