import React, { useState, useEffect } from 'react';
import api from "../api";
import { toast } from 'react-toastify';

// Static data (as fallback)
const defaultBranches = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'Information Technology'];
const defaultYears = ['Year 1', 'Year 2', 'Year 3', 'Final Year'];
const defaultSkills = [
  'Python', 'Java', 'C++', 'JavaScript', 'Data Structures & Algorithms',
  'SQL', 'Cloud Computing (AWS/Azure/GCP)', 'Machine Learning', 'Data Science',
  'Web Development (Frontend)', 'Web Development (Backend)', 'UI/UX Design',
  'Embedded Systems', 'Robotics', 'AutoCAD', 'SolidWorks', 'VLSI',
  'IoT', 'Networking', 'Cybersecurity', 'Project Management', 'Communication',
];
const defaultWorkTypes = ['Coding', 'Design', 'Management', 'Research', 'Sales', 'Marketing'];
const defaultWorkSettings = ['Remote', 'On-site', 'Hybrid'];
const defaultSalaryRanges = ['0-5 LPA', '5-10 LPA', '10-15 LPA', '15-20 LPA', '20+ LPA'];


const CareerQuestionnaire = ({ onFormSubmit }) => {
  // --- Section States ---
  const [currentSection, setCurrentSection] = useState(1); // 1, 2, or 3 (for future AI section)

  // Section A states
  const [branch, setBranch] = useState('');
  const [year, setYear] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);

  // Section B states
  const [workType, setWorkType] = useState('');
  const [workSetting, setWorkSetting] = useState('');
  const [salaryRange, setSalaryRange] = useState('');

  // Options fetched from backend
  const [options, setOptions] = useState({
    branches: defaultBranches,
    years: defaultYears,
    skills: defaultSkills,
    work_types: defaultWorkTypes,
    work_settings: defaultWorkSettings,
    salary_ranges: defaultSalaryRanges,
  });
  const [loadingOptions, setLoadingOptions] = useState(true);

  // --- Fetch options from backend on component mount ---
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoadingOptions(true);
        const response = await api.get('/api/questionnaire/options');
        setOptions(prev => ({
          ...prev, // Keep existing defaults if any missing from backend
          ...response.data
        }));
      } catch (error) {
        console.error('Error fetching questionnaire options:', error);
        toast.error('Failed to load questionnaire options. Using defaults.');
        // Fallback to default static data
      } finally {
        setLoadingOptions(false);
      }
    };
    fetchOptions();
  }, []);

  // --- Handlers ---
  const handleSkillChange = (skill) => {
    setSelectedSkills(prevSkills =>
      prevSkills.includes(skill)
        ? prevSkills.filter(s => s !== skill)
        : [...prevSkills, skill]
    );
  };

  const handleNext = () => {
    // Validate current section before moving
    if (currentSection === 1) {
      if (!branch || !year || selectedSkills.length === 0) {
        toast.error("Please fill all required fields in Section A (Branch, Year, and at least one Skill).");
        return;
      }
    } else if (currentSection === 2) {
      if (!workType || !workSetting || !salaryRange) {
        toast.error("Please fill all required fields in Section B (Work Type, Work Setting, and Salary Range).");
        return;
      }
    }
    // If validation passes, move to next section
    setCurrentSection(prev => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentSection(prev => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // This handleSubmit is called only when the LAST section's "Submit" button is pressed.
    // Ensure all data is validated again just in case, though handleNext should cover it.
    if (!branch || !year || selectedSkills.length === 0 || !workType || !workSetting || !salaryRange) {
      toast.error("Please complete all sections before submitting.");
      return;
    }

    const formData = {
      branch,
      year,
      skills: selectedSkills,
      workType,
      workSetting,
      salaryRange,
    };
    onFormSubmit(formData); // Send all collected data to parent component
  };

  if (loadingOptions) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full mx-auto p-8 bg-white shadow-2xl rounded-3xl border border-gray-200 text-center py-20 animate-pulse">
          <p className="text-xl text-gray-600">Loading questionnaire options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full mx-auto p-6 sm:p-8 lg:p-10 bg-white shadow-2xl rounded-3xl border border-gray-200">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center mb-8 sm:mb-10 leading-tight">
          Tell Us About <span className="text-indigo-600">Yourself</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-10">
          {/* Section A: About You */}
          {currentSection === 1 && (
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-5 sm:mb-6 border-b-2 border-indigo-200 pb-3">
                <span className="text-indigo-600 mr-2">1️⃣</span> Section A: About You
              </h3>

              {/* Branch Dropdown */}
              <div className="mb-6 sm:mb-8">
                <label htmlFor="branch" className="block text-base sm:text-lg font-medium text-gray-700 mb-2 sm:mb-3">
                  What is your current branch?
                </label>
                <select
                  id="branch"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base sm:text-lg transition-colors appearance-none pr-8 bg-white bg-no-repeat bg-right-center custom-select-arrow"
                >
                  <option value="" disabled>Select your branch</option>
                  {options.branches.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Year Selection */}
              <div className="mb-6 sm:mb-8">
                <label className="block text-base sm:text-lg font-medium text-gray-700 mb-3 sm:mb-4">
                  What year are you in?
                </label>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {options.years.map(y => (
                    <label
                      key={y}
                      className={`flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ease-in-out text-sm sm:text-lg
                        ${year === y ? 'bg-indigo-50 border-indigo-600 text-indigo-800 shadow-md font-semibold ring-2 ring-indigo-500' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'}`
                      }
                      tabIndex="0" // Make labels focusable
                      onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') setYear(y); }}
                    >
                      <input
                        type="radio"
                        name="year"
                        value={y}
                        checked={year === y}
                        onChange={() => setYear(y)}
                        className="hidden"
                        required
                      />
                      <span>{y}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Skills Multi-select */}
              <div className="mb-6 sm:mb-8">
                <label className="block text-base sm:text-lg font-medium text-gray-700 mb-3 sm:mb-4">
                  Which skills do you already have?
                  <span className="text-gray-500 font-normal ml-2 text-sm sm:text-base">(Select all that apply)</span>
                </label>
                <div className="flex flex-wrap gap-2 sm:gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {options.skills.map(skill => (
                    <div
                      key={skill}
                      onClick={() => handleSkillChange(skill)}
                      className={`px-4 sm:px-5 py-2 rounded-full cursor-pointer transition-all duration-200 ease-in-out text-xs sm:text-sm font-medium whitespace-nowrap
                        ${selectedSkills.includes(skill)
                          ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-500'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`
                      }
                      tabIndex="0" // Make skill tags focusable
                      onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSkillChange(skill); }}
                      role="checkbox"
                      aria-checked={selectedSkills.includes(skill)}
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Section B: Preferences & Interests */}
          {currentSection === 2 && (
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-5 sm:mb-6 border-b-2 border-indigo-200 pb-3">
                <span className="text-indigo-600 mr-2">2️⃣</span> Section B: Preferences & Interests
              </h3>

              {/* Work Type */}
              <div className="mb-6 sm:mb-8">
                <label className="block text-base sm:text-lg font-medium text-gray-700 mb-3 sm:mb-4">
                  What type of work do you enjoy?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  {options.work_types.map(type => (
                    <label
                      key={type}
                      className={`flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ease-in-out text-sm sm:text-lg text-center
                        ${workType === type ? 'bg-indigo-50 border-indigo-600 text-indigo-800 shadow-md font-semibold ring-2 ring-indigo-500' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'}`
                      }
                      tabIndex="0" // Make labels focusable
                      onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') setWorkType(type); }}
                    >
                      <input
                        type="radio"
                        name="workType"
                        value={type}
                        checked={workType === type}
                        onChange={() => setWorkType(type)}
                        className="hidden"
                        required
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Work Setting */}
              <div className="mb-6 sm:mb-8">
                <label className="block text-base sm:text-lg font-medium text-gray-700 mb-3 sm:mb-4">
                  Desired work setting?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  {options.work_settings.map(setting => (
                    <label
                      key={setting}
                      className={`flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ease-in-out text-sm sm:text-lg text-center
                        ${workSetting === setting ? 'bg-indigo-50 border-indigo-600 text-indigo-800 shadow-md font-semibold ring-2 ring-indigo-500' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'}`
                      }
                      tabIndex="0" // Make labels focusable
                      onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') setWorkSetting(setting); }}
                    >
                      <input
                        type="radio"
                        name="workSetting"
                        value={setting}
                        checked={workSetting === setting}
                        onChange={() => setWorkSetting(setting)}
                        className="hidden"
                        required
                      />
                      <span>{setting}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Expected Salary Range */}
              <div className="mb-6 sm:mb-8">
                <label htmlFor="salaryRange" className="block text-base sm:text-lg font-medium text-gray-700 mb-2 sm:mb-3">
                  Expected salary range?
                </label>
                <select
                  id="salaryRange"
                  value={salaryRange}
                  onChange={(e) => setSalaryRange(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base sm:text-lg transition-colors appearance-none pr-8 bg-white bg-no-repeat bg-right-center custom-select-arrow"
                >
                  <option value="" disabled>Select your expected range</option>
                  {options.salary_ranges.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="pt-6 flex flex-col sm:flex-row justify-between gap-4 sm:gap-6">
            {currentSection > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 sm:py-4 rounded-xl text-lg sm:text-xl shadow-lg hover:bg-gray-300 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-gray-300 active:scale-98"
              >
                Previous
              </button>
            )}

            {currentSection < 2 ? (
              <button
                type="button"
                onClick={handleNext}
                className={`flex-1 bg-indigo-600 text-white font-bold py-3 sm:py-4 rounded-xl text-lg sm:text-xl shadow-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-300 active:scale-98
                  ${(currentSection === 1 && (!branch || !year || selectedSkills.length === 0)) ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={(currentSection === 1 && (!branch || !year || selectedSkills.length === 0))}
              >
                Next: {currentSection === 1 ? 'Your Preferences' : 'Review & Submit'}
              </button>
            ) : (
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white font-bold py-3 sm:py-4 rounded-xl text-lg sm:text-xl shadow-lg hover:bg-green-700 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-green-300 active:scale-98"
              >
                Get Career Suggestions
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CareerQuestionnaire;