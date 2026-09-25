import { Document } from 'mongoose';

export default interface Iuser extends Document {
    name: string;
    email: string;
    year?: number;   
    password:string;    // Optional, since it wasn't marked 'required: true' in your schema
    skills: string[];
    createdAt: Date;     // Added automatically by Mongoose because of { timestamps: true }
    updatedAt: Date;     // Added automatically by Mongoose because of { timestamps: true }
}