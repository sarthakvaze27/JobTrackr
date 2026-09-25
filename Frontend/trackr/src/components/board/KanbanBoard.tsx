import JobCard from "./JobCard";
import type { Job } from "./TableView";

interface KanbanBoardProps {
  jobs: Job[];
  onDelete: (id: string) => void;
  onEdit: (job: Job) => void;
}

const logoColors: Record<string, string> = {
  Netflix: "#e50914", Linear: "#5e6ad2", Vercel: "#000000",
  Stripe: "#635bff", GitHub: "#333333", Notion: "#059669",
  Figma: "#a259ff", PlanetScale: "#0c4a6e", Railway: "#0f172a",
  Airbnb: "#ff5a5f", Shopify: "#96bf48",
};

const COLUMNS: { status: Job["status"]; color: string }[] = [
  { status: "Wishlist",     color: "#6366f1" },
  { status: "Applied",      color: "#3b82f6" },
  { status: "Interviewing", color: "#f59e0b" },
  { status: "Offer",        color: "#10b981" },
  { status: "Rejected",     color: "#ef4444" },
];


export default function KanbanBoard({ jobs, onDelete, onEdit }: KanbanBoardProps) {
  return (
    <div className="Main-kanban">
      {COLUMNS.map(({ status, color }) => {
        const colJobs = jobs.filter(j => j.status === status);
        return (
          <div className="k-box" key={status}>
            <div className="k-header">
              <div className="k-left">
                <div className="k-dot" style={{ background: color }} />
                <div className="k-name">{status}</div>
              </div>
              <div className="k-right">
                <h3>{colJobs.length}</h3>
              </div>
            </div>
            <div className="k-cards-container" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {colJobs.map(job => (
                <JobCard
                  key={job.id}
                  company={job.company}
                  role={job.role}
                  location={job.location}
                  time={job.date}
                  salary={job.salary}
                  logoColor={logoColors[job.company] ?? "#3b82f6"}
                  onDelete={() => onDelete(job.id)}
                  onEdit={() => onEdit(job)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
