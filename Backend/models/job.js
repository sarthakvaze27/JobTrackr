import mongoose, { Schema } from 'mongoose';
const jobSchema = new Schema({
    userId: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    company: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    salaryRange: {
        type: String
    },
    locationType: {
        type: String,
        enum: ['Remote', 'Hybrid', 'Onsite'],
        default: 'Remote'
    },
    status: {
        type: String,
        enum: ['Wishlist', 'Applied', 'Interviewing', 'Offer', 'Rejected'],
        default: 'Wishlist'
    },
    notes: {
        type: String
    },
}, { timestamps: true });
const Job = mongoose.model('Job', jobSchema);
export default Job;
//# sourceMappingURL=job.js.map