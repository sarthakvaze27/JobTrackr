interface SidebarProps {
  currentNav:          string;
  setCurrentNav:       (nav: string) => void;
  jobCount:            number;
  upcomingInterviews:  number;
  userName:            string;
  jobTitle:            string;
  huntLabel:           string;
}

const Sidebar = ({ currentNav, setCurrentNav, jobCount, upcomingInterviews, userName, jobTitle, huntLabel }: SidebarProps) => {
  const initials = userName.trim().split(/\s+/).slice(0, 2).map(part => part[0]?.toUpperCase() ?? "").join("") || "JT";
  return (
    <div className="sidebar">

      <div className="logo-area">
        <div className="logo-row">
          <div className="logo-box"><i className="ti ti-briefcase" /></div>
          <div className="logo-name">JobTrackr</div>
          <div className="logo-sub">{huntLabel}</div>
        </div>
      </div>

      <div className="nav">
        <div className="nav-grp">Main</div>

        <div className={`ni ${currentNav === 'board' ? 'active' : ''}`} onClick={() => setCurrentNav('board')}>
          <i className="ti ti-layout-kanban" /> Board
          {jobCount > 0 && <span className="badge">{jobCount}</span>}
        </div>

        <div className={`ni ${currentNav === 'interviews' ? 'active' : ''}`} onClick={() => setCurrentNav('interviews')}>
          <i className="ti ti-calendar" /> Interviews
          {upcomingInterviews > 0 && <span className="badge">{upcomingInterviews}</span>}
        </div>

        <div className={`ni ${currentNav === 'analytics' ? 'active' : ''}`} onClick={() => setCurrentNav('analytics')}>
          <i className="ti ti-list" /> Analytics
        </div>

        <div className="nav-grp">Tools</div>

        <div className={`ni ${currentNav === 'documents' ? 'active' : ''}`} onClick={() => setCurrentNav('documents')}>
          <i className="ti ti-file" /> Documents
        </div>

        <div className={`ni ${currentNav === 'saved' ? 'active' : ''}`} onClick={() => setCurrentNav('saved')}>
          <i className="ti ti-star" /> Saved Jobs
        </div>

        <div className="nav-grp">Account</div>

        <div className={`ni ${currentNav === 'settings' ? 'active' : ''}`} onClick={() => setCurrentNav('settings')}>
          <i className="ti ti-settings" /> Settings
        </div>
      </div>

      <div className="sb-foot">
        <div className="usr">
          <div className="av">{initials}</div>
          <div>
            <div className="uname">{userName}</div>
            <div className="urole">{jobTitle || "Job seeker"}</div>
          </div>
          <i className="ti ti-dots-vertical usr-more" />
        </div>
      </div>

    </div>
  );
};

export default Sidebar;
