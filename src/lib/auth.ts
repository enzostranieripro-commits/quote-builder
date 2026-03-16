// src/lib/auth.ts
const AUTH_KEY = "dp_auth_v1";
const SESSION_KEY = "dp_session_v1";

export interface AuthConfig {
  email: string;
  passwordHash: string;
  configured: boolean;
}

function hash(str: string): string {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h) ^ str.charCodeAt(i);
    h = h >>> 0;
  }
  return h.toString(36) + "_" + str.length.toString(36);
}

function load<T>(key: string, fb: T): T {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fb; }
  catch { return fb; }
}

export function getAuthConfig(): AuthConfig {
  return load<AuthConfig>(AUTH_KEY, { email: "", passwordHash: "", configured: false });
}

export function setupAuth(email: string, password: string): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify({
    email: email.toLowerCase().trim(),
    passwordHash: hash(password),
    configured: true,
  }));
}

export function changePassword(oldPwd: string, newPwd: string): boolean {
  const cfg = getAuthConfig();
  if (hash(oldPwd) !== cfg.passwordHash) return false;
  setupAuth(cfg.email, newPwd);
  return true;
}

export function login(email: string, password: string): boolean {
  const cfg = getAuthConfig();
  if (!cfg.configured) return false;
  if (email.toLowerCase().trim() !== cfg.email) return false;
  if (hash(password) !== cfg.passwordHash) return false;
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email: cfg.email, loginAt: new Date().toISOString() }));
  return true;
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function isAuthenticated(): boolean {
  try { return !!localStorage.getItem(SESSION_KEY); }
  catch { return false; }
}
