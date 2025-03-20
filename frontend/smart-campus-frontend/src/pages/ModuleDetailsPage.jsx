import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import './ModuleDetailsPage.css';

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

    const handleUploadAssignment = async () => {
        if (!assignmentFile) {
          alert("Please select a file for the assignment.");
          return;
        }
      
        try {
          const formData = new FormData();
          formData.append("title", newAssignment.title);
          formData.append("description", newAssignment.description);
          formData.append("dueDate", newAssignment.dueDate);
          formData.append("file", assignmentFile); // Add file to the FormData
      
          const response = await axios.post(
            `http://localhost:5000/api/assignments/${moduleId}/assignments`,
            formData,
            {
              headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
            }
          );
      
          alert('Assignment uploaded successfully!');
          setModule({ ...module, assignments: [...module.assignments, response.data.assignment] });
          setNewAssignment({ title: '', description: '', dueDate: '' });
          setAssignmentFile(null);
          setShowModal(false);
        } catch (error) {
          alert('Failed to upload assignment.');
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

            alert('Assignment submitted successfully!');
            setAnswerFile(null);
        } catch (error) {
            alert('Failed to submit assignment.');
        }
    };

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

            alert("Assignment resubmitted successfully!");
            setAnswerFile(null);
        } catch (error) {
            alert("Failed to resubmit assignment.");
        }
    };


    // ✅ Pie Chart Colors
    const COLORS = ['#00C49F', '#FFBB28'];

    return (
        <div className="module-details-container">
            {error && <p className="error">{error}</p>}
            <h2>{module?.title}</h2>

            {/* ✅ Debugging Role */}
            <p>User Role: {role || "Loading..."}</p>

            {/* Pie Chart for Completion */}
            <div className="chart-container">
                {/* <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie
                            data={[
                                { name: 'Completed', value: module?.completionPercentage || 0 },
                                { name: 'Remaining', value: 100 - (module?.completionPercentage || 0) }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            <Cell fill={COLORS[0]} />
                            <Cell fill={COLORS[1]} />
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer> */}
            </div>

            {/* Display Assignments */}
            <h3>Assignments</h3>
            <ul>
                {module?.assignments?.map((assignment) => (
                    <li key={assignment._id} className="assignment-card">
                        <h4>{assignment.title}</h4>
                        <p>{assignment.description}</p>
                        <p>Due Date: {new Date(assignment.dueDate).toLocaleDateString()}</p>

                        {/* Students can Submit Answers */}
                        {role === 'student' && (
                            <div>
                                <input type="file" onChange={(e) => setAnswerFile(e.target.files[0])} />
                                <button className="submit-btn" onClick={() => handleSubmitAnswer(assignment._id)}>Submit Answer</button>
                                {/* // ✅ Add this inside the Assignment Submission Table UI */}
                                <button onClick={() => handleDownloadSubmission(assignment._id, submission._id, submission.answerFile.filename)}>
                                    Download Submission
                                </button>
                                {/* // ✅ Add this inside the Assignment Submission Table UI */}
                                <button onClick={() => handleResubmitAssignment(assignment._id)}>
                                    Resubmit Answer
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            {/* ✅ Show Upload Button for Admins & Lecturers */}
            {(role === 'admin' || role === 'lecturer') && (
                <div className="upload-section">
                    <button className="upload-btn" onClick={toggleModal}>Upload Assignment</button>
                </div>
            )}

            {/* ✅ Modal for Uploading Assignments */}
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
        </div>
    );
};

export default ModuleDetailsPage;
