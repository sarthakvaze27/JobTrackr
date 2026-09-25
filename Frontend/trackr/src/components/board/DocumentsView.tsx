import { useState } from "react";
import type { Job } from "./TableView";
import type { AppDocument } from "../../api/document";

interface DocumentsViewProps {
  documents: AppDocument[];   // now comes from useDocuments hook in App.tsx
  jobs: Job[];
  onDelete: (id: string) => void;
  loading: boolean;
}

function getTypeClass(type: AppDocument["type"]) {
  if (type === "Resume")       return "tag tg";
  if (type === "Cover Letter") return "tag tb";
  if (type === "Portfolio")    return "tag ta";
  return "tag tgr";
}

function getFileIcon(fileType: AppDocument["fileType"]) {
  if (fileType === "PDF")  return "ti ti-file-type-pdf";
  if (fileType === "DOCX") return "ti ti-file-type-doc";
  return "ti ti-file";
}

const FILTERS = ["All", "Resume", "Cover Letter", "Portfolio", "Other"] as const;

export default function DocumentsView({ documents, jobs, onDelete, loading }: DocumentsViewProps) {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filtered = activeFilter === "All"
    ? documents
    : documents.filter(d => d.type === activeFilter);

  function getLinkedJob(linkedJobId?: string) {
    if (!linkedJobId) return null;
    return jobs.find(j => j.id === linkedJobId) ?? null;
  }

  function handleDownload(doc: AppDocument) {
    const a = window.document.createElement("a");
    a.href = doc.url;
    a.download = doc.name;
    a.click();
  }

  return (
    <div className="iv-wrapper">

      <div className="page-hdr">
        <div>
          <div className="page-hdr-title">Documents</div>
          <div className="page-hdr-sub">{documents.length} files stored</div>
        </div>
      </div>

      <div className="doc-filters">
        {FILTERS.map(f => (
          <button
            key={f}
            className={`doc-filter-btn ${activeFilter === f ? "active" : ""}`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {loading && <div className="empty-msg">Loading documents...</div>}

      {!loading && filtered.length === 0 && (
        <div className="empty-msg">No documents found. Upload one with the Add button.</div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="doc-grid">
          {filtered.map(doc => {
            const linkedJob = getLinkedJob(doc.linkedJobId);
            return (
              <div className="doc-card" key={doc.id}>

                <div className="doc-card-top">
                  <i className={getFileIcon(doc.fileType) + " doc-file-icon"} />
                  <div className="doc-card-info">
                    <div className="doc-name">{doc.name}</div>
                    <div className="doc-meta">
                      <span className={getTypeClass(doc.type)}>{doc.type}</span>
                      <span className="doc-size">{doc.size}</span>
                    </div>
                  </div>
                </div>

                {linkedJob && (
                  <div className="doc-linked">
                    <i className="ti ti-briefcase" style={{ fontSize: "10px" }} />
                    Linked to {linkedJob.company} — {linkedJob.role}
                  </div>
                )}

                <div className="doc-card-footer">
                  <span className="doc-date">{doc.date}</span>
                  <div className="doc-actions">
                    <button className="int-btn" onClick={() => handleDownload(doc)}>
                      <i className="ti ti-download" /> Download
                    </button>
                    <button
                      className="int-btn"
                      style={{ color: "var(--red-text)" }}
                      onClick={() => onDelete(doc.id)}
                    >
                      <i className="ti ti-trash" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
