import mongoose, { Schema } from 'mongoose';
const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    year: {
        type: Number,
    },
    skills: [String],
}, { timestamps: true } // Fixed: Changed 'timestamp' to 'timestamps'
);
const User = mongoose.model('User', UserSchema);
export default User;
//# sourceMappingURL=user.js.map