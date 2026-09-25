import { useState, type FormEvent } from 'react';
import type { Job } from '../board/TableView';
import type { AppInterview, RoundLabel } from '../../api/interview';

interface InterviewModalProps {
  jobs:         Job[];
  onClose:      () => void;
  onSave:       (data: Omit<AppInterview, 'id' | 'day' | 'month'>) => Promise<void>;
  initialData?: AppInterview;   // pass when editing
}

const ROUNDS: RoundLabel[]    = ['Intro Call', 'Technical', 'HR Round', 'Final Round', 'Other'];
const LOCATIONS               = ['Remote', 'Hybrid', 'Onsite'] as const;

export default function InterviewModal({ jobs, onClose, onSave, initialData }: InterviewModalProps) {
  const [form, setForm] = useState({
    company:     initialData?.company     ?? '',
    role:        initialData?.role        ?? '',
    jobId:       initialData?.jobId       ?? '',
    // date input needs "YYYY-MM-DDThh:mm" format
    date:        initialData?.date
                   ? new Date(initialData.date).toISOString().slice(0, 16)
                   : '',
    timeRange:   initialData?.timeRange   ?? '',
    location:    initialData?.location    ?? 'Remote' as typeof LOCATIONS[number],
    roundLabel:  initialData?.roundLabel  ?? 'Intro Call' as RoundLabel,
    meetingLink: initialData?.meetingLink ?? '',
    notes:       initialData?.notes       ?? '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState('');

  // When user picks a linked job, auto-fill company + role
  function handleJobPick(jobId: string) {
    const job = jobs.find(j => j.id === jobId);
    setForm(f => ({
      ...f,
      jobId,
      company: job ? job.company : f.company,
      role:    job ? job.role    : f.role,
    }));
  }

  // Auto-build timeRange from the datetime-local input
  // e.g. "2026-05-28T10:00" → day set, timeRange left for user to type
  function handleDateChange(val: string) {
    setForm(f => ({ ...f, date: val }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.date) { setError('Please pick a date and time.'); return; }
    try {
      setSubmitting(true);
      setError('');
      await onSave({
        company:     form.company,
        role:        form.role,
        jobId:       form.jobId || undefined,
        date:        new Date(form.date).toISOString(),
        timeRange:   form.timeRange,
        location:    form.location,
        roundLabel:  form.roundLabel,
        status:      'Upcoming',
        meetingLink: form.meetingLink,
        notes:       form.notes,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <h2>{initialData ? 'Edit Interview' : 'Schedule Interview'}</h2>
          <button onClick={onClose}><i className="ti ti-x" /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">

          {/* Link to a job — auto-fills company + role */}
          <div className="form-group">
            <label>Link to Job (Optional)</label>
            <select value={form.jobId} onChange={e => handleJobPick(e.target.value)}>
              <option value="">— Pick a job or fill manually —</option>
              {jobs.map(j => (
                <option key={j.id} value={j.id}>{j.company} — {j.role}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Company</label>
              <input
                required
                placeholder="e.g. Notion"
                value={form.company}
                onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <input
                required
                placeholder="e.g. Senior React Engineer"
                value={form.role}
                onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date & Time</label>
              <input
                type="datetime-local"
                required
                value={form.date}
                onChange={e => handleDateChange(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Time Range (display)</label>
              <input
                placeholder="e.g. 10:00 AM – 11:30 AM"
                value={form.timeRange}
                onChange={e => setForm(f => ({ ...f, timeRange: e.target.value }))}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Round</label>
              <select
                value={form.roundLabel}
                onChange={e => setForm(f => ({ ...f, roundLabel: e.target.value as RoundLabel }))}
              >
                {ROUNDS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Location</label>
              <select
                value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value as typeof LOCATIONS[number] }))}
              >
                {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Meeting Link (Optional)</label>
            <input
              type="url"
              placeholder="https://meet.google.com/..."
              value={form.meetingLink}
              onChange={e => setForm(f => ({ ...f, meetingLink: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label>Notes (Optional)</label>
            <textarea
              rows={2}
              placeholder="Prep tips, recruiter name, topics to cover..."
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit" disabled={submitting}>
              {submitting ? 'Saving...' : initialData ? 'Update' : 'Schedule'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
