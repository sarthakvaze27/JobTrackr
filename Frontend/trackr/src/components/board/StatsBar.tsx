import type { AppInterview } from '../../api/interview';
import type { Job } from './TableView';

interface StatsBarProps {
  jobs: Job[];
  interviews: AppInterview[];
}

function startOfWeek(date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  return start;
}

export default function StatsBar({ jobs, interviews }: StatsBarProps) {
  const appliedJobs = jobs.filter(job => job.status !== 'Wishlist');
  const activeJobs = jobs.filter(job => job.status === 'Applied' || job.status === 'Interviewing');
  const responded = jobs.filter(job => job.status === 'Interviewing' || job.status === 'Offer' || job.status === 'Rejected').length;
  const offers = jobs.filter(job => job.status === 'Offer').length;
  const upcomingInterviews = interviews.filter(interview => interview.status === 'Upcoming').length;
  const weeklyApplications = appliedJobs.filter(job => {
    const date = job.createdAt ? new Date(job.createdAt) : new Date(job.date);
    return !Number.isNaN(date.getTime()) && date >= startOfWeek(new Date());
  }).length;
  const responseRate = appliedJobs.length ? Math.round((responded / appliedJobs.length) * 100) : 0;

  const stats = [
    { label: 'Total Applied', value: appliedJobs.length, detail: `${weeklyApplications} this week`, icon: 'ti-trending-up' },
    { label: 'In Progress', value: activeJobs.length, detail: 'Applied or interviewing', icon: 'ti-activity' },
    { label: 'Interviews', value: interviews.length, detail: `${upcomingInterviews} upcoming`, icon: 'ti-calendar' },
    { label: 'Offers', value: offers, detail: 'Received', icon: 'ti-award' },
    { label: 'Response Rate', value: `${responseRate}%`, detail: `${responded} of ${appliedJobs.length} applied`, icon: 'ti-chart-line' },
  ];

  return (
    <div className="Main">
      {stats.map(stat => <div className="box" key={stat.label}>
        <div className="box-text">{stat.label}</div>
        <div className="box-number">{stat.value}</div>
        <div className="box-last"><i className={`ti ${stat.icon}`} /><div className="box-last-text">{stat.detail}</div></div>
      </div>)}
    </div>
  );
}
