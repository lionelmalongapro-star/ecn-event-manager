"use client";

import { createContext, useContext, useReducer, useEffect, useRef, type ReactNode, type Dispatch } from "react";
import {
  missions as initialMissions,
  pipelineTargets as initialTargets,
  contacts as initialContacts,
  activityLog as initialActivity,
  notifications as initialNotifications,
  currentUser,
} from "./mock-data";
import type { Mission, PipelineTarget, Contact, ActivityEntry, Notification, MissionStatus, EndorsementStage, SponsorStage, SpeakerStage } from "./types";

type State = {
  missions: Mission[];
  pipelineTargets: PipelineTarget[];
  contacts: Contact[];
  activityLog: ActivityEntry[];
  notifications: Notification[];
};

type SpeakerFormSubmission = {
  name: string;
  email: string;
  jobTitle: string;
  company: string;
  phoneOffice: string;
  phoneMobile: string;
  presentationApproval: boolean;
  videoApproval: boolean;
  bio: string;
  photoDataUrl?: string;
};

type Action =
  | { type: "ADD_MISSION"; mission: Mission }
  | { type: "UPDATE_MISSION"; id: string; updates: Partial<Mission> }
  | { type: "DELETE_MISSION"; id: string }
  | { type: "TOGGLE_SUBTASK"; missionId: string; subtaskId: string }
  | { type: "ADD_PIPELINE_TARGET"; target: PipelineTarget }
  | { type: "MOVE_PIPELINE_TARGET"; id: string; stage: EndorsementStage | SponsorStage | SpeakerStage }
  | { type: "ADD_CONTACT"; contact: Contact }
  | { type: "ADD_ACTIVITY"; entry: ActivityEntry }
  | { type: "MARK_NOTIFICATION_READ"; id: string }
  | { type: "MARK_ALL_NOTIFICATIONS_READ" }
  | { type: "IMPORT_PIPELINE_TARGETS"; targets: PipelineTarget[] }
  | { type: "UPDATE_PIPELINE_TARGET"; id: string; updates: Partial<PipelineTarget> }
  | { type: "DELETE_PIPELINE_TARGET"; id: string }
  | { type: "SUBMIT_SPEAKER_FORM"; submission: SpeakerFormSubmission }
  | { type: "HYDRATE"; state: State };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "HYDRATE":
      return action.state;
    case "ADD_MISSION":
      return {
        ...state,
        missions: [...state.missions, action.mission],
        activityLog: [
          { id: `a${Date.now()}`, userId: currentUser.id, action: "created", target: `Mission "${action.mission.title}"`, timestamp: new Date().toISOString() },
          ...state.activityLog,
        ],
      };
    case "UPDATE_MISSION":
      return {
        ...state,
        missions: state.missions.map((m) => m.id === action.id ? { ...m, ...action.updates } : m),
        activityLog: [
          { id: `a${Date.now()}`, userId: currentUser.id, action: "updated", target: `Mission "${state.missions.find(m => m.id === action.id)?.title}"`, timestamp: new Date().toISOString() },
          ...state.activityLog,
        ],
      };
    case "DELETE_MISSION":
      return {
        ...state,
        missions: state.missions.filter((m) => m.id !== action.id),
        activityLog: [
          { id: `a${Date.now()}`, userId: currentUser.id, action: "deleted", target: `Mission "${state.missions.find(m => m.id === action.id)?.title}"`, timestamp: new Date().toISOString() },
          ...state.activityLog,
        ],
      };
    case "TOGGLE_SUBTASK":
      return {
        ...state,
        missions: state.missions.map((m) => {
          if (m.id !== action.missionId) return m;
          const subtasks = m.subtasks.map((s) =>
            s.id === action.subtaskId ? { ...s, done: !s.done } : s
          );
          const allDone = subtasks.length > 0 && subtasks.every((s) => s.done);
          const anyDone = subtasks.some((s) => s.done);
          const status: MissionStatus = allDone ? "completed" : anyDone ? "in_progress" : "not_started";
          return { ...m, subtasks, status };
        }),
      };
    case "ADD_PIPELINE_TARGET":
      return {
        ...state,
        pipelineTargets: [...state.pipelineTargets, action.target],
        activityLog: [
          { id: `a${Date.now()}`, userId: currentUser.id, action: "added", target: `${action.target.type === "endorsement" ? "Endorsement" : "Sponsor"} target "${action.target.organization}"`, timestamp: new Date().toISOString() },
          ...state.activityLog,
        ],
      };
    case "MOVE_PIPELINE_TARGET":
      return {
        ...state,
        pipelineTargets: state.pipelineTargets.map((t) =>
          t.id === action.id ? { ...t, stage: action.stage } : t
        ),
        activityLog: [
          { id: `a${Date.now()}`, userId: currentUser.id, action: "moved", target: `${state.pipelineTargets.find((t) => t.id === action.id)?.organization} → ${action.stage}`, timestamp: new Date().toISOString() },
          ...state.activityLog,
        ],
      };
    case "UPDATE_PIPELINE_TARGET":
      return {
        ...state,
        pipelineTargets: state.pipelineTargets.map((t) =>
          t.id === action.id ? { ...t, ...action.updates } : t
        ),
        activityLog: [
          { id: `a${Date.now()}`, userId: currentUser.id, action: "updated", target: `${state.pipelineTargets.find((t) => t.id === action.id)?.organization}`, timestamp: new Date().toISOString() },
          ...state.activityLog,
        ],
      };
    case "DELETE_PIPELINE_TARGET":
      return {
        ...state,
        pipelineTargets: state.pipelineTargets.filter((t) => t.id !== action.id),
        activityLog: [
          { id: `a${Date.now()}`, userId: currentUser.id, action: "deleted", target: `${state.pipelineTargets.find((t) => t.id === action.id)?.organization}`, timestamp: new Date().toISOString() },
          ...state.activityLog,
        ],
      };
    case "ADD_CONTACT":
      return { ...state, contacts: [...state.contacts, action.contact] };
    case "ADD_ACTIVITY":
      return { ...state, activityLog: [action.entry, ...state.activityLog] };
    case "MARK_NOTIFICATION_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) => n.id === action.id ? { ...n, read: true } : n),
      };
    case "MARK_ALL_NOTIFICATIONS_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      };
    case "IMPORT_PIPELINE_TARGETS":
      return {
        ...state,
        pipelineTargets: [...state.pipelineTargets, ...action.targets],
        activityLog: [
          { id: `a${Date.now()}`, userId: currentUser.id, action: "imported", target: `${action.targets.length} pipeline targets`, timestamp: new Date().toISOString() },
          ...state.activityLog,
        ],
      };
    case "SUBMIT_SPEAKER_FORM": {
      const { submission } = action;
      const email = submission.email.trim().toLowerCase();
      const existing = state.pipelineTargets.find(
        (t) => t.type === "speaker" && t.email?.toLowerCase() === email
      );

      const formFields = {
        organization: submission.name.trim(),
        contactName: [submission.jobTitle.trim(), submission.company.trim()].filter(Boolean).join(", "),
        email: submission.email.trim(),
        phoneOffice: submission.phoneOffice.trim(),
        phoneMobile: submission.phoneMobile.trim(),
        presentationApproval: submission.presentationApproval,
        videoApproval: submission.videoApproval,
        bio: submission.bio.trim(),
        photoDataUrl: submission.photoDataUrl,
        formSubmittedAt: new Date().toISOString(),
      };

      // Every speaker who fills the form is also a project contact — find
      // or create their Contact record by email so the two stay in sync.
      const existingContact = state.contacts.find((c) => c.email.toLowerCase() === email);
      const contactFields: Omit<Contact, "id"> = {
        name: submission.name.trim(),
        organization: submission.company.trim(),
        role: submission.jobTitle.trim(),
        email: submission.email.trim(),
        phone: submission.phoneMobile.trim() || submission.phoneOffice.trim(),
        source: "speaker_form",
      };
      const contacts = existingContact
        ? state.contacts.map((c) => c.id === existingContact.id ? { ...c, ...contactFields } : c)
        : [...state.contacts, { id: `c${Date.now()}`, ...contactFields }];

      if (existing) {
        return {
          ...state,
          pipelineTargets: state.pipelineTargets.map((t) =>
            t.id === existing.id
              ? { ...t, ...formFields, stage: t.stage === "confirmed" ? t.stage : "form_completed" }
              : t
          ),
          contacts,
          activityLog: [
            { id: `a${Date.now()}`, userId: "system", action: "form_submitted", target: `${submission.name} completed the speaker form`, timestamp: new Date().toISOString() },
            ...state.activityLog,
          ],
        };
      }

      const newTarget: PipelineTarget = {
        id: `p${Date.now()}`,
        type: "speaker",
        category: "corporate",
        stage: "form_completed",
        assignee: "u1",
        notes: "",
        eventId: "evt1",
        ...formFields,
      };

      return {
        ...state,
        pipelineTargets: [...state.pipelineTargets, newTarget],
        contacts,
        activityLog: [
          { id: `a${Date.now()}`, userId: "system", action: "form_submitted", target: `${submission.name} registered as a new speaker`, timestamp: new Date().toISOString() },
          ...state.activityLog,
        ],
      };
    }
    default:
      return state;
  }
}

const initialState: State = {
  missions: initialMissions,
  pipelineTargets: initialTargets,
  contacts: initialContacts,
  activityLog: initialActivity,
  notifications: initialNotifications,
};

const STORAGE_KEY = "cemac_app_state";

const StoreCtx = createContext<{ state: State; dispatch: Dispatch<Action> } | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const hydrated = useRef(false);

  // Hydrate from localStorage once on mount (client-only, avoids SSR mismatch)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        dispatch({ type: "HYDRATE", state: JSON.parse(stored) });
      }
    } catch {}
    hydrated.current = true;
  }, []);

  // Persist on every change, and sync across tabs/windows of the same browser
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          dispatch({ type: "HYDRATE", state: JSON.parse(e.newValue) });
        } catch {}
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return <StoreCtx.Provider value={{ state, dispatch }}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
