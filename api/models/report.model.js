import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    reason: {
        type: String,
        required: true,
    },
    details: {
        type: String,
    },
    reportedUser: {
        type: mongoose.Types.ObjectId,
        require: true,
        ref: 'User',
    },
    reportingUser: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User',
    }
}, { timestamps: true });

const Report = mongoose.model('Report', reportSchema);

export default Report;