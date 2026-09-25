import { useState, useRef, type FormEvent } from "react";
import type { Job } from "../board/TableView";
import type { AppDocument } from "../../api/document";

interface DocumentModalProps {
  jobs: Job[];
  onClose: () => void;
  onSave: (file: File, type: AppDocument["type"], linkedJobId?: string) => Promise<void>;
}

const DOC_TYPES: AppDocument["type"][] = ["Resume", "Cover Letter", "Portfolio", "Other"];

export default function DocumentModal({ jobs, onClose, onSave }: DocumentModalProps) {
  const [type, setType]             = useState<AppDocument["type"]>("Resume");
  const [linkedJobId, setLinkedJobId] = useState<string>("");
  const [file, setFile]             = useState<File | null>(null);
  const [dragging, setDragging]     = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    const ext = f.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "doc", "docx"].includes(ext ?? "")) {
      setError("Only PDF, DOC, or DOCX files are allowed.");
      return;
    }
    setError("");
    setFile(f);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file) { setError("Please select a file."); return; }

    try {
      setSubmitting(true);
      await onSave(file, type, linkedJobId || undefined);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <h2>Upload Document</h2>
          <button onClick={onClose}><i className="ti ti-x" /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">

          {/* ── Drop zone ── */}
          <div
            className={`drop-zone ${dragging ? "dragging" : ""} ${file ? "has-file" : ""}`}
            onClick={() => inputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => {
              e.preventDefault();
              setDragging(false);
              const f = e.dataTransfer.files[0];
              if (f) handleFile(f);
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              style={{ display: "none" }}
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
            {file ? (
              <>
                <i className="ti ti-file-check" style={{ fontSize: "28px", color: "var(--accent)" }} />
                <div style={{ fontSize: "13px", marginTop: "6px" }}>{file.name}</div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  {(file.size / 1024).toFixed(0)} KB · click to change
                </div>
              </>
            ) : (
              <>
                <i className="ti ti-cloud-upload" style={{ fontSize: "28px", color: "var(--text-muted)" }} />
                <div style={{ fontSize: "13px", marginTop: "6px" }}>
                  Drop a file here or <span style={{ color: "var(--accent)" }}>browse</span>
                </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>PDF, DOC, or DOCX · max 10 MB</div>
              </>
            )}
          </div>

          {error && <div className="auth-error">{error}</div>}

          {/* ── Document type ── */}
          <div className="form-group">
            <label>Document Type</label>
            <select value={type} onChange={e => setType(e.target.value as AppDocument["type"])}>
              {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* ── Link to a job (optional) ── */}
          <div className="form-group">
            <label>Link to Job (Optional)</label>
            <select value={linkedJobId} onChange={e => setLinkedJobId(e.target.value)}>
              <option value="">— None —</option>
              {jobs.map(j => (
                <option key={j.id} value={j.id}>{j.company} — {j.role}</option>
              ))}
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit" disabled={submitting || !file}>
              {submitting ? "Uploading..." : "Upload"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
