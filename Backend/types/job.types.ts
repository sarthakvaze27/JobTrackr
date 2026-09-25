import { Document,Types } from 'mongoose';

export default interface IJob extends Document {
    userId:Types.ObjectId;
    company:string;
    role:string;
    salaryRange?:string;
    locationType:'Remote' | 'Hybrid' | 'Onsite';
    status:'Wishlist'|'Applied'|'Interviewing'|'Offer'|'Rejected';
    notes?:string;
    createdAt:Date;
    updatedAt:Date;
}
