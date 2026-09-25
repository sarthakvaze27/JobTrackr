import type { Job } from "./TableView";
import type { AppInterview } from "../../api/interview";

interface AnalyticsViewProps {
  jobs: Job[];
  interviews: AppInterview[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function pct(part: number, total: number) {
  return total === 0 ? 0 : Math.round((part / total) * 100);
}

// Map each status to its bar colour (mirrors the Kanban dots)
const STATUS_COLORS: Record<Job["status"], string> = {
  Wishlist:     "#6366f1",
  Applied:      "#3b82f6",
  Interviewing: "#f59e0b",
  Offer:        "#10b981",
  Rejected:     "#ef4444",
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function startOfWeek(date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  return start;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function AnalyticsView({ jobs, interviews }: AnalyticsViewProps) {
  const appliedJobs  = jobs.filter(j => j.status !== "Wishlist");
  const total        = appliedJobs.length;
  const offers       = jobs.filter(j => j.status === "Offer").length;
  const responded    = jobs.filter(j => ["Interviewing", "Offer", "Rejected"].includes(j.status)).length;
  const responseRate = pct(responded, total);
  const offerRate    = pct(offers, total);
  const weekStart    = startOfWeek(new Date());
  const weekData     = Array(7).fill(0) as number[];
  appliedJobs.forEach(job => {
    const date = job.createdAt ? new Date(job.createdAt) : new Date(job.date);
    if (Number.isNaN(date.getTime()) || date < weekStart) return;
    weekData[(date.getDay() + 6) % 7] += 1;
  });
  const weekMax      = Math.max(...weekData, 1);
  const todayIndex   = (new Date().getDay() + 6) % 7;
  const upcomingInterviews = interviews.filter(i => i.status === "Upcoming").length;

  const STATUSES: Job["status"][] = ["Wishlist", "Applied", "Interviewing", "Offer", "Rejected"];

  return (
    <div className="iv-wrapper">

      {/* ── Page header ── */}
      <div className="page-hdr">
        <div>
          <div className="page-hdr-title">Analytics</div>
          <div className="page-hdr-sub">All time · {total} applications</div>
        </div>
      </div>

      {/* ── 4 KPI cards ── */}
      <div className="an-grid">

        <div className="an-card">
          <div className="an-num">{total}</div>
          <div className="an-lbl">Total Applied</div>
          <div className="an-delta">{weekData.reduce((sum, count) => sum + count, 0)} applied this week</div>
        </div>

        <div className="an-card">
          <div className="an-num">{responseRate}%</div>
          <div className="an-lbl">Response Rate</div>
          <div className="an-delta">{responded} applications received a response</div>
        </div>

        <div className="an-card">
          <div className="an-num">{offers}</div>
          <div className="an-lbl">Offers Received</div>
          <div className="an-delta">{offerRate}% of applications</div>
        </div>

        <div className="an-card">
          <div className="an-num">{interviews.length}</div>
          <div className="an-lbl">Interviews Scheduled</div>
          <div className="an-delta">{upcomingInterviews} upcoming</div>
        </div>

      </div>

      {/* ── Two-column panels ── */}
      <div className="an-row">

        {/* Left: Applications by Status bar chart */}
        <div className="an-panel">
          <div className="an-panel-title">Applications by Status</div>

          {STATUSES.map(status => {
            const count = jobs.filter(j => j.status === status).length;
            const width = pct(count, total);
            return (
              <div className="bar-row" key={status}>
                <span className="bar-label">{status}</span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${width}%`,
                      background: STATUS_COLORS[status],
                      transition: "width .4s ease",
                    }}
                  />
                </div>
                <span className="bar-val">{count}</span>
              </div>
            );
          })}
        </div>

        {/* Right: Applications per Day (this week) */}
        <div className="an-panel">
          <div className="an-panel-title">Applications per Day (this week)</div>
          <div className="week-grid">
            {DAYS.map((day, i) => {
              const val    = weekData[i];
              const height = Math.round((val / weekMax) * 100);
              const isToday = i === todayIndex;
              return (
                <div className="week-col" key={day}>
                  <div className="week-bar-wrap">
                    <div
                      className="week-bar"
                      style={{
                        height: height > 0 ? `${height}%` : "4px",
                        background: isToday ? "var(--accent)" : val > 0 ? "var(--accent-bg)" : "var(--bg-raised)",
                        width: "100%",
                        transition: "height .4s ease",
                      }}
                    />
                  </div>
                  <div className="week-lbl">{day}</div>
                  <div className="week-val">{val}</div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ── Location breakdown ── */}
      <div className="an-row" style={{ marginTop: "10px" }}>

        <div className="an-panel">
          <div className="an-panel-title">By Location</div>
          {(["Remote", "Hybrid", "Onsite"] as Job["location"][]).map(loc => {
            const count = jobs.filter(j => j.location === loc).length;
            const width = pct(count, total);
            const color = loc === "Remote" ? "#3b82f6" : loc === "Hybrid" ? "#f59e0b" : "#a78bfa";
            return (
              <div className="bar-row" key={loc}>
                <span className="bar-label">{loc}</span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ width: `${width}%`, background: color, transition: "width .4s ease" }}
                  />
                </div>
                <span className="bar-val">{count}</span>
              </div>
            );
          })}
        </div>

        {/* Pipeline funnel summary */}
        <div className="an-panel">
          <div className="an-panel-title">Pipeline Funnel</div>
          {STATUSES.map(status => {
            const count = jobs.filter(j => j.status === status).length;
            const maxCount = Math.max(...STATUSES.map(s => jobs.filter(j => j.status === s).length), 1);
            const width = pct(count, maxCount);
            return (
              <div className="bar-row" key={status} style={{ alignItems: "center" }}>
                <span className="bar-label" style={{ fontSize: "9px" }}>{status}</span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${width}%`,
                      background: `${STATUS_COLORS[status]}55`,
                      borderRight: count > 0 ? `3px solid ${STATUS_COLORS[status]}` : "none",
                      transition: "width .4s ease",
                    }}
                  />
                </div>
                <span className="bar-val">{count}</span>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}

       
