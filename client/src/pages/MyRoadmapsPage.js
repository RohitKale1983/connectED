// src/pages/MyRoadmapsPage.js
import React, { useState, useEffect } from 'react';
import api from "../api";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import CareerRoadmapDisplay from '../components/CareerRoadmapDisplay';

const MyRoadmapsPage = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);

  const navigate = useNavigate();

  const fetchRoadmaps = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Please log in to view your saved roadmaps.");
        setLoading(false);
        navigate('/login');
        return;
      }

      const response = await api.get('/api/career-finder/my-roadmaps', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRoadmaps(response.data.roadmaps);
      // Removed success toast here to avoid clutter on page load,
      // as fetching is expected behavior. Errors will still be toasted.
    } catch (err) {
      console.error("Error fetching saved roadmaps:", err);
      setError(err.response?.data?.message || "Failed to load saved roadmaps.");
      toast.error(err.response?.data?.message || "Error loading roadmaps.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const handleViewRoadmap = (roadmap) => {
    setSelectedRoadmap(roadmap);
  };

  const handleDeleteRoadmap = async (roadmapId) => {
    if (!window.confirm("Are you sure you want to delete this roadmap? This action cannot be undone.")) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Authentication required to delete roadmap.");
        navigate('/login');
        return;
      }

      await api.delete(`/api/career-finder/delete-roadmap/${roadmapId}`, { // Corrected API endpoint for delete
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Roadmap deleted successfully!");
      fetchRoadmaps(); // Re-fetch list to show updated state
    } catch (err) {
      console.error("Error deleting roadmap:", err);
      toast.error(err.response?.data?.message || "Failed to delete roadmap.");
    }
  };

  const handleBackToList = () => {
    setSelectedRoadmap(null);
    fetchRoadmaps(); // Re-fetch roadmaps to ensure latest progress/notes are reflected
  };

  const handleRoadmapUpdatedInDisplay = (updatedRoadmapFromServer) => {
    // If the roadmap was newly saved, update the selected roadmap to include its _id
    if (updatedRoadmapFromServer && updatedRoadmapFromServer._id) {
      setSelectedRoadmap(updatedRoadmapFromServer);
    }
    fetchRoadmaps(); // Always re-fetch to ensure the list is up-to-date (e.g., progress changes)
  };

  // NEW FUNCTION: Calculate roadmap progress percentage
  const calculateProgress = (roadmapData) => {
    let totalItems = 0;
    let completedItems = 0;

    roadmapData.forEach(year => {
      if (Array.isArray(year.goals)) {
        totalItems += year.goals.length;
        completedItems += year.goals.filter(goal => goal.completed).length;
      }
      if (Array.isArray(year.projects)) {
        totalItems += year.projects.length;
        completedItems += year.projects.filter(project => project.completed).length;
      }
      if (Array.isArray(year.certifications)) {
        totalItems += year.certifications.length;
        completedItems += year.certifications.filter(cert => cert.completed).length;
      }
    });

    if (totalItems === 0) {
      return 0; // Avoid division by zero if no trackable items
    }

    return Math.round((completedItems / totalItems) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6 sm:p-8 md:p-10 font-sans antialiased flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 md:p-16 border border-gray-200 text-center w-full max-w-xl">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500 mx-auto mb-6"></div>
          <p className="text-2xl text-gray-700 font-semibold">Loading your saved roadmaps...</p>
          <p className="text-gray-500 mt-2">Please wait a moment.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6 sm:p-8 md:p-10 font-sans antialiased flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 md:p-16 border border-gray-200 text-center w-full max-w-xl">
          <p className="text-red-600 text-2xl font-bold mb-4">Error loading roadmaps!</p>
          <p className="text-gray-700 text-lg mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()} // Simple reload to re-attempt fetch
            className="bg-blue-500 text-white font-bold py-2 px-6 rounded-full text-lg shadow-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (selectedRoadmap) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 sm:p-8 md:p-10 font-sans antialiased flex flex-col items-center justify-center">
        <div className="w-full max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 border border-gray-200">
          <CareerRoadmapDisplay
            career={selectedRoadmap}
            onBack={handleBackToList}
            onRoadmapUpdated={handleRoadmapUpdatedInDisplay}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6 sm:p-8 md:p-10 font-sans antialiased flex flex-col items-center">
      <div className="max-w-7xl mx-auto w-full bg-white rounded-3xl shadow-2xl p-8 sm:p-12 md:p-16 border border-gray-200">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-10 md:mb-12 leading-tight">
          Your <span className="text-purple-600">Saved Roadmaps</span>
        </h2>

        {roadmaps.length === 0 ? (
          <div className="text-center py-16 px-4">
            <p className="text-gray-700 text-xl md:text-2xl font-medium mb-4">You haven't saved any roadmaps yet!</p>
            <p className="text-gray-600 text-lg mb-8 max-w-lg mx-auto">
              Start your journey by generating a personalized career roadmap in the **Career Path Finder** section.
            </p>
            <button
              onClick={() => navigate('/career-finder')}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300"
            >
              Generate Your First Roadmap
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {roadmaps.map((roadmapItem) => {
              const progress = calculateProgress(roadmapItem.roadmapData);
              const firstYearDescription = roadmapItem.roadmapData[0]?.description;
              const firstYearGoals = roadmapItem.roadmapData[0]?.goals
                ?.filter(goal => typeof goal === 'object' && goal.text)
                .slice(0, 2)
                .map(goal => goal.text)
                .join(', ');

              return (
                <div
                  key={roadmapItem._id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-purple-300 transform hover:-translate-y-1"
                >
                  <div>
                    <h3 className="text-2xl font-extrabold text-gray-900 mb-2 leading-tight">
                      {roadmapItem.careerName}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Saved on: {new Date(roadmapItem.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-semibold text-purple-700">Progress</span>
                        <span className="text-sm font-semibold text-purple-700">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {firstYearDescription && (
                      <p className="text-gray-700 text-md mb-2 line-clamp-3">
                        <strong className="text-gray-800">Year 1 Focus:</strong> {firstYearDescription}
                      </p>
                    )}
                    {firstYearGoals && (
                      <p className="text-gray-600 text-sm line-clamp-2">
                        <strong className="text-gray-700">Key Goals:</strong> {firstYearGoals}...
                      </p>
                    )}
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      onClick={() => handleViewRoadmap(roadmapItem)}
                      className="bg-purple-600 text-white font-bold py-2 px-5 rounded-full text-base shadow-md hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-300 transform hover:scale-105"
                    >
                      View 
                    </button>
                    <button
                      onClick={() => handleDeleteRoadmap(roadmapItem._id)}
                      className="bg-red-500 text-white font-bold py-2 px-5 rounded-full text-base shadow-md hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300 transform hover:scale-105"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRoadmapsPage;