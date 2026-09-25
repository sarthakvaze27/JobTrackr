import { useState } from 'react';
import type { Job } from './TableView';
import type { AppInterview } from '../../api/interview';
import InterviewModal from '../modals/InterviewModal';

interface InterviewsViewProps {
  jobs:            Job[];
  interviews:      AppInterview[];
  loading:         boolean;
  onAdd:           (data: Omit<AppInterview, 'id' | 'day' | 'month'>) => Promise<void>;
  onEdit:          (id: string, data: Partial<AppInterview>) => Promise<void>;
  onDelete:        (id: string) => Promise<void>;
}

// ── helpers ───────────────────────────────────────────────────────────────────
function getLocationClass(loc: string) {
  if (loc === 'Remote') return 'tag tb';
  if (loc === 'Hybrid') return 'tag ta';
  return 'tag tgr';
}

function getRoundClass(round: string) {
  if (round === 'Final Round') return 'tag tg';
  if (round === 'Technical')   return 'tag tb';
  if (round === 'HR Round')    return 'tag ta';
  return 'tag tgr';
}

// ── component ─────────────────────────────────────────────────────────────────
export default function InterviewsView({
  jobs, interviews, loading, onAdd, onEdit, onDelete,
}: InterviewsViewProps) {
  const [showModal, setShowModal]         = useState(false);
  const [editingItem, setEditingItem]     = useState<AppInterview | null>(null);

  // Derived stats — calculated from real data
  const upcoming         = interviews.filter(i => i.status === 'Upcoming').length;
  const completed        = interviews.filter(i => i.status === 'Completed').length;
  const awaitingFeedback = interviews.filter(i => i.status === 'Awaiting Feedback').length;

  async function handleMarkComplete(interview: AppInterview) {
    await onEdit(interview.id, { status: 'Completed' });
  }

  async function handleDelete(id: string) {
    await onDelete(id);
  }

  return (
    <div className="iv-wrapper">

      {/* ── Page header ── */}
      <div className="page-hdr">
        <div>
          <div className="page-hdr-title">Interviews</div>
          <div className="page-hdr-sub">
            {upcoming} upcoming · {completed} completed
          </div>
        </div>
        <button className="schedule-btn" onClick={() => setShowModal(true)}>
          <i className="ti ti-plus" /> Schedule
        </button>
      </div>

      {/* ── 3 stat boxes — now real numbers ── */}
      <div className="int-grid">
        <div className="int-stat">
          <div className="int-stat-num">{upcoming}</div>
          <div className="int-stat-lbl">Upcoming</div>
        </div>
        <div className="int-stat">
          <div className="int-stat-num">{completed}</div>
          <div className="int-stat-lbl">Completed</div>
        </div>
        <div className="int-stat">
          <div className="int-stat-num">{awaitingFeedback}</div>
          <div className="int-stat-lbl">Awaiting Feedback</div>
        </div>
      </div>

      {/* ── Interview list ── */}
      {loading && <div className="empty-msg">Loading interviews...</div>}

      {!loading && interviews.length === 0 && (
        <div className="empty-msg">No interviews yet. Hit Schedule to add one!</div>
      )}

      {!loading && interviews.length > 0 && (
        <div className="int-list">
          {interviews.map(interview => (
            <div className="int-item" key={interview.id}>

              {/* Left: date box */}
              <div className="int-date-box">
                <div className="int-date-day">{interview.day}</div>
                <div className="int-date-mon">{interview.month}</div>
              </div>

              {/* Middle: info */}
              <div className="int-body">
                <div className="int-company">{interview.company}</div>
                <div className="int-role">{interview.role}</div>
                <div className="int-meta">
                  <span className={getLocationClass(interview.location)}>{interview.location}</span>
                  {interview.timeRange && (
                    <span className="int-time">
                      <i className="ti ti-clock" style={{ fontSize: '10px' }} /> {interview.timeRange}
                    </span>
                  )}
                  <span className={getRoundClass(interview.roundLabel)}>{interview.roundLabel}</span>
                  {interview.status !== 'Upcoming' && (
                    <span className="tag tgr">{interview.status}</span>
                  )}
                </div>
                {interview.notes && (
                  <div className="doc-linked" style={{ marginTop: '4px' }}>
                    <i className="ti ti-note" style={{ fontSize: '10px' }} /> {interview.notes}
                  </div>
                )}
              </div>

              {/* Right: actions */}
              <div className="int-actions">
                <button className="int-btn" onClick={() => setEditingItem(interview)}>
                  Edit
                </button>
                {interview.status === 'Upcoming' && (
                  <button className="int-btn" onClick={() => handleMarkComplete(interview)}>
                    Mark Done
                  </button>
                )}
                {interview.meetingLink && (
                  <a
                    className="int-btn primary"
                    href={interview.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="ti ti-video" /> Join
                  </a>
                )}
                <button
                  className="int-btn"
                  style={{ color: 'var(--red-text)' }}
                  onClick={() => handleDelete(interview.id)}
                >
                  <i className="ti ti-trash" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ── Schedule modal ── */}
      {showModal && (
        <InterviewModal
          jobs={jobs}
          onClose={() => setShowModal(false)}
          onSave={onAdd}
        />
      )}

      {/* ── Edit modal ── */}
      {editingItem && (
        <InterviewModal
          jobs={jobs}
          initialData={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={data => onEdit(editingItem.id, data)}
        />
      )}

    </div>
  );
}
