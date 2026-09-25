import { Document,Types } from 'mongoose';

export type RoundLabel = 'Intro Call' | 'Technical' | 'HR Round' | 'Final Round' | 'Other';
export type InterviewStatus = 'Upcoming' | 'Completed' | 'Awaiting Feedback' | 'Cancelled';

export default interface IInterview extends Document {
     userId:      Types.ObjectId;
  jobId?:      Types.ObjectId;   // optional link to a job
  company:     string;
  role:        string;
  date:        Date;             // full datetime, e.g. 2026-05-28T10:00:00
  timeRange:   string;           // e.g. "10:00 AM – 11:30 AM"
  location:    'Remote' | 'Hybrid' | 'Onsite';
  roundLabel:  RoundLabel;
  status:      InterviewStatus;
  meetingLink?: string;
  notes?:      string;
  createdAt:   Date;
  updatedAt:   Date;
}