import { useState } from "react";
import type { Job } from "./TableView";

interface SavedJobsProps {
  jobs: Job[];
}

const logoColors: Record<string, string> = {
  Netflix: "#e50914", Linear: "#5e6ad2", Vercel: "#000000",
  Stripe: "#635bff", GitHub: "#333333", Notion: "#059669",
  Figma: "#a259ff", PlanetScale: "#0c4a6e", Railway: "#0f172a",
  Airbnb: "#ff5a5f", Shopify: "#96bf48",
};

function getLocationClass(location: string) {
  if (location === "Remote") return "tag tb";
  if (location === "Hybrid") return "tag ta";
  return "tag tgr";
}

export default function SavedJobs({ jobs }: SavedJobsProps) {
  const [search, setSearch] = useState("");

  const wishlistJobs = jobs
    .filter(j => j.status === "Wishlist")
    .filter(j =>
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.role.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="iv-wrapper">
      <div className="page-hdr">
        <div>
          <div className="page-hdr-title">Saved Jobs</div>
          <div className="page-hdr-sub">
            {wishlistJobs.length} job{wishlistJobs.length !== 1 ? "s" : ""} bookmarked to apply later
          </div>
        </div>
        {/* Optional search box — reuse the same input style you already have */}
        <div className="search-box">
  <i className="ti ti-search" />
  <input
    placeholder="Search saved jobs…"
    value={search}
    onChange={e => setSearch(e.target.value)}
  />
</div>
      </div>

      {wishlistJobs.length === 0 ? (
        <div className="empty-msg">
          {search ? "No jobs match your search." : "No saved jobs yet. Add some from the board!"}
        </div>
      ) : (
        <div className="saved-job-grid">
          {wishlistJobs.map(job => (
            <div className="saved-job-card" key={job.id}>

              {/* Top row: logo + company + role */}
              <div className="doc-card-top">
                <div
                  className="company-logo"
                  style={{ backgroundColor: logoColors[job.company] ?? "#3b82f6" }}
                >
                  <span>{job.company.charAt(0)}</span>
                </div>
                <div className="doc-card-info">
                  <div className="doc-name">{job.company}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{job.role}</div>
                </div>
              </div>

              {/* Tags row */}
              <div className="int-meta" style={{ marginTop: "10px" }}>
                <span className={getLocationClass(job.location)}>{job.location}</span>
                {job.salary && (
                  <span className="tag tgr">{job.salary}</span>
                )}
                <span style={{ fontSize: "11px", color: "var(--text-muted)", marginLeft: "auto" }}>
                  {job.date}
                </span>
              </div>

              {/* Notes (if any) */}
              {job.notes && (
                <div className="doc-linked" style={{ marginTop: "8px" }}>
                  <i className="ti ti-note" style={{ fontSize: "10px" }} />
                  {job.notes}
                </div>
              )}

              {/* Footer: Apply button */}
              <div className="doc-card-footer" style={{ marginTop: "12px" }}>
                <button className="int-btn primary">
                  <i className="ti ti-send" /> Apply Now
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
