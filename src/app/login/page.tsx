"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/i18n/context";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn, Globe } from "lucide-react";

export default function LoginPage() {
  const { login, user, isLoading } = useAuth();
  const { locale, setLocale } = useI18n();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const isFr = locale === "fr";

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/");
    }
  }, [isLoading, user, router]);

  if (!isLoading && user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));
    const err = login(email, password);
    if (err) {
      setError(isFr ? "Email ou mot de passe incorrect" : "Incorrect email or password");
      setSubmitting(false);
    } else {
      router.replace("/");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-ecn border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Left panel — image + branding overlay with ECN warm tint */}
      <div className="relative hidden lg:flex lg:w-[520px] flex-col justify-between overflow-hidden">
        <img
          src="/login-bg.jpg"
          alt="Data center corridor"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Dark base layer for readability */}
        <div className="absolute inset-0 bg-black/55" />
        {/* Warm orange-tinted gradient overlay — ECN nod */}
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.12_0.05_55)/95%] via-transparent to-transparent" />

        <div className="relative z-10 p-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ecn/90 text-sm font-bold text-white">
            SC
          </div>
        </div>

        <div className="relative z-10 p-10">
          <h1 className="text-2xl font-semibold leading-tight tracking-tight text-white" style={{ textWrap: "balance" }}>
            {isFr
              ? "Sommet CEMAC sur les Data Centres, l'Énergie & l'Infrastructure IA 2026"
              : "CEMAC Data Center, Energy & AI Infrastructure Summit 2026"}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            {isFr
              ? "Plateforme de pilotage — Brazzaville, 20–22 octobre 2026"
              : "Management platform — Brazzaville, October 20–22, 2026"}
          </p>
          <div className="mt-6 flex items-center gap-2">
            <div className="h-px flex-1 bg-white/20" />
            <p className="text-xs text-white/60">
              Powered by Lionel Malonga
            </p>
            <div className="h-px flex-1 bg-white/20" />
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="relative flex flex-1 items-center justify-center px-6">
        {/* Language toggle */}
        <div className="absolute right-6 top-6">
          <button
            onClick={() => setLocale(isFr ? "en" : "fr")}
            className="flex items-center gap-2 rounded-full border border-border bg-muted/60 px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-all duration-200 hover:bg-muted hover:shadow-md hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ecn active:scale-95"
          >
            <Globe className="h-4 w-4 text-ecn-dark" />
            {isFr ? "English" : "Français"}
          </button>
        </div>

        <div className="w-full max-w-sm">
          {/* Mobile branding */}
          <div className="lg:hidden mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ecn text-sm font-bold text-white">
              SC
            </div>
            <h1 className="mt-4 text-xl font-semibold tracking-tight text-foreground">
              {isFr ? "Sommet CEMAC 2026" : "CEMAC Summit 2026"}
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">Powered by Lionel Malonga</p>
          </div>

          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {isFr ? "Connexion" : "Sign in"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {isFr
              ? "Entrez vos identifiants pour accéder à la plateforme."
              : "Enter your credentials to access the platform."}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoFocus
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors duration-150 focus:border-ecn focus:outline-none focus:ring-1 focus:ring-ecn/30"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1.5">
                {isFr ? "Mot de passe" : "Password"}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="h-10 w-full rounded-md border border-input bg-background px-3 pr-10 text-sm text-foreground transition-colors duration-150 focus:border-ecn focus:outline-none focus:ring-1 focus:ring-ecn/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-150"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-ecn text-sm font-medium text-white transition-all duration-150 hover:bg-ecn-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ecn active:scale-[0.98] disabled:opacity-60"
            >
              {submitting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  {isFr ? "Se connecter" : "Sign in"}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
