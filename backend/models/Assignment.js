import mongoose from 'mongoose';

// Schema for handling student submissions (including the uploaded file)
const SubmissionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  answerFile: { 
    data: Buffer,  // Store file as binary data
    contentType: String,  // Store file mime type (e.g., application/pdf)
    filename: String,  // Store original filename
  },
  submittedAt: { type: Date, default: Date.now }
});

// Main Assignment Schema
const AssignmentSchema = new mongoose.Schema({
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  answerFile: {  // Store the uploaded file as binary data
    data: Buffer,
    contentType: String,
    filename: String,
  },
  submissions: [SubmissionSchema],  // Nested submissions for students' answers
});

const Assignment = mongoose.model('Assignment', AssignmentSchema);
export default Assignment;
