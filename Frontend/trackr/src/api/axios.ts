const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

import type { Job } from "../components/board/TableView";

type ApiJob = {
  _id?: string;
  id?: string;
  company: string;
  role: string;
  status: Job["status"];
  salary?: string;
  salaryRange?: string;
  location?: Job["location"];
  locationType?: Job["location"];
  notes?: string;
  createdAt?: string;
};

type AuthResponse = {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
};

async function readError(res: Response, fallback: string) {
  try {
    const data = (await res.json()) as { message?: string };
    return data.message ?? fallback;
  } catch {
    return fallback;
  }
}

function toJob(job: ApiJob): Job {
  return {
    id: job.id ?? job._id ?? "",
    company: job.company,
    role: job.role,
    status: job.status,
    salary: job.salary ?? job.salaryRange ?? "",
    location: job.location ?? job.locationType ?? "Remote",
    date: job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "",
    createdAt: job.createdAt,
    notes: job.notes ?? "",
  };
}

function toApiJob(job: Partial<Job>) {
  return {
    company: job.company,
    role: job.role,
    status: job.status,
    salaryRange: job.salary,
    locationType: job.location,
    notes: job.notes,
  };
}

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error(await readError(res, "Unable to login"));

  return (await res.json()) as AuthResponse;
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  year?: number;
  skills?: string[];
}) {
  const res = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error(await readError(res, "Unable to register"));

  return (await res.json()) as AuthResponse;
}

export async function getJobs(token: string) {
  const res = await fetch(`${BASE}/jobs`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Unable to fetch jobs");

  const data = (await res.json()) as ApiJob[];
  return data.map(toJob);
}

export async function createJob(data: Partial<Job>, token: string) {
  const res = await fetch(`${BASE}/jobs`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(toApiJob(data)),
  });

  if (!res.ok) throw new Error("Unable to create job");

  const job = (await res.json()) as ApiJob;
  return toJob(job);
}

export async function updateJob(id: string, data: Partial<Job>, token: string) {
  const res = await fetch(`${BASE}/jobs/${id}`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(toApiJob(data)),
  });

  if (!res.ok) throw new Error("Unable to update job");

  const job = (await res.json()) as ApiJob;
  return toJob(job);
}

export async function deleteJob(id: string, token: string) {
  const res = await fetch(`${BASE}/jobs/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Unable to delete job");
}

