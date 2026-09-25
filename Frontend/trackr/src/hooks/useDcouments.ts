import { useState, useEffect } from "react";
import { getDocuments, uploadDocument, deleteDocument, type AppDocument } from "../api/document";

export function useDocuments() {
  const [documents, setDocuments] = useState<AppDocument[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);

  const token = localStorage.getItem("token") ?? "";

  useEffect(() => {
    getDocuments(token)
      .then(setDocuments)
      .catch(err => setError(err instanceof Error ? err.message : "Error"))
      .finally(() => setLoading(false));
  }, []);

  async function addDocument(
    file: File,
    type: AppDocument["type"],
    linkedJobId?: string
  ) {
    const doc = await uploadDocument(file, type, linkedJobId, token);
    setDocuments(prev => [doc, ...prev]);
  }

  async function removeDocument(id: string) {
    await deleteDocument(id, token);
    setDocuments(prev => prev.filter(d => d.id !== id));
  }

  return { documents, loading, error, addDocument, removeDocument };
}