import { useState, useEffect } from 'react';
import {
  getInterviews, createInterview, updateInterview, deleteInterview,
  type AppInterview,
} from '../api/interview';

export function useInterviews() {
  const [interviews, setInterviews] = useState<AppInterview[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  const token = localStorage.getItem('token') ?? '';

  useEffect(() => {
    getInterviews(token)
      .then(setInterviews)
      .catch(err => setError(err instanceof Error ? err.message : 'Error'))
      .finally(() => setLoading(false));
  }, []);

  async function addInterview(data: Omit<AppInterview, 'id' | 'day' | 'month'>) {
    const created = await createInterview(data, token);
    // Keep list sorted by date
    setInterviews(prev => [...prev, created].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    ));
  }

  async function editInterview(id: string, data: Partial<AppInterview>) {
    const updated = await updateInterview(id, data, token);
    setInterviews(prev => prev.map(i => i.id === id ? updated : i));
  }

  async function removeInterview(id: string) {
    await deleteInterview(id, token);
    setInterviews(prev => prev.filter(i => i.id !== id));
  }

  return { interviews, loading, error, addInterview, editInterview, removeInterview };
}