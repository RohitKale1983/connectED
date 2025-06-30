import React, { useEffect, useState, useRef } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify'; // For better notifications
import 'react-toastify/dist/ReactToastify.css'; // Toastify CSS

const departments = ["Computer", "ENTC", "Mechanical", "IT"];
const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];

const subjectOptions = {
  Computer: {
    1: ["Maths I", "Physics", "Programming Basics"],
    2: ["Maths II", "OOP", "Digital Electronics"],
    3: ["DSA", "DBMS", "Computer Networks"],
    4: ["OS", "Web Technologies", "Software Engineering"],
    5: ["AI", "ML", "Compiler Design"],
    6: ["Cloud", "Cybersecurity", "Mobile Computing"],
    7: ["IoT", "Blockchain", "Elective I"],
    8: ["Project", "Elective II", "Seminar"],
  },
  ENTC: {
    1: ["Maths I", "Physics", "Electronics Basics"],
    2: ["Maths II", "Digital Circuits", "Signals & Systems"],
    3: ["Communication Systems", "Microprocessors", "Control Systems"],
    4: ["VLSI", "Embedded Systems", "Data Communication"],
    5: ["IoT", "Robotics", "Elective I"],
    6: ["Wireless Communication", "ML", "Elective II"],
    7: ["Project Phase I", "Elective III"],
    8: ["Project Phase II", "Seminar"],
  },
  Mechanical: {
    1: ["Maths I", "Engineering Mechanics", "Physics"],
    2: ["Maths II", "Thermodynamics", "CAD"],
    3: ["Fluid Mechanics", "Material Science", "Kinematics"],
    4: ["Dynamics", "Manufacturing", "Control Engineering"],
    5: ["Refrigeration", "Robotics", "Elective I"],
    6: ["Heat Transfer", "Machine Design", "Elective II"],
    7: ["Project Phase I", "Seminar"],
    8: ["Project Phase II"],
  },
  IT: {
    1: ["Maths I", "Basics of IT", "Physics"],
    2: ["Maths II", "OOP", "Digital Logic"],
    3: ["DSA", "DBMS", "Web Programming"],
    4: ["Computer Networks", "OS", "Cyber Law"],
    5: ["AI", "Cloud Computing", "Elective I"],
    6: ["ML", "Mobile App Dev", "Elective II"],
    7: ["Project I", "Elective III"],
    8: ["Project II", "Seminar"],
  },
};

const getSubjectsForBranchAndSemester = (branch, semester) => {
  return subjectOptions[branch]?.[semester] || [];
};

