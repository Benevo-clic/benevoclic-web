import { defineEventHandler, readBody, setCookie } from "h3";

const API_BASE = process.env.API_BASE_URL


export default defineEventHandler(async (event) => {
  const { idToken } = await readBody(event);

  const response = await fetch(`${API_BASE}/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    return { error: "Invalid token" };
  }

  const user = await response.json();

  setCookie(event, "auth_token", idToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  });

  return { user };
});
