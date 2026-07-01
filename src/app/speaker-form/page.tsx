"use client";

import { useState, useRef } from "react";
import { useI18n } from "@/i18n/context";
import { useStore } from "@/lib/store";
import { Globe, Upload, CheckCircle2, Mic2, User } from "lucide-react";

export default function SpeakerFormPage() {
  const { locale, setLocale } = useI18n();
  const { dispatch } = useStore();
  const isFr = locale === "fr";
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [phoneOffice, setPhoneOffice] = useState("");
  const [phoneMobile, setPhoneMobile] = useState("");
  const [presentationApproval, setPresentationApproval] = useState<boolean | null>(null);
  const [videoApproval, setVideoApproval] = useState<boolean | null>(null);
  const [bio, setBio] = useState("");
  const [photoDataUrl, setPhotoDataUrl] = useState<string | undefined>(undefined);
  const [photoName, setPhotoName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoDataUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !jobTitle.trim() || !company.trim() || !bio.trim()) return;
    if (presentationApproval === null || videoApproval === null) return;

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));

    dispatch({
      type: "SUBMIT_SPEAKER_FORM",
      submission: {
        name, email, jobTitle, company, phoneOffice, phoneMobile,
        presentationApproval, videoApproval, bio, photoDataUrl,
      },
    });

    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="absolute right-6 top-6">
          <button
            onClick={() => setLocale(isFr ? "en" : "fr")}
            className="flex items-center gap-2 rounded-full border border-border bg-muted/60 px-4 py-2 text-sm font-medium text-foreground transition-all duration-200 hover:bg-muted"
          >
            <Globe className="h-4 w-4 text-primary" />
            {isFr ? "English" : "Français"}
          </button>
        </div>
        <div className="w-full max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/15">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
            {isFr ? "Merci !" : "Thank you!"}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {isFr
              ? "Votre inscription a bien été reçue. Notre équipe va vérifier vos informations et reviendra vers vous pour confirmer votre participation au Sommet CEMAC 2026."
              : "Your registration has been received. Our team will review your information and follow up to confirm your participation in the CEMAC Summit 2026."}
          </p>
          <div className="mt-8 rounded-xl border border-border bg-card p-4 text-left">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{isFr ? "Récapitulatif" : "Summary"}</p>
            <p className="mt-2 text-sm font-medium text-foreground">{name}</p>
            <p className="text-xs text-muted-foreground">{jobTitle}, {company}</p>
            <p className="mt-1 text-xs text-muted-foreground">{email}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground text-sm font-semibold">
            SC
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {isFr ? "Sommet CEMAC 2026" : "CEMAC Summit 2026"}
            </p>
            <p className="text-xs text-muted-foreground">Brazzaville, 20–22 {isFr ? "octobre" : "October"} 2026</p>
          </div>
        </div>
        <button
          onClick={() => setLocale(isFr ? "en" : "fr")}
          className="flex items-center gap-2 rounded-full border border-border bg-muted/60 px-4 py-2 text-sm font-medium text-foreground transition-all duration-200 hover:bg-muted"
        >
          <Globe className="h-4 w-4 text-primary" />
          {isFr ? "English" : "Français"}
        </button>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-10">
        <div className="flex items-center gap-2 text-primary">
          <Mic2 className="h-5 w-5" />
          <span className="text-xs font-medium uppercase tracking-wide">
            {isFr ? "Formulaire d'inscription intervenant" : "Speaker Registration Form"}
          </span>
        </div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground" style={{ textWrap: "balance" }}>
          {isFr
            ? "Merci d'accepter d'être intervenant·e / panéliste"
            : "Thank you for agreeing to be a speaker/panelist"}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {isFr
            ? "Merci de compléter le formulaire ci-dessous pour que nous ayons vos informations à jour. Une fois reçues, nous pourrons vous inscrire sur le site, l'agenda et la brochure de l'événement."
            : "Please complete the form below to ensure we have your correct and most current information. Once received, we'll be able to register you on the event website, agenda, and brochure."}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Name & email */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1.5">
                {isFr ? "Nom de l'intervenant·e" : "Speaker's Name"} *
              </label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isFr ? "Tel qu'il apparaîtra sur le site" : "As it should appear on the website"}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1.5">
                {isFr ? "Email de l'intervenant·e" : "Speaker's Email"} *
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
          </div>

          {/* Job title & company */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1.5">
                {isFr ? "Titre du poste" : "Job Title"} *
              </label>
              <input
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1.5">
                {isFr ? "Société" : "Company"} *
              </label>
              <input
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder={isFr ? "Exactement comme il doit apparaître" : "Exactly as it should appear"}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1.5">
              {isFr ? "Numéro de téléphone" : "Phone Number"}
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                value={phoneOffice}
                onChange={(e) => setPhoneOffice(e.target.value)}
                placeholder={isFr ? "Bureau" : "Office"}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
              <input
                value={phoneMobile}
                onChange={(e) => setPhoneMobile(e.target.value)}
                placeholder={isFr ? "Mobile" : "Mobile"}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
          </div>

          {/* Presentation approval */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1.5">
              {isFr ? "Autorisation de présentation" : "Presentation Approval"} *
            </label>
            <p className="text-xs text-muted-foreground mb-2">
              {isFr
                ? "Si vous utilisez un PowerPoint, peut-il être partagé en PDF aux participants après la conférence ?"
                : "If you are using a PowerPoint, may it be shared with attendees as a PDF after the conference?"}
            </p>
            <div className="flex gap-2">
              {[true, false].map((val) => (
                <button
                  key={String(val)}
                  type="button"
                  onClick={() => setPresentationApproval(val)}
                  className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-150 ${
                    presentationApproval === val
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input bg-background text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {val ? (isFr ? "Oui" : "Yes") : (isFr ? "Non" : "No")}
                </button>
              ))}
            </div>
          </div>

          {/* Video approval */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1.5">
              {isFr ? "Autorisation vidéo" : "Video Approval"} *
            </label>
            <p className="text-xs text-muted-foreground mb-2">
              {isFr
                ? "La vidéo de votre intervention peut-elle être partagée après la conférence, ou utilisée en extraits marketing ?"
                : "May video of your presentation be shared after the conference, or clips shown in post-event marketing?"}
            </p>
            <div className="flex gap-2">
              {[true, false].map((val) => (
                <button
                  key={String(val)}
                  type="button"
                  onClick={() => setVideoApproval(val)}
                  className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-150 ${
                    videoApproval === val
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input bg-background text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {val ? (isFr ? "Oui" : "Yes") : (isFr ? "Non" : "No")}
                </button>
              ))}
            </div>
          </div>

          {/* Photo */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1.5">
              {isFr ? "Votre photo" : "Your Photograph"}
            </label>
            <p className="text-xs text-muted-foreground mb-2">
              {isFr ? "Joignez votre photo de profil la plus récente" : "Please attach a copy of your most recent headshot"}
            </p>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex w-full items-center gap-3 rounded-lg border border-dashed border-input bg-background px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted"
            >
              {photoDataUrl ? (
                <img src={photoDataUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <User className="h-5 w-5 text-muted-foreground" />
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Upload className="h-3.5 w-3.5" />
                {photoName || (isFr ? "Choisir un fichier…" : "Choose a file…")}
              </span>
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1.5">
              Bio *
            </label>
            <p className="text-xs text-muted-foreground mb-2">
              {isFr ? "Merci d'inclure une courte biographie." : "Please include a brief bio."}
            </p>
            <textarea
              required
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-all duration-150 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.99] disabled:opacity-60"
          >
            {submitting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              isFr ? "Envoyer mon inscription" : "Submit Registration"
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
