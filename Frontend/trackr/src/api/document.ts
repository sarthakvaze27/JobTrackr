const BASE = "http://localhost:8080/api";

export interface AppDocument {
  id: string;
  name: string;
  type: "Resume" | "Cover Letter" | "Portfolio" | "Other";
  fileType: "PDF" | "DOCX" | "Other";
  linkedJobId?: string;
  date: string;
  size: string;
  url: string;
}

// Shape coming from MongoDB
type ApiDocument = {
  _id: string;
  name: string;
  type: AppDocument["type"];
  fileType: AppDocument["fileType"];
  linkedJobId?: string;
  size: string;
  url: string;
  createdAt: string;
};

function toAppDocument(doc: ApiDocument): AppDocument {
  return {
    id:          doc._id,
    name:        doc.name,
    type:        doc.type,
    fileType:    doc.fileType,
    linkedJobId: doc.linkedJobId,
    size:        doc.size,
    url:         doc.url.startsWith("http") ? doc.url : `http://localhost:8080${doc.url}`,
    date:        new Date(doc.createdAt).toLocaleDateString("en-US", {
                   year: "numeric", month: "short", day: "numeric"
                 }),
  };
}

export async function getDocuments(token: string): Promise<AppDocument[]> {
  const res = await fetch(`${BASE}/documents`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch documents");
  const data = (await res.json()) as ApiDocument[];
  return data.map(toAppDocument);
}

// FormData because we're sending a real file
export async function uploadDocument(
  file: File,
  type: AppDocument["type"],
  linkedJobId: string | undefined,
  token: string
): Promise<AppDocument> {
  const form = new FormData();
  form.append("file", file);
  form.append("type", type);
  if (linkedJobId) form.append("linkedJobId", linkedJobId);

  const res = await fetch(`${BASE}/documents`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    // DO NOT set Content-Type — browser sets it with the boundary automatically
    body: form,
  });
  if (!res.ok) throw new Error("Failed to upload document");
  const doc = (await res.json()) as ApiDocument;
  return toAppDocument(doc);
}

export async function deleteDocument(id: string, token: string): Promise<void> {
  const res = await fetch(`${BASE}/documents/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete document");
}
