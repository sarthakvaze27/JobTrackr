interface JobCardProps{
    company:string;
    role:string;
    location:string;
    time:string;
    salary:string;
    logoColor:string;
    onDelete: () => void;
    onEdit: () => void;
}
 
 export default function JobCard({ company, role, location, time, salary, logoColor,onDelete,onEdit}: JobCardProps) {
   return (
     <div className="Main-card">
        <div className="card-top">
            <div className="company-logo" style={{ backgroundColor: logoColor }}><span>{company.charAt(0)}</span></div>
            <div className="company-name">{company}</div>
            <div className="card-actions">
                <button className="card-btn edit-btn" onClick={onEdit}>
                    <i className="ti ti-pencil"></i>
                </button>
                <button className="card-btn delete-btn" onClick={onDelete}>
                    <i className="ti ti-trash"></i>
                </button>
            </div>
        </div>
        <div className="card-mid">
            <div className="mid-text">{role}
            </div>
            <div className="mid-details">
                <div className="mid-location"><span>{location}</span></div>
                <div className="mid-time"><span>{time}</span></div>
            </div>
        </div>
        <div className="card-last">
            <div className="last-salary">{salary}</div>
            <div className="last-icon"><span>i</span></div>
        </div>
     </div>
   )
 }
 
