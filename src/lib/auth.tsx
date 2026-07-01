"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import type { User, UserRole } from "./types";

type Account = { email: string; password: string; user: User };

const SEED_ACCOUNTS: Account[] = [
  {
    email: "lionel.malonga.pro@gmail.com",
    password: "Admin2026!",
    user: { id: "u1", name: "Lionel Malonga", email: "lionel.malonga.pro@gmail.com", role: "admin", organization: "Local" },
  },
  {
    email: "erica@ecn.com",
    password: "Erica2026!",
    user: { id: "u2", name: "Erica Oghoghorie", email: "erica@ecn.com", role: "team", organization: "ECN" },
  },
];

const SESSION_KEY = "cemac_session";
const ACCOUNTS_KEY = "cemac_accounts";
const PRESENCE_KEY = "cemac_presence";
const ONLINE_WINDOW_MS = 25_000;
const HEARTBEAT_MS = 8_000;

function genPassword(): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnpqrstuvwxyz";
  const digits = "23456789";
  const pick = (s: string) => s[Math.floor(Math.random() * s.length)];
  let pwd = pick(upper) + pick(lower) + pick(digits);
  for (let i = 0; i < 7; i++) pwd += pick(upper + lower + digits);
  return pwd + "!";
}

type InviteResult = { user: User; password: string };

type AuthContext = {
  user: User | null;
  accounts: User[];
  isLoading: boolean;
  login: (email: string, password: string) => string | null;
  logout: () => void;
  inviteMember: (input: { name: string; email: string; role: UserRole; organization: string }) => InviteResult | string;
  onlineUserIds: Set<string>;
};

const AuthCtx = createContext<AuthContext | null>(null);

function readPresence(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(PRESENCE_KEY) || "{}");
  } catch {
    return {};
  }
}

function computeOnline(presence: Record<string, number>): Set<string> {
  const now = Date.now();
  const online = new Set<string>();
  for (const [id, ts] of Object.entries(presence)) {
    if (now - ts < ONLINE_WINDOW_MS) online.add(id);
  }
  return online;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<Account[]>(SEED_ACCOUNTS);
  const [isLoading, setIsLoading] = useState(true);
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load accounts + session on mount
  useEffect(() => {
    let loadedAccounts = SEED_ACCOUNTS;
    try {
      const storedAccounts = localStorage.getItem(ACCOUNTS_KEY);
      if (storedAccounts) loadedAccounts = JSON.parse(storedAccounts);
      else localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(SEED_ACCOUNTS));
    } catch {}
    setAccounts(loadedAccounts);

    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const account = loadedAccounts.find((a) => a.user.id === parsed.id);
        if (account) setUser(account.user);
      }
    } catch {}
    setIsLoading(false);
  }, []);

  // Presence: heartbeat for self + listen for cross-tab updates
  useEffect(() => {
    function tick() {
      const presence = readPresence();
      setOnlineUserIds(computeOnline(presence));
    }

    if (user) {
      const beat = () => {
        const presence = readPresence();
        presence[user.id] = Date.now();
        localStorage.setItem(PRESENCE_KEY, JSON.stringify(presence));
        setOnlineUserIds(computeOnline(presence));
      };
      beat();
      heartbeatRef.current = setInterval(beat, HEARTBEAT_MS);
      document.addEventListener("visibilitychange", beat);

      const onStorage = (e: StorageEvent) => {
        if (e.key === PRESENCE_KEY) tick();
      };
      window.addEventListener("storage", onStorage);

      const pollInterval = setInterval(tick, 5_000);

      return () => {
        if (heartbeatRef.current) clearInterval(heartbeatRef.current);
        document.removeEventListener("visibilitychange", beat);
        window.removeEventListener("storage", onStorage);
        clearInterval(pollInterval);
      };
    } else {
      tick();
    }
  }, [user]);

  const login = useCallback((email: string, password: string): string | null => {
    const account = accounts.find(
      (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    );
    if (!account) return "Incorrect email or password";
    setUser(account.user);
    localStorage.setItem(SESSION_KEY, JSON.stringify({ id: account.user.id }));
    return null;
  }, [accounts]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  }, []);

  const inviteMember = useCallback(
    ({ name, email, role, organization }: { name: string; email: string; role: UserRole; organization: string }): InviteResult | string => {
      if (accounts.some((a) => a.email.toLowerCase() === email.toLowerCase())) {
        return "This email is already invited";
      }
      const password = genPassword();
      const newUser: User = {
        id: `u${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        role,
        organization: organization.trim(),
      };
      const newAccount: Account = { email: email.trim(), password, user: newUser };
      const updated = [...accounts, newAccount];
      setAccounts(updated);
      try {
        localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(updated));
      } catch {}
      return { user: newUser, password };
    },
    [accounts]
  );

  return (
    <AuthCtx.Provider
      value={{
        user,
        accounts: accounts.map((a) => a.user),
        isLoading,
        login,
        logout,
        inviteMember,
        onlineUserIds,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
