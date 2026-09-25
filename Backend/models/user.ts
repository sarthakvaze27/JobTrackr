import mongoose, { Schema } from 'mongoose';
import type Iuser from '../types/user.types.js';

const UserSchema = new Schema<Iuser>(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password:{
            type:String,
            required:true,
            select:false,
        },
        year: {
            type: Number,
        },
        skills: [String],
    },
    { timestamps: true } // Fixed: Changed 'timestamp' to 'timestamps'
);

const User = mongoose.model<Iuser>(
    'User',
    UserSchema
);

export default User;

