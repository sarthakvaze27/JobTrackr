import { useState } from "react";

export interface Job{
    id:string;
    company:string;
    role:string;
    status: "Wishlist" | "Applied" | "Interviewing" | "Offer" | "Rejected";
  salary: string;
  location: "Remote" | "Hybrid" | "Onsite";
  date: string;
    createdAt?: string;
  notes?: string;
}

interface TableViewProps{
    jobs:Job[];
    onDelete:(id:string) => void;
    onEdit:(job:Job) => void;
}

function getStatusClass(status:string){
    if (status === "Wishlist")     return "tag tgr";
  if (status === "Applied")      return "tag tb";
  if (status === "Interviewing") return "tag ta";
  if (status === "Offer")        return "tag tg";
  if (status === "Rejected")     return "tag tr";
  return "tag tgr";
}
function getLocationClass(location: string) {
  if (location === "Remote") return "tag tb";
  if (location === "Hybrid") return "tag ta";
  if (location === "Onsite") return "tag ta";
  return "tag tgr";
}
function getSortIcon(col: string, activeCol: string, dir: number) {
  if (col !== activeCol)  return "ti ti-selector sort-icon";
  if (dir === 1)          return "ti ti-chevron-up sort-icon";
  return                         "ti ti-chevron-down sort-icon";
}

export default function TableView({jobs,onDelete,onEdit}:TableViewProps) {
    const [sortCol,setSortCol] = useState("date");
    const [sortDir,setSortDir] = useState(1);

    function handleSort(col:string)
    {
        if(col == sortCol)
        {
            setSortDir(sortDir === 1 ? -1:1);
        }
        else {
            setSortCol(col);
            setSortDir(1);
        }
    }
 // Sort a copy of jobs — never mutate the original array
  const sorted = [...jobs].sort((a: any, b: any) => {
    const valA = a[sortCol] ?? "";
    const valB = b[sortCol] ?? "";
    if (valA < valB) return -sortDir;
    if (valA > valB) return  sortDir;
    return 0;
  });

  return(
    <div className="table-view">
        <table className="tbl">
            <thead>
                <tr>
                    <th onClick={() => handleSort("company")}>
                            Company <span className={getSortIcon("company",sortCol,sortDir)} />
                    </th>
                    <th onClick={() => handleSort("role")}>
                        Role <span className={getSortIcon("role",sortCol,sortDir)} />
                    </th>
                    <th onClick={() => handleSort("status")}>
                            STATUS<span className={getSortIcon("status",sortCol,sortDir)} />
                    </th>
                    <th onClick={() => handleSort("salary")}>
                      SALARY <span className={getSortIcon("salary",sortCol,sortDir)} />
                    </th>
                    <th onClick={() => handleSort("location")}>
                            LOCATION <span className={getSortIcon("location",sortCol,sortDir)} />
                    </th>
                    <th onClick={() => handleSort("date")}>
                        DATE<span className={getSortIcon("date",sortCol,sortDir)} />
                    </th>
                    <th/>
                </tr>
            </thead>
            <tbody>
                {sorted.map((job) => (
                    <tr key={job.id}>
                        <td>
                            <div className="td-company">
                                <div className="clogo">{job.company[0]}</div>
                                {job.company}
                            </div>
                        </td>
                        <td>{job.role}</td>
                        <td>
                            <span className={getStatusClass(job.status)}>{job.status}</span>
                        </td>
                        <td>{job.salary || "-"}</td>
                        <td>
                <span className={getLocationClass(job.location)}>{job.location}</span>
              </td>
              <td>{job.date}</td>
               <td>
                <i
                  className="ti ti-pencil td-edit"
                  title="Edit"
                  onClick={() => onEdit(job)}
                />
                <i
                  className="ti ti-trash td-del"
                  title="Delete"
                  onClick={() => onDelete(job.id)}
                />
              </td>
                    </tr>
                ))}
            </tbody>
        </table>
        {sorted.length === 0 && (
            <div className="empty-msg">No application found.</div>
        )}
    </div>
  )
}
