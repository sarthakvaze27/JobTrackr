const BASE = "http://localhost:8080/api";

export interface Profile {
  id: string;
  name: string;
  email: string;
  year: number | "";
  skills: string[];
}

async function requestProfile(path: string, token: string, method = "GET", profile?: Omit<Profile, "id">) {
  const response = await fetch(`${BASE}/auth/${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(profile ? { "Content-Type": "application/json" } : {}),
    },
    ...(profile ? { body: JSON.stringify(profile) } : {}),
  });
  const data = await response.json().catch(() => ({})) as Profile & { message?: string };
  if (!response.ok) throw new Error(data.message || "Unable to save profile");
  return data;
}

export function getProfile(token: string) {
  return requestProfile("me", token);
}

export function updateProfile(token: string, profile: Omit<Profile, "id">) {
  return requestProfile("me", token, "PUT", profile);
}
