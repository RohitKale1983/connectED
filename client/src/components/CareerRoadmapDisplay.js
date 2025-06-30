// src/components/CareerRoadmapDisplay.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CareerRoadmapDisplay = ({ career, onBack, onRoadmapUpdated }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Initialize local roadmap data from career.roadmapData (from saved or newly generated)
  const [localRoadmapData, setLocalRoadmapData] = useState(career.roadmapData || []);

  // Determine if this roadmap is already saved in the DB (has an _id)
  const isSavedRoadmap = !!career._id; 

  // Update local state when the career.roadmapData prop changes (e.g., after initial generation or parent re-fetches)
  useEffect(() => {
    setLocalRoadmapData(career.roadmapData || []);
  }, [career.roadmapData]);


  // Initial check: if no career object or no roadmapData array, display fallback
  if (!career || !career.roadmapData || career.roadmapData.length === 0) { 
    return (
      <div className="text-center py-10">
        <p className="text-gray-600 text-xl">No roadmap data available.</p>
        <button
          onClick={onBack}
          className="mt-6 bg-indigo-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:bg-indigo-700 transition-colors"
        >
          {isSavedRoadmap ? 'Back to My Roadmaps' : 'Back to Career Suggestions'}
        </button>
      </div>
    );
  }

  const { careerName } = career;

  const handleSaveRoadmap = async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Authentication required to save roadmap. Please log in.");
        setIsSaving(false);
        return;
      }

      const response = await axios.post(
        '/api/career-finder/save-roadmap',
        {
          careerName: careerName,
          roadmapData: localRoadmapData, // Use local data for saving
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      toast.success(response.data.message);
      // If a new roadmap was saved, its _id will now be available in response.data.roadmap
      // We should ideally update the parent's `selectedCareer` with this _id
      // to allow future updates (completion, notes) to work immediately.
      if (onRoadmapUpdated) {
          onRoadmapUpdated(response.data.roadmap); // Pass the newly saved roadmap with its _id
      }
      // After saving, this roadmap now becomes a "saved" roadmap
      // You might want to update `career` prop itself if coming from generation
      // For now, the next time it's loaded, it will have the _id.

    } catch (error) {
      console.error('Error saving roadmap:', error);
      setSaveError(error.response?.data?.message || 'Failed to save roadmap.');
      toast.error(error.response?.data?.message || 'Error saving roadmap. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleItemCompletionChange = async (yearIndex, itemType, itemIndex, isCompleted) => {
    // Optimistically update UI
    const updatedLocalRoadmap = [...localRoadmapData];
    if (updatedLocalRoadmap[yearIndex] && updatedLocalRoadmap[yearIndex][itemType] && updatedLocalRoadmap[yearIndex][itemType][itemIndex]) {
        updatedLocalRoadmap[yearIndex][itemType][itemIndex].completed = isCompleted;
        setLocalRoadmapData(updatedLocalRoadmap);
    } else {
        console.warn(`Attempted to update non-existent item: yearIndex ${yearIndex}, itemType ${itemType}, itemIndex ${itemIndex}`);
        return;
    }

    // Only attempt to update via API if this is a SAVED roadmap (has an _id)
    if (!isSavedRoadmap) {
        toast.info("Please save this roadmap first to track progress!");
        return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Authentication required to update roadmap progress.");
        setLocalRoadmapData(career.roadmapData); // Revert to original if auth fails
        return;
      }

      await axios.put(
        `/api/career-finder/roadmap/update-item-status/${career._id}`,
        { yearIndex, itemType, itemIndex, completed: isCompleted },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Progress updated!");
       if (onRoadmapUpdated) {
          onRoadmapUpdated(); // Signal to parent (MyRoadmapsPage) to potentially refresh its list
      }
    } catch (error) {
      console.error('Error updating item status:', error);
      toast.error(error.response?.data?.message || 'Failed to update progress.');
      setLocalRoadmapData(career.roadmapData); // Revert on error
    }
  };

  const handleNotesChange = async (yearIndex, newNotes) => {
    // Optimistically update UI
    const updatedLocalRoadmap = [...localRoadmapData];
    if (updatedLocalRoadmap[yearIndex]) {
        updatedLocalRoadmap[yearIndex].userNotes = newNotes;
        setLocalRoadmapData(updatedLocalRoadmap);
    } else {
        console.warn(`Attempted to update notes for non-existent year: yearIndex ${yearIndex}`);
        return;
    }

    // Only attempt to update via API if this is a SAVED roadmap (has an _id)
    if (!isSavedRoadmap) {
        toast.info("Please save this roadmap first to add notes!");
        return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Authentication required to update notes.");
        setLocalRoadmapData(career.roadmapData); // Revert
        return;
      }

      await axios.put(
        `/api/career-finder/roadmap/update-notes/${career._id}`,
        { yearIndex, userNotes: newNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Notes updated!");
       if (onRoadmapUpdated) {
          onRoadmapUpdated(); // Signal to parent (MyRoadmapsPage) to potentially refresh its list
      }
    } catch (error) {
      console.error('Error updating notes:', error);
      toast.error(error.response?.data?.message || 'Failed to update notes.');
      setLocalRoadmapData(career.roadmapData); // Revert
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Roadmap for <span className="text-indigo-600">{careerName}</span>
      </h3>

      <div className="w-full max-w-4xl">
        {localRoadmapData.map((yearData, yearIndex) => (
          <div
            key={yearIndex}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8 relative overflow-hidden"
          >
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-800 font-bold text-xl opacity-75">
              {yearIndex + 1}
            </div>
            <h4 className="text-2xl font-bold text-gray-800 mb-4 pl-12">
              {yearData.year || `Year ${yearIndex + 1}`}
            </h4>

            {yearData.description && (
              <p className="text-gray-700 text-lg mb-4">{yearData.description}</p>
            )}

            {/* Goals section with checkboxes */}
            {yearData.goals && yearData.goals.length > 0 && (
              <div className="mb-4">
                <p className="font-semibold text-gray-800 text-lg mb-2">Key Goals & Skills:</p>
                <ul className="text-gray-700 space-y-1 ml-4">
                  {yearData.goals.map((goal, itemIndex) => (
                    <li key={itemIndex} className="flex items-center">
                      {isSavedRoadmap ? (
                        <input
                          type="checkbox"
                          checked={goal.completed || false} 
                          onChange={(e) =>
                            handleItemCompletionChange(
                              yearIndex,
                              'goals',
                              itemIndex,
                              e.target.checked
                            )
                          }
                          className="mr-2 h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      ) : (
                        <span className="w-5 h-5 mr-2 inline-block"></span> 
                      )}
                      <span className={goal.completed ? "line-through text-gray-500" : ""}>{goal.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Projects section with checkboxes */}
            {yearData.projects && yearData.projects.length > 0 && (
              <div className="mb-4">
                <p className="font-semibold text-gray-800 text-lg mb-2">Suggested Projects:</p>
                <ul className="text-gray-700 space-y-1 ml-4">
                  {yearData.projects.map((project, itemIndex) => (
                    <li key={itemIndex} className="flex items-center">
                      {isSavedRoadmap ? (
                        <input
                          type="checkbox"
                          checked={project.completed || false}
                          onChange={(e) =>
                            handleItemCompletionChange(
                              yearIndex,
                              'projects',
                              itemIndex,
                              e.target.checked
                            )
                          }
                          className="mr-2 h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      ) : (
                        <span className="w-5 h-5 mr-2 inline-block"></span>
                      )}
                      <span className={project.completed ? "line-through text-gray-500" : ""}>{project.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {yearData.internships && (
              <div className="mb-4">
                <p className="font-semibold text-gray-800 text-lg mb-2">Internships/Experience:</p>
                <p className="text-gray-700 ml-4">{yearData.internships}</p>
              </div>
            )}

            {yearData.certifications && yearData.certifications.length > 0 && (
              <div className="mb-4">
                <p className="font-semibold text-gray-800 text-lg mb-2">Certifications/Courses:</p>
                <ul className="text-gray-700 space-y-1 ml-4">
                  {yearData.certifications.map((cert, itemIndex) => (
                    <li key={itemIndex} className="flex items-center">
                      {isSavedRoadmap ? (
                        <input
                          type="checkbox"
                          checked={cert.completed || false}
                          onChange={(e) =>
                            handleItemCompletionChange(
                              yearIndex,
                              'certifications',
                              itemIndex,
                              e.target.checked
                            )
                          }
                          className="mr-2 h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      ) : (
                        <span className="w-5 h-5 mr-2 inline-block"></span>
                      )}
                      <span className={cert.completed ? "line-through text-gray-500" : ""}>{cert.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {yearData.networking && (
              <div>
                <p className="font-semibold text-gray-800 text-lg mb-2">Networking:</p>
                <p className="text-gray-700 ml-4">{yearData.networking}</p>
              </div>
            )}

            {isSavedRoadmap && (
              <div className="mt-6 border-t border-gray-200 pt-4">
                <label htmlFor={`notes-year-${yearIndex}`} className="block text-md font-semibold text-gray-800 mb-2">
                  My Notes for This Year:
                </label>
                <textarea
                  id={`notes-year-${yearIndex}`}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all duration-200 resize-y"
                  rows="3"
                  value={yearData.userNotes || ''}
                  onChange={(e) => handleNotesChange(yearIndex, e.target.value)}
                  placeholder="Add your personal notes or reflections here..."
                ></textarea>
              </div>
            )}
          </div>
        ))}
      </div>

      {saveError && (
        <p className="text-red-600 mb-4 text-center">{saveError}</p>
      )}
      <div className="flex justify-center gap-4 mt-10">
        {!isSavedRoadmap && (
          <button
            onClick={handleSaveRoadmap}
            disabled={isSaving}
            className={`px-8 py-3 rounded-full text-lg font-bold shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2
              ${isSaving
                ? 'bg-indigo-300 text-white cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500'
              }`}
          >
            {isSaving ? 'Saving...' : 'Save Roadmap'}
          </button>
        )}

        <button
          onClick={onBack}
          className="bg-gray-200 text-gray-800 font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          {isSavedRoadmap ? 'Back to My Roadmaps' : 'Back to Career Suggestions'}
        </button>
      </div>
    </div>
  );
};

export default CareerRoadmapDisplay;