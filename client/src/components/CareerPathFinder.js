// src/components/CareerPathFinder.js
import React, { useState } from 'react';
import CareerQuestionnaire from './CareerQuestionnaire';
import CareerSuggestionsDisplay from './CareerSuggestionsDisplay';
import CareerRoadmapDisplay from './CareerRoadmapDisplay';
import api from "../api";
import { toast } from 'react-toastify';

const CareerPathFinder = () => {
  const [currentStage, setCurrentStage] = useState('intro'); // 'intro', 'questionnaire', 'suggestions', 'roadmap'
  const [formData, setFormData] = useState({}); // To store questionnaire data across sections
  const [suggestedCareers, setSuggestedCareers] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(null); 
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  const [errorGeneratingSuggestions, setErrorGeneratingSuggestions] = useState(null);
  const [errorGeneratingRoadmap, setErrorGeneratingRoadmap] = useState(null);

  const handleStartQuiz = () => {
    setCurrentStage('questionnaire');
  };

  const handleQuestionnaireSubmit = async (data) => {
    setFormData(data);
    setCurrentStage('suggestions');
    setLoadingSuggestions(true);
    setErrorGeneratingSuggestions(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Authentication required. Please log in.");
        setLoadingSuggestions(false);
        setCurrentStage('intro');
        return;
      }

      const response = await api.post(
        '/api/career-finder/suggest',
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setSuggestedCareers(response.data.suggestions);
      toast.success("Career suggestions generated successfully!");

    } catch (error) {
      console.error('Error generating career suggestions:', error);
      setErrorGeneratingSuggestions(error.response?.data?.message || 'Failed to get career suggestions.');
      toast.error(error.response?.data?.message || 'Error generating suggestions. Please try again.');
      setSuggestedCareers([]);
      setCurrentStage('questionnaire');
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleExploreRoadmap = async (career) => {
    // Set the initial selected career details
    setSelectedCareer(career); 
    // Immediately set the stage to roadmap and loading to true
    setCurrentStage('roadmap'); 
    setLoadingRoadmap(true);
    setErrorGeneratingRoadmap(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Authentication required. Please log in.");
        setLoadingRoadmap(false);
        setCurrentStage('intro');
        return;
      }

      if (Object.keys(formData).length === 0) {
        toast.error("User questionnaire data is missing. Please start from the beginning.");
        setLoadingRoadmap(false);
        setCurrentStage('questionnaire');
        return;
      }

      const response = await api.post(
        '/api/career-finder/roadmap',
        {
          selectedCareerName: career.careerName,
          userData: formData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Store the AI-generated roadmap under 'roadmapData'
      setSelectedCareer(prev => ({ 
        ...prev, 
        roadmapData: response.data.roadmap // Backend sends 'roadmap', we need to store as 'roadmapData'
      })); 

      toast.success(`Roadmap for ${career.careerName} generated!`);

    } catch (error) {
      console.error('Error generating roadmap:', error);
      setErrorGeneratingRoadmap(error.response?.data?.message || 'Failed to get career roadmap.');
      toast.error(error.response?.data?.message || 'Error generating roadmap. Please try again.');
      setSelectedCareer(null);
      setCurrentStage('suggestions');
    } finally {
      setLoadingRoadmap(false);
    }
  };
  
  const handleRoadmapUpdated = (updatedRoadmapFromSave = null) => {
    // If a roadmap was just saved, `updatedRoadmapFromSave` will contain its _id
    if (updatedRoadmapFromSave) {
      setSelectedCareer(prev => ({ ...prev, ...updatedRoadmapFromSave }));
    }
  };


  const handleBackToQuestionnaire = () => {
    setCurrentStage('questionnaire');
    setSuggestedCareers([]);
    setErrorGeneratingSuggestions(null);
    setSelectedCareer(null);
    setErrorGeneratingRoadmap(null);
    setFormData({});
  };

  const handleBackToSuggestions = () => {
    setCurrentStage('suggestions');
    setSelectedCareer(null); // Clear selected career when going back
    setErrorGeneratingRoadmap(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6 sm:p-8 md:p-10 font-sans antialiased flex items-center justify-center">
      <div className="max-w-7xl mx-auto w-full">
        {currentStage === 'intro' && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 md:p-16 border border-gray-200 text-center flex flex-col items-center justify-center min-h-[400px]">
            <h2 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
              Discover Your Ideal <span className="text-indigo-600">Career Path</span>
            </h2>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl">
              Answer a few questions about your skills, interests, and preferences to get personalized career suggestions and a tailored roadmap.
            </p>
            <button
              onClick={handleStartQuiz}
              className="bg-indigo-600 text-white font-bold py-4 px-10 rounded-full text-xl shadow-lg hover:bg-indigo-700 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300 transform hover:scale-105"
            >
              Explore Career Paths
            </button>
          </div>
        )}

        {currentStage === 'questionnaire' && (
          <CareerQuestionnaire onFormSubmit={handleQuestionnaireSubmit} />
        )}

        {currentStage === 'suggestions' && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 md:p-16 border border-gray-200">
            <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-10">
              Your <span className="text-indigo-600">Career Suggestions</span>
            </h2>

            {loadingSuggestions ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500 mx-auto mb-4"></div>
                <p className="text-xl text-gray-600">Generating personalized suggestions for you...</p>
                <p className="text-sm text-gray-500 mt-2">(This might take a few moments)</p>
              </div>
            ) : errorGeneratingSuggestions ? (
              <div className="text-center py-20">
                <p className="text-red-600 text-xl mb-4">Error: {errorGeneratingSuggestions}</p>
                <p className="text-gray-600">Please try adjusting your answers and try again.</p>
                <button
                  onClick={handleBackToQuestionnaire}
                  className="mt-6 bg-indigo-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:bg-indigo-700 transition-colors"
                >
                  Back to Questionnaire
                </button>
              </div>
            ) : suggestedCareers.length > 0 ? (
              <CareerSuggestionsDisplay
                suggestions={suggestedCareers}
                onExploreRoadmap={handleExploreRoadmap}
              />
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-600 text-xl mb-4">No suggestions found. Please try again with different inputs.</p>
                <button
                  onClick={handleBackToQuestionnaire}
                  className="mt-6 bg-indigo-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:bg-indigo-700 transition-colors"
                >
                  Back to Questionnaire
                </button>
              </div>
            )}
          </div>
        )}

        {/* Roadmap Display Stage - FIX APPLIED HERE */}
        {currentStage === 'roadmap' && ( // Removed 'selectedCareer?.roadmapData' from this outer condition
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 md:p-16 border border-gray-200">
            {/* The H2 title remains, with a fallback for careerName */}
            <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-10">
              Roadmap for <span className="text-indigo-600">{selectedCareer?.careerName || 'Your Career'}</span>
            </h2>

            {loadingRoadmap ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500 mx-auto mb-4"></div>
                <p className="text-xl text-gray-600">Generating your personalized roadmap...</p>
                <p className="text-sm text-gray-500 mt-2">(This might take a few moments)</p>
              </div>
            ) : errorGeneratingRoadmap ? (
              <div className="text-center py-20">
                <p className="text-red-600 text-xl mb-4">Error: {errorGeneratingRoadmap}</p>
                <p className="text-gray-600">Could not generate roadmap. Please try again.</p>
                <button
                  onClick={handleBackToSuggestions}
                  className="mt-6 bg-indigo-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:bg-indigo-700 transition-colors"
                >
                  Back to Suggestions
                </button>
              </div>
            ) : (
              // Now, only render CareerRoadmapDisplay if selectedCareer.roadmapData exists AND has items
              selectedCareer?.roadmapData && selectedCareer.roadmapData.length > 0 ? (
                <CareerRoadmapDisplay
                  career={selectedCareer}
                  onBack={handleBackToSuggestions}
                  onRoadmapUpdated={handleRoadmapUpdated} // Pass the new handler
                />
              ) : (
                // This fallback catches cases where loading is done, no error, but no roadmap data
                <div className="text-center py-20">
                  <p className="text-gray-600 text-xl mb-4">No roadmap data was generated. Please try again or go back.</p>
                  <button
                    onClick={handleBackToSuggestions}
                    className="mt-6 bg-indigo-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:bg-indigo-700 transition-colors"
                  >
                    Back to Suggestions
                  </button>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerPathFinder;