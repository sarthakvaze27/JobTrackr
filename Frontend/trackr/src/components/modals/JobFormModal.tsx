import { useState, type FormEvent } from "react";
import type { Job } from "../board/TableView";

interface JobFormModalProps {
  onClose: () => void;
  onSave: (job: Partial<Job>) => Promise<void>;
  initialJob?: Job;
}

export default function JobFormModal({ onClose, onSave, initialJob }: JobFormModalProps) {
  const [formData, setFormData] = useState({
    company: initialJob?.company ?? "",
    role: initialJob?.role ?? "",
    location: initialJob?.location ?? "Remote" as Job["location"],
    salary: initialJob?.salary ?? "",
    status: initialJob?.status ?? "Wishlist" as Job["status"],
    notes: initialJob?.notes ?? ""
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await onSave(formData);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header">
          <h2>{initialJob ? "Edit Job" : "Add New Job"}</h2>
          <button onClick={onClose}><i className="ti ti-x"></i></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-row">
              <div className="form-group">
            <label>Company Name</label>
            <input 
              type="text" 
              placeholder="e.g. Google" 
              required
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <input 
              type="text" 
              placeholder="e.g. Frontend Engineer" 
              required
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            />
          </div>

          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Location Type</label>
              <select 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value as Job["location"]})}
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Onsite">Onsite</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Salary (Optional)</label>
              <input 
                type="text" 
                placeholder="e.g. $120k" 
                value={formData.salary}
                onChange={(e) => setFormData({...formData, salary: e.target.value})}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select 
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value as Job["status"]})}
            >
              <option value="Wishlist">Wishlist</option>
              <option value="Applied">Applied</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="form-group">
            <label>Notes (Optional)</label>
            <textarea 
              placeholder="Drop interview links, recruiter names, or context here..."
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit" disabled={submitting}>
              {submitting ? "Saving..." : initialJob ? "Update Job" : "Save Job"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
