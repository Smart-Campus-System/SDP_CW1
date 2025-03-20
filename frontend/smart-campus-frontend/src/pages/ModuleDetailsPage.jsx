import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ModuleDetailsPage.css';
import { ToastContainer, toast } from 'react-toastify';
import './ReactToastify.css';

const ModuleDetailsPage = () => {
    const { moduleId } = useParams();
    const [module, setModule] = useState(null);
    const [error, setError] = useState('');
    const [role, setRole] = useState(null); // ✅ Set to `null` initially
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [newAssignment, setNewAssignment] = useState({ title: '', description: '', dueDate: '' });
    const [assignmentFile, setAssignmentFile] = useState(null);
    const [answerFile, setAnswerFile] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // ✅ Fetch user role from backend
    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError("Unauthorized: Please log in.");
                    return;
                }

                const response = await axios.get("http://localhost:5000/api/auth/profile", {
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                setRole(response.data.role); // ✅ Store role from backend
            } catch (err) {
                setError('Failed to fetch user profile.');
            }
        };

        fetchUserRole();
    }, []);

    // ✅ Fetch module details
    useEffect(() => {
        const fetchModuleDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/modules/${moduleId}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                setModule(response.data);
            } catch (err) {
                setError('Failed to fetch module details.');
            }
        };

        if (token) fetchModuleDetails();
    }, [moduleId, token]);

    // ✅ Toggle Assignment Upload Modal
    const toggleModal = () => {
        setShowModal(!showModal);
    };

    // ✅ Handle Assignment Upload
    const handleUploadAssignment = async () => {
        if (!assignmentFile) {
            toast.success("Please select a file for the assignment.");
            return;
        }

        const formData = new FormData();
        formData.append("title", newAssignment.title);
        formData.append("description", newAssignment.description);
        formData.append("dueDate", newAssignment.dueDate);
        formData.append("file", assignmentFile); // Add file to the FormData

        try {
            const response = await axios.post(
                `http://localhost:5000/api/assignments/${moduleId}/assignments`,
                formData,
                {
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
                }
            );

            toast.success('Assignment uploaded successfully!');
            setModule({ ...module, assignments: [...module.assignments, response.data.assignment] });
            setNewAssignment({ title: '', description: '', dueDate: '' });
            setAssignmentFile(null);
            setShowModal(false);
        } catch (error) {
            toast.error('Failed to upload assignment.');
        }
    };

    // ✅ Handle Answer Submission (For Students)
    const handleSubmitAnswer = async (assignmentId) => {
        if (!answerFile) {
            alert("Please select a file to upload.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("answerFile", answerFile);

            const response = await axios.post(
                `http://localhost:5000/api/assignments/${assignmentId}/submit`,
                formData,
                {
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
                }
            );

            toast.success('Assignment submitted successfully!');
            setAnswerFile(null);
        } catch (error) {
            toast.error('Failed to submit assignment.');
        }
    };

    // ✅ Handle Resubmission of Assignment (For Students)
    const handleResubmitAssignment = async (assignmentId) => {
        if (!answerFile) {
            alert("Please select a file to resubmit.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("answerFile", answerFile);

            const response = await axios.post(
                `http://localhost:5000/api/assignments/${assignmentId}/resubmit`,
                formData,
                {
                    headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
                }
            );

            toast.success("Assignment resubmitted successfully!");
            setAnswerFile(null);
        } catch (error) {
            toast.error("Failed to resubmit assignment.");
        }
    };

    // ✅ Handle Download Submission (For Admins/Lecturers)
    const handleDownloadSubmission = async (assignmentId, submissionId, fileName) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/assignments/${assignmentId}/submissions/${submissionId}/download`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    responseType: "blob", // ✅ Important: Receive file as binary
                }
            );

            // ✅ Create a URL for file download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName; // ✅ Keep original filename
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            alert("Failed to download submission.");
        }
    };

    // ✅ Pie Chart Colors
    const COLORS = ['#00C49F', '#FFBB28'];

    return (
        <div className="module-details-container">
            {error && <p className="error">{error}</p>}
            <h2>{module?.title}</h2>

            {/* Display Assignments */}
            <h3>Assignments</h3>
            <ul>
                {module?.assignments?.map((assignment) => (
                    <li key={assignment._id} className="assignment-card">
                        <h4>{assignment.title}</h4>
                        <p>{assignment.description}</p>
                        <p>Due Date: {new Date(assignment.dueDate).toLocaleDateString()}</p>

                        {/* Admin/Lecturer can download student submissions */}
                        {role === "admin" || role === "lecturer" ? (
                            <div>
                                <button
                                    onClick={() =>
                                        handleDownloadSubmission(
                                            assignment._id,
                                            assignment.submission._id,
                                            assignment.submission.answerFile.filename
                                        )
                                    }
                                >
                                    Download Submission
                                </button>
                            </div>
                        ) : (
                            // Student functionalities
                            <div>
                                <input type="file" onChange={(e) => setAnswerFile(e.target.files[0])} />
                                <button onClick={() => handleSubmitAnswer(assignment._id)}>Submit Answer</button>
                                <button onClick={() => handleResubmitAssignment(assignment._id)}>
                                    Resubmit Answer
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            {/* Show Upload Button for Admins & Lecturers */}
            {(role === 'admin' || role === 'lecturer') && (
                <div className="upload-section">
                    <button className="upload-btn" onClick={toggleModal}>Upload Assignment</button>
                </div>
            )}

            {/* Modal for Uploading Assignments */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Upload New Assignment</h3>
                        <input type="text" placeholder="Title" value={newAssignment.title} onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })} />
                        <textarea placeholder="Description" value={newAssignment.description} onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })} />
                        <input type="date" value={newAssignment.dueDate} onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })} />
                        <input type="file" onChange={(e) => setAssignmentFile(e.target.files[0])} />
                        <div className="modal-buttons">
                            <button className="add-btn" onClick={handleUploadAssignment}>Upload</button>
                            <button className="close-btn" onClick={toggleModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover />
        </div>
    );
};

export default ModuleDetailsPage;
