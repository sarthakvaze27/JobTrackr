import mongoose, { Schema } from 'mongoose';
import type IJob from '../types/job.types.js';

const jobSchema = new Schema<IJob>(
    {
        userId:{
            type:Schema.ObjectId,
            ref:'User',
            required:true
        },
        company:{
            type:String,
            required:true
        },
        role:{
            type:String,
            required:true
        },
        salaryRange:{
            type:String
        },
        locationType:{
            type:String,
            enum:['Remote','Hybrid','Onsite'],
            default:'Remote'
        },
        status:{
            type:String,
            enum:['Wishlist','Applied','Interviewing','Offer','Rejected'],
            default:'Wishlist'
        },
        notes:{
          type:String
        },
    },
    {timestamps:true}
)

const Job = mongoose.model<IJob>(
    'Job',
    jobSchema
)

export default Job;