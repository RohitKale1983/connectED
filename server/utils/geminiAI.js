// server/utils/geminiAI.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to generate career suggestions
async function generateCareerSuggestions(userData) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const { branch, year, skills, workType, workSetting, salaryRange } = userData;

  const prompt = `
    Based on the following user profile and considering current and future job market trends (focus on 2025 onwards), suggest 3-5 highly relevant career paths. For each career path, provide:
    - **Career Name**: A clear title.
    - **Description**: A concise summary (2-3 sentences) of what the role entails.
    - **Fit %**: An estimated percentage of how well this career fits the user's profile (0-100%).
    - **Average Salary (LPA)**: An estimated annual salary range in Lakhs Per Annum (LPA) for freshers/entry-level (e.g., 5-8 LPA). Assume Indian context.
    - **Demand Level**: Rate the demand as Low, Medium, High, or Very High.

    User Profile:
    - Branch: ${branch}
    - Academic Year: ${year}
    - Existing Skills: ${skills.join(', ')}
    - Desired Work Type: ${workType}
    - Desired Work Setting: ${workSetting}
    - Expected Salary Range: ${salaryRange}

    Please format the output as a JSON array of objects, like this example:
    [
      {
        "careerName": "Embedded Systems Engineer",
        "description": "Develops and programs embedded systems, microcontrollers, and firmware for various devices. Works on hardware-software integration.",
        "fitPercentage": 90,
        "averageSalaryLPA": "5-8 LPA",
        "demandLevel": "High"
      },
      {
        "careerName": "IoT Solution Architect",
        "description": "Designs and implements IoT solutions, connecting devices, sensors, and cloud platforms. Focuses on system architecture and data flow.",
        "fitPercentage": 85,
        "averageSalaryLPA": "6-10 LPA",
        "demandLevel": "Very High"
      }
    ]
    Ensure the JSON is perfectly parsable. Do not include any text before or after the JSON.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let jsonString = text.replace(/```json\n|\n```/g, '');
    const firstBrace = jsonString.indexOf('[');
    const lastBrace = jsonString.lastIndexOf(']');
    if (firstBrace !== -1 && lastBrace !== -1) {
      jsonString = jsonString.substring(firstBrace, lastBrace + 1);
    } else {
        throw new Error("Could not find a valid JSON array in Gemini's response.");
    }

    const parsedSuggestions = JSON.parse(jsonString);
    return parsedSuggestions;
  } catch (error) {
    console.error("Error calling Gemini API for suggestions:", error);
    throw new Error("Failed to generate career suggestions from AI.");
  }
}

// Function to generate career roadmap
async function generateCareerRoadmap(selectedCareerName, userData) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const { branch, year, skills } = userData;

  let numYears = 4;
  if (year && typeof year === 'string') {
    const yearNumberMatch = year.match(/\d+/);
    if (yearNumberMatch) {
      const currentYear = parseInt(yearNumberMatch[0], 10);
      if (!isNaN(currentYear)) {
        numYears = Math.max(1, 4 - currentYear + 1);
        if (numYears > 0 && currentYear <= 4) {
          numYears += 1;
        } else if (currentYear > 4) {
            numYears = 1;
        }
      }
    }
  }
  numYears = Math.min(numYears, 5);


  const currentYearDescription = (year && typeof year === 'string' && year.toLowerCase().includes('final')) ? 'Final Year (Graduation imminent)' : year;

  const prompt = `
    Generate a detailed year-by-year roadmap for a student aiming to become a "${selectedCareerName}".
    The student's profile is:
    - Branch: ${branch}
    - Current Academic Year: ${currentYearDescription || 'Not specified'}
    - Existing Skills: ${skills.join(', ')}

    Provide a roadmap covering approximately ${numYears} years from their current academic year.
    For each year, include:
    - **year**: A descriptive title for the academic year (e.g., "Year 1 (Foundation)", "Year 2 (Specialization)", "Final Year (Job Readiness)", "Post-Graduation (Initial Role)").
    - **description**: A brief overview of the focus for this year (1-2 sentences).
    - **goals**: An array of 3-5 specific, actionable goals or skills to acquire.
    - **projects**: An array of 1-3 suggested projects to work on.
    - **internships**: Suggestions for internships or practical experience (e.g., "Summer internship at a tech company", "Freelance projects", "Relevant research assistantship").
    - **certifications**: An array of 1-2 relevant online courses or certifications.
    - **networking**: Advice on networking for the year (e.g., "Attend industry meetups", "Connect with seniors", "Informational interviews").

    Ensure the roadmap is practical, progressive, and tailored to the career "${selectedCareerName}" and the user's current academic year. If the current year is "Final Year", focus heavily on job applications, final projects, and transition.

    Format the output as a JSON array of objects. Do not include any text before or after the JSON.
    Example JSON structure:
    [
      {
        "year": "Year 1 (Foundation)",
        "description": "Focus on building strong foundational concepts in core computer science and basic programming.",
        "goals": [
          "Master Python/Java fundamentals",
          "Understand Data Structures & Algorithms (Basic)",
          "Learn version control (Git)"
        ],
        "projects": [
          "Simple calculator app",
          "Text-based adventure game"
        ],
        "internships": "Focus on academics and personal projects.",
        "certifications": [
          "Google IT Support Professional Certificate",
          "Python for Everybody (Coursera)"
        ],
        "networking": "Connect with classmates and seniors, explore college clubs."
      }
    ]
    Ensure the JSON is perfectly parsable.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let jsonString = text.replace(/```json\n|\n```/g, '');
    const firstBrace = jsonString.indexOf('[');
    const lastBrace = jsonString.lastIndexOf(']');
    if (firstBrace !== -1 && lastBrace !== -1) {
      jsonString = jsonString.substring(firstBrace, lastBrace + 1);
    } else {
        throw new Error("Could not find a valid JSON array in Gemini's response.");
    }

    let parsedRoadmap = JSON.parse(jsonString);

    // ⭐ FIX: Transform goals, projects, and certifications into objects ⭐
    // ⭐ And ensure internships and networking are always strings ⭐
    parsedRoadmap = parsedRoadmap.map(yearData => {
      // Ensure arrays exist before mapping, handling cases where Gemini might skip a field
      const goalsArray = Array.isArray(yearData.goals) ? yearData.goals : [];
      const projectsArray = Array.isArray(yearData.projects) ? yearData.projects : [];
      const certificationsArray = Array.isArray(yearData.certifications) ? yearData.certifications : [];

      // ⭐ New: Handle internships and networking to ensure they are strings ⭐
      let internshipsString = yearData.internships;
      if (Array.isArray(yearData.internships)) {
          internshipsString = yearData.internships.join(', '); // Join array elements into a string
      } else if (typeof yearData.internships !== 'string') {
          internshipsString = ''; // Default to empty string if not array or string
      }

      let networkingString = yearData.networking;
      if (Array.isArray(yearData.networking)) {
          networkingString = yearData.networking.join(', '); // Join array elements into a string
      } else if (typeof yearData.networking !== 'string') {
          networkingString = ''; // Default to empty string if not array or string
      }


      return {
        ...yearData, // Keep all other properties from Gemini's output
        goals: goalsArray.map(goalText => ({ text: goalText, completed: false })),
        projects: projectsArray.map(projectText => ({ text: projectText, completed: false })),
        certifications: certificationsArray.map(certText => ({ text: certText, completed: false })),
        internships: internshipsString, // Use the processed string
        networking: networkingString,   // Use the processed string
        userNotes: yearData.userNotes || '', // Initialize userNotes if not present, keeping existing if it somehow appears
      };
    });

    return parsedRoadmap;

  } catch (error) {
    console.error("Error calling Gemini API for roadmap or transforming response:", error);
    throw new Error("Failed to generate or process career roadmap from AI. Please try again.");
  }
}

module.exports = { generateCareerSuggestions, generateCareerRoadmap };