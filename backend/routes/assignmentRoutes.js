import express from "express";
import multer from "multer";
import authMiddleware from "../middleware/authMiddleware.js";
import Assignment from "../models/Assignment.js";

const router = express.Router();

// ✅ Configure Multer for Memory Storage (Stores in MongoDB)
const storage = multer.memoryStorage(); // ✅ Store file in memory buffer
const upload = multer({ storage });

// ✅ 1️⃣ Upload Assignment (Admin/Lecturer Only)
router.post("/:moduleId/assignments", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "admin" && req.user.role !== "lecturer") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const { title, description, dueDate } = req.body;
        const moduleId = req.params.moduleId;

        const assignment = new Assignment({
            moduleId,
            title,
            description,
            dueDate,
            uploadedBy: req.user._id
        });

        await assignment.save();
        res.status(201).json({ message: "Assignment uploaded successfully!", assignment });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

// ✅ 2️⃣ Submit Assignment (Student Only) - Store File in MongoDB
router.post("/:assignmentId/submit", authMiddleware, upload.single("answerFile"), async (req, res) => {
    try {
        console.log("Request Reached Submit Route"); // ✅ Debugging

        if (!req.user || !req.user._id) {
            return res.status(403).json({ message: "Unauthorized: User ID missing" });
        }

        console.log("Decoded JWT:", req.user); // ✅ Debugging User Info

        const assignment = await Assignment.findById(req.params.assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const submission = {
            studentId: req.user._id,
            answerFile: {
                data: req.file.buffer, // ✅ Store file as binary data in MongoDB
                contentType: req.file.mimetype, // ✅ Store file type
                filename: req.file.originalname // ✅ Store original filename
            },
            submittedAt: new Date(),
        };

        assignment.submissions.push(submission);

        console.log("Updated Assignment Before Save:", assignment); // ✅ Debugging

        const savedAssignment = await assignment.save(); // Save to DB

        console.log("Updated Assignment After Save:", savedAssignment); // ✅ Debugging

        return res.status(201).json({ message: "Assignment submitted successfully!", submission });

    } catch (error) {
        console.error("Submission Error:", error);
        return res.status(500).json({ message: "Server Error", error });
    }
});

// ✅ 3️⃣ Get All Assignments for a Module
router.get("/:moduleId/assignments", authMiddleware, async (req, res) => {
    try {
        const assignments = await Assignment.find({ moduleId: req.params.moduleId }).populate("submissions.studentId", "name email");
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

// ✅ 4️⃣ Get Submissions for an Assignment (Retrieve File)
router.get("/:assignmentId/submissions", authMiddleware, async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.assignmentId).populate("submissions.studentId", "name email");
        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        res.json(assignment.submissions);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

// ✅ Get Submitted File (Preview or Download)
router.get("/:assignmentId/submissions/:submissionId/download", authMiddleware, async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        const submission = assignment.submissions.id(req.params.submissionId);
        if (!submission) {
            return res.status(404).json({ message: "Submission not found" });
        }

        // ✅ Set correct headers for file preview
        res.set("Content-Type", submission.answerFile.contentType);
        res.set("Content-Disposition", `inline; filename="${submission.answerFile.filename}"`); // "inline" for preview, "attachment" for download

        res.send(submission.answerFile.data); // ✅ Send file data
    } catch (error) {
        console.error("File Retrieval Error:", error);
        res.status(500).json({ message: "Server Error", error });
    }
});

// ✅ Allow Resubmission Before Due Date
router.post("/:assignmentId/resubmit", authMiddleware, upload.single("answerFile"), async (req, res) => {
    try {
        console.log("Request Reached Resubmission Route"); // ✅ Debugging

        if (!req.user || !req.user._id) {
            return res.status(403).json({ message: "Unauthorized: User ID missing" });
        }

        const assignment = await Assignment.findById(req.params.assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // ✅ Ensure resubmission is before the due date
        const currentDate = new Date();
        if (currentDate > new Date(assignment.dueDate)) {
            return res.status(403).json({ message: "Resubmission deadline has passed" });
        }

        // ✅ Remove old submission (if exists)
        assignment.submissions = assignment.submissions.filter(sub => sub.studentId.toString() !== req.user._id.toString());

        // ✅ Add new submission
        const newSubmission = {
            studentId: req.user._id,
            answerFile: {
                data: req.file.buffer,
                contentType: req.file.mimetype,
                filename: req.file.originalname
            },
            submittedAt: new Date(),
        };

        assignment.submissions.push(newSubmission);
        await assignment.save();

        return res.status(201).json({ message: "Resubmitted successfully!", submission: newSubmission });

    } catch (error) {
        console.error("Resubmission Error:", error);
        return res.status(500).json({ message: "Server Error", error });
    }
});



export default router;
