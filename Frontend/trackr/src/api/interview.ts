const BASE = "http://localhost:8080/api";

export type RoundLabel   = 'Intro Call' | 'Technical' | 'HR Round' | 'Final Round' | 'Other';
export type InterviewStatus = 'Upcoming' | 'Completed' | 'Awaiting Feedback' | 'Cancelled';

export interface AppInterview {
  id:          string;
  jobId?:      string;
  company:     string;
  role:        string;
  date:        string;       // ISO string stored, formatted for display in the hook
  day:         string;       // "28"
  month:       string;       // "MAY"
  timeRange:   string;
  location:    'Remote' | 'Hybrid' | 'Onsite';
  roundLabel:  RoundLabel;
  status:      InterviewStatus;
  meetingLink?: string;
  notes?:      string;
}

// Shape coming from MongoDB
type ApiInterview = {
  _id:         string;
  jobId?:      string;
  company:     string;
  role:        string;
  date:        string;
  timeRange:   string;
  location:    AppInterview['location'];
  roundLabel:  RoundLabel;
  status:      InterviewStatus;
  meetingLink?: string;
  notes?:      string;
};

function toAppInterview(i: ApiInterview): AppInterview {
  const d = new Date(i.date);
  return {
    id:          i._id,
    jobId:       i.jobId,
    company:     i.company,
    role:        i.role,
    date:        i.date,
    day:         String(d.getDate()).padStart(2, '0'),
    month:       d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
    timeRange:   i.timeRange,
    location:    i.location,
    roundLabel:  i.roundLabel,
    status:      i.status,
    meetingLink: i.meetingLink,
    notes:       i.notes,
  };
}

export async function getInterviews(token: string): Promise<AppInterview[]> {
  const res = await fetch(`${BASE}/interviews`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch interviews');
  const data = (await res.json()) as ApiInterview[];
  return data.map(toAppInterview);
}

export async function createInterview(
  data: Omit<AppInterview, 'id' | 'day' | 'month'>,
  token: string
): Promise<AppInterview> {
  const res = await fetch(`${BASE}/interviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create interview');
  return toAppInterview((await res.json()) as ApiInterview);
}

export async function updateInterview(
  id: string,
  data: Partial<AppInterview>,
  token: string
): Promise<AppInterview> {
  const res = await fetch(`${BASE}/interviews/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update interview');
  return toAppInterview((await res.json()) as ApiInterview);
}

export async function deleteInterview(id: string, token: string): Promise<void> {
  const res = await fetch(`${BASE}/interviews/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete interview');
}