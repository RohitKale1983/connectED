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

      const response = await api.get('/career-finder/my-roadmaps', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRoadmaps(response.data.roadmaps);
      toast.success("Saved roadmaps loaded successfully!");
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
    if (!window.confirm("Are you sure you want to delete this roadmap?")) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Authentication required to delete roadmap.");
        navigate('/login');
        return;
      }

      await api.delete(`/career-finder/delete-roadmap/${roadmapId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Roadmap deleted successfully!");
      fetchRoadmaps();
    } catch (err) {
      console.error("Error deleting roadmap:", err);
      toast.error(err.response?.data?.message || "Failed to delete roadmap.");
    }
  };

  const handleBackToList = () => {
    setSelectedRoadmap(null);
    fetchRoadmaps();
  };

  const handleRoadmapUpdatedInDisplay = (updatedRoadmapFromServer) => {
      if(updatedRoadmapFromServer && updatedRoadmapFromServer._id){
          setSelectedRoadmap(updatedRoadmapFromServer);
      }
      fetchRoadmaps();
  };

  // ⭐ NEW FUNCTION: Calculate roadmap progress percentage ⭐
  const calculateProgress = (roadmapData) => {
    let totalItems = 0;
    let completedItems = 0;

    roadmapData.forEach(year => {
      // Check for goals
      if (Array.isArray(year.goals)) {
        totalItems += year.goals.length;
        completedItems += year.goals.filter(goal => goal.completed).length;
      }
      // Check for projects
      if (Array.isArray(year.projects)) {
        totalItems += year.projects.length;
        completedItems += year.projects.filter(project => project.completed).length;
      }
      // Check for certifications
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
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading your saved roadmaps...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6 sm:p-8 md:p-10 font-sans antialiased flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 md:p-16 border border-gray-200 text-center w-full max-w-xl">
          <p className="text-red-600 text-xl mb-4">Error: {error}</p>
          <p className="text-gray-600">Please try again or log in if prompted.</p>
        </div>
      </div>
    );
  }

  if (selectedRoadmap) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6 sm:p-8 md:p-10 font-sans antialiased flex items-center justify-center">
        <div className="max-w-7xl mx-auto w-full bg-white rounded-3xl shadow-2xl p-8 sm:p-12 md:p-16 border border-gray-200">
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6 sm:p-8 md:p-10 font-sans antialiased flex items-center justify-center">
      <div className="max-w-7xl mx-auto w-full bg-white rounded-3xl shadow-2xl p-8 sm:p-12 md:p-16 border border-gray-200">
        <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-10">
          Your <span className="text-purple-600">Saved Roadmaps</span>
        </h2>

        {roadmaps.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-xl mb-4">You haven't saved any roadmaps yet.</p>
            <p className="text-gray-500">Go to the Career Path Finder to generate and save your first roadmap!</p>
            <button
              onClick={() => navigate('/career-finder')}
              className="mt-6 bg-indigo-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:bg-indigo-700 transition-colors"
            >
              Go to Career Finder
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roadmaps.map((roadmapItem) => {
              // ⭐ Calculate progress for each roadmap item ⭐
              const progress = calculateProgress(roadmapItem.roadmapData);

              return (
                <div
                  key={roadmapItem._id}
                  className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:border-purple-200"
                >
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {roadmapItem.careerName}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      Saved on: {new Date(roadmapItem.createdAt).toLocaleDateString()}
                    </p>
                    {/* ⭐ Display Progress ⭐ */}
                    <p className="text-md font-semibold text-purple-700 mb-4">
                        Progress: {progress}% Complete
                    </p>
                    {roadmapItem.roadmapData && roadmapItem.roadmapData.length > 0 && (
                      <p className="text-gray-700 text-md line-clamp-3">
                        **Focus:** {roadmapItem.roadmapData[0].description} <br/>
                        **Goals:** {
                          roadmapItem.roadmapData[0].goals
                            ?.filter(goal => typeof goal === 'object' ? goal.text : typeof goal === 'string')
                            .slice(0,2)
                            .map(goal => typeof goal === 'object' ? goal.text : goal)
                            .join(', ') || 'N/A'
                        }...
                      </p>
                    )}
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      onClick={() => handleViewRoadmap(roadmapItem)}
                      className="bg-purple-500 text-white font-bold py-2 px-5 rounded-full text-md shadow-md hover:bg-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-300"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteRoadmap(roadmapItem._id)}
                      className="bg-red-500 text-white font-bold py-2 px-5 rounded-full text-md shadow-md hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
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