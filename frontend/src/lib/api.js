const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function saveSession(sessionId, data) {
  try {
    const res = await fetch(`${API_URL}/api/sessions/${sessionId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function loadSession(sessionId) {
  try {
    const res = await fetch(`${API_URL}/api/sessions/${sessionId}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export function generateSessionId() {
  return `cvpilot_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
