import { defineEventHandler, getCookie } from "h3";

const API_BASE = process.env.API_BASE_URL

export default defineEventHandler(async (event) => {
  const token = getCookie(event, "auth_token");

  if (!token) {
    return { error: "Non authentifié" };
  }

  const response = await fetch(`${API_BASE}/auth/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken: token }),
  });

  if (!response.ok) {
    return { error: "Token invalide" };
  }

  return await response.json();
});
