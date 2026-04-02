const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const MEDIA_BASE = import.meta.env.VITE_MEDIA_URL || "http://localhost:8000/media";

export function getToken() {
  return localStorage.getItem("identix_token");
}

export function setToken(token) {
  localStorage.setItem("identix_token", token);
}

export function clearToken() {
  localStorage.removeItem("identix_token");
}

export function decodeToken(token) {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const raw = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = raw + "===".slice((raw.length + 3) % 4);
    const payload = JSON.parse(atob(padded));
    return payload;
  } catch {
    return null;
  }
}

export function getRole() {
  const payload = decodeToken(getToken());
  return payload?.role || null;
}

export function getUser() {
  const payload = decodeToken(getToken());
  return payload || null;
}

export function mediaUrl(path) {
  if (!path) return "";
  const normalized = path.replace(/\\/g, "/");
  // If the path already includes 'data/', remove it to match the /media mount point
  const cleanPath = normalized.replace(/^data\//, "").replace(/^\/data\//, "");
  return `${MEDIA_BASE}/${cleanPath}`;
}

export async function apiRequest(path, options = {}) {
  const token = getToken();
  const headers = options.headers ? { ...options.headers } : {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const isForm = options.isForm === true;
  const body = options.body;

  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method || "GET",
    headers: isForm ? headers : { ...headers, "Content-Type": "application/json" },
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined
  });

  const contentType = res.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await res.json() : await res.text();

  if (!res.ok) {
    const message = payload?.detail || payload?.message || "Request failed";
    throw new Error(message);
  }

  return payload;
}

export async function loginUser(credentials) {
  const data = await apiRequest("/auth/login", { method: "POST", body: credentials });
  return data;
}
