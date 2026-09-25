import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema(
  {
    userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User',     required: true },
    jobId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Job',      default: null  },
    company:     { type: String, required: true },
    role:        { type: String, required: true },
    date:        { type: Date,   required: true },
    timeRange:   { type: String, required: true },
    location:    { type: String, enum: ['Remote', 'Hybrid', 'Onsite'],                          default: 'Remote'    },
    roundLabel:  { type: String, enum: ['Intro Call', 'Technical', 'HR Round', 'Final Round', 'Other'], default: 'Intro Call' },
    status:      { type: String, enum: ['Upcoming', 'Completed', 'Awaiting Feedback', 'Cancelled'], default: 'Upcoming' },
    meetingLink: { type: String, default: '' },
    notes:       { type: String, default: '' },
  },
  { timestamps: true }
);

const Interview = mongoose.model('Interview', interviewSchema);
export default Interview;
