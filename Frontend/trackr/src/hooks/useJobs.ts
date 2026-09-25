import { useEffect, useState } from "react";
import { createJob, deleteJob, getJobs, updateJob } from "../api/axios";
import type { Job } from "../components/board/TableView";

function getAuthToken() {
  return localStorage.getItem("token") ?? "";
}

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = getAuthToken();

  useEffect(() => {
    async function loadJobs() {
      if (!token) {
        setError("Login or register first so the app has an auth token.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const data = await getJobs(token);
        setJobs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load jobs");
      } finally {
        setLoading(false);
      }
    }

    void loadJobs();
  }, [token]);

  async function addJob(job: Partial<Job>) {
    const created = await createJob(job, token);
    setJobs((prev) => [created, ...prev]);
  }

  async function editJob(id: string, job: Partial<Job>) {
    const updated = await updateJob(id, job, token);
    setJobs((prev) => prev.map((item) => (item.id === id ? updated : item)));
  }

  async function removeJob(id: string) {
    await deleteJob(id, token);
    setJobs((prev) => prev.filter((job) => job.id !== id));
  }

  return { jobs, loading, error, addJob, editJob, removeJob };
 }
