import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    answerFile: { 
        data: Buffer, // Store file as binary data
        contentType: String, // Store file type
        filename: String // Store original filename
    },
    submittedAt: { type: Date, default: Date.now }
});

const AssignmentSchema = new mongoose.Schema({
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    submissions: [SubmissionSchema] // Store student submissions inside MongoDB
});

const Assignment = mongoose.model('Assignment', AssignmentSchema);
export default Assignment;