const Notes = () => {
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState([]);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    branch: "Computer",
    semester: "1",
  });

  const [selectedDept, setSelectedDept] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");

  const fetchNotes = async () => {
    try {
      const res = await api.get("/notes");
      setNotes(res.data); 
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a PDF file.");
      return;
    }

    const data = new FormData();
    data.append("file", file);
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("subject", formData.subject);
    data.append("branch", formData.branch);
    data.append("semester", formData.semester);

    try {
      const token = localStorage.getItem("token");
      await api.post("/notes/upload", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Note uploaded successfully!");
      setFormData({
        title: "",
        description: "",
        subject: "",
        branch: "Computer",
        semester: "1",
      });
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      fetchNotes();
    } catch (err) {
      console.error("Upload error:", err.message);
      toast.error("Upload failed. Please try again.");
    }
  };

  const filteredNotes = notes.filter((note) => {
    return (
      note.branch === selectedDept &&
      note.semester === selectedSemester &&
      note.subject === selectedSubject
    );
  });

  const allSubjects = notes
    .filter(
      (note) =>
        note.branch === selectedDept && note.semester === selectedSemester
    )
    .map((note) => note.subject);

  const uniqueSubjects = [...new Set(allSubjects)];

  useEffect(() => {
    setSubjects(uniqueSubjects);
  }, [selectedDept, selectedSemester, notes]);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

      {/* --- Upload Note Section --- */}
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
        Upload Your Notes
      </h2>
      <div className="bg-white p-8 rounded-lg shadow-xl mb-12">
        <form onSubmit={handleUpload} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="e.g., Data Structures - Unit 1"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              placeholder="Briefly describe the content of these notes..."
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out resize-y"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows="3"
              required
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="branch"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Department/Branch
              </label>
              <select
                id="branch"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                value={formData.branch}
                onChange={(e) =>
                  setFormData({ ...formData, branch: e.target.value })
                }
              >
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="semester"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Semester
              </label>
              <select
                id="semester"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                value={formData.semester}
                onChange={(e) =>
                  setFormData({ ...formData, semester: e.target.value })
                }
              >
                {semesters.map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Subject
            </label>
            <select
              className="w-full p-2 border rounded"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              required
            >
              <option value="">Select Subject</option>
              {getSubjectsForBranchAndSemester(
                formData.branch,
                formData.semester
              ).map((subj, index) => (
                <option key={index} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="file-upload"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Upload PDF File
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".pdf"
              className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              onChange={(e) => setFile(e.target.files[0])}
              ref={fileInputRef}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md shadow-lg transition duration-200 ease-in-out transform hover:scale-105"
          >
            Upload Note
          </button>
        </form>
      </div>

      <hr className="border-t-2 border-gray-200 my-12" />

      {/* --- Browse Notes Section --- */}
      <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
        Browse Available Notes
      </h2>

      {/* Select Department */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          1. Select Department
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {departments.map((dept) => (
            <button
              key={dept}
              className={`py-3 px-5 border border-transparent rounded-lg text-lg font-medium transition duration-200 ease-in-out
                ${
                  selectedDept === dept
                    ? "bg-indigo-600 text-white shadow-md transform scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              onClick={() => {
                setSelectedDept(dept);
                setSelectedSemester("");
                setSelectedSubject("");
              }}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Select Semester */}
      {selectedDept && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            2. Select Semester for {selectedDept}
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-3">
            {semesters.map((sem) => (
              <button
                key={sem}
                className={`py-2 px-4 border border-transparent rounded-lg text-md font-medium transition duration-200 ease-in-out
                  ${
                    selectedSemester === sem
                      ? "bg-teal-600 text-white shadow-md transform scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                onClick={() => {
                  setSelectedSemester(sem);
                  setSelectedSubject("");
                }}
              >
                Sem {sem}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Select Subject */}
      {selectedDept && selectedSemester && uniqueSubjects.length > 0 && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            3. Select Subject for {selectedDept}, Semester {selectedSemester}
          </h3>
          <div className="flex flex-wrap gap-3">
            {uniqueSubjects.map((subj) => (
              <button
                key={subj}
                className={`px-4 py-2 border border-transparent rounded-full text-sm font-medium transition duration-200 ease-in-out
                  ${
                    selectedSubject === subj
                      ? "bg-purple-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                onClick={() => setSelectedSubject(subj)}
              >
                {subj}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Display Filtered Notes */}
      {selectedSubject && (
        <>
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Notes for {selectedSubject}
          </h3>
          {filteredNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNotes.map((note) => (
                <div
                  key={note._id}
                  className="bg-white border border-gray-200 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 ease-in-out flex flex-col justify-between"
                >
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      {note.title}
                    </h4>
                    <p className="text-gray-700 text-sm mb-4">
                      {note.description}
                    </p>
                    <div className="space-y-1 text-gray-600 text-sm mb-4">
                      <p className="flex items-center">
                        <span className="mr-2 text-blue-500">📘</span>
                        Subject:{" "}
                        <span className="font-medium ml-1">{note.subject}</span>
                      </p>
                      <p className="flex items-center">
                        <span className="mr-2 text-green-500">🎓</span>
                        Branch:{" "}
                        <span className="font-medium ml-1">{note.branch}</span>
                      </p>
                      <p className="flex items-center">
                        <span className="mr-2 text-purple-500">📚</span>
                        Semester:{" "}
                        <span className="font-medium ml-1">
                          {note.semester}
                        </span>
                      </p>
                      <p className="flex items-center">
                        <span className="mr-2 text-red-500">📥</span>
                        Downloads:{" "}
                        <span className="font-medium ml-1">
                          {note.downloadCount}
                        </span>
                      </p>
                    </div>
                  </div>
                  <a
                    href={`/notes/download/${note._id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 ease-in-out transform hover:scale-105"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    View / Download PDF
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 text-lg mt-8 p-4 bg-white rounded-lg shadow-md">
              No notes found for the selected subject. Be the first to upload
              one!
            </p>
          )}
        </>
      )}

      {/* No selection message */}
      {!selectedDept && (
        <p className="text-center text-gray-500 text-lg mt-8 p-4 bg-white rounded-lg shadow-md">
          Please select a department, semester, and subject to browse notes.
        </p>
      )}

      {selectedDept && !selectedSemester && (
        <p className="text-center text-gray-500 text-lg mt-8 p-4 bg-white rounded-lg shadow-md">
          Now, select a semester to continue Browse.
        </p>
      )}

      {selectedDept && selectedSemester && uniqueSubjects.length === 0 && (
        <p className="text-center text-gray-600 text-lg mt-8 p-4 bg-white rounded-lg shadow-md">
          No subjects available for the selected department and semester.
        </p>
      )}
    </div>
  );
};

export default Notes;
