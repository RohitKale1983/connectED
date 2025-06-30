# ConnectED: Your Personalized Career and Learning Portal

ConnectED is a full-stack MERN (MongoDB, Express.js, React, Node.js) application designed to empower students and learners by providing personalized career guidance, educational roadmaps, and a collaborative community environment. It aims to bridge the gap between academic learning and practical career planning, ensuring users have clear direction and support for their professional journeys.

---

## ✨ Features

- **User Authentication:** Secure user registration and login functionalities.

- **Personalized Career Path Finder:**
  - Interactive questionnaire to assess user skills, interests, and preferences.
  - AI-powered suggestions for ideal career paths using the Gemini API.
  - Generates detailed, step-by-step roadmaps for selected careers, including goals, projects, and certifications.
  - Ability to save and track progress on personalized roadmaps.

- **Real-time Chat:** Communicate and collaborate with peers or mentors (future expansion: dedicated mentor module).

- **Resource Management (Conceptual/Expandable):** Framework for managing educational resources or notes.

- **Responsive UI:** A modern, intuitive, and responsive user interface built with React and Tailwind CSS.

---

## 🚀 Technologies Used

### Frontend

- **React.js:** A JavaScript library for building user interfaces.
- **Axios:** Promise-based HTTP client for making API requests.
- **React Router DOM:** For declarative routing in the React application.
- **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
- **Socket.IO Client:** For real-time, bidirectional event-based communication.
- **React Toastify:** For elegant notifications.

### Backend

- **Node.js & Express.js:** A robust and flexible backend framework.
- **MongoDB & Mongoose:** A NoSQL database for data storage and an ODM for MongoDB.
- **JSON Web Tokens (JWT):** For secure authentication.
- **Bcrypt.js:** For password hashing.
- **Socket.IO:** For real-time communication.
- **Google Gemini API:** Integrated for AI-powered career suggestions and roadmap generation.
- **CORS:** Middleware to enable Cross-Origin Resource Sharing.

### Deployment

- **Vercel:** For deploying the React frontend.
- **Render:** For deploying the Node.js/Express.js backend.

---

## ⚙️ Setup and Installation (Local Development)

Follow these steps to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (LTS version recommended)
- npm (comes with Node.js) or Yarn
- MongoDB Atlas Account (for cloud database) or local MongoDB instance
- Google Cloud Project with Gemini API enabled and API Key

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd sppu-student-portal
```

### 2. Backend Setup

- Navigate into the `sppu-student-portal/server` directory.
- Create a `.env` file in the `server` directory and add the following environment variables:

  ```env
  PORT=5000
  MONGO_URI=<Your MongoDB Atlas Connection String>
  JWT_SECRET=<A strong random secret key>
  JWT_LIFETIME=1d
  GEMINI_API_KEY=<Your Google Gemini API Key>
  CORS_ORIGIN_PRODUCTION=<Your Vercel Frontend URL, e.g., https://connect-ed-liard.vercel.app>
  CORS_ORIGIN_DEVELOPMENT=http://localhost:3000
  ```

- Install backend dependencies:

  ```bash
  cd server
  npm install
  # or
  yarn install
  ```

- Run the backend server:

  ```bash
  npm start
  # or
  yarn start
  ```

  The server should start on [http://localhost:5000](http://localhost:5000).

### 3. Frontend Setup

- Navigate into the `sppu-student-portal/client` directory.
- Create a `.env` file in the `client` directory if needed (though `api/index.js` handles it dynamically).
- The `api/index.js` dynamically sets the base URL. For local development, it will use `http://localhost:5000`.

- Install frontend dependencies:

  ```bash
  cd client
  npm install
  # or
  yarn install
  ```

- Run the frontend development server:

  ```bash
  npm start
  # or
  yarn start
  ```

  The React app should open in your browser at [http://localhost:3000](http://localhost:3000).

---

## 🌐 Deployment

This project is set up for continuous deployment:

- **Frontend:** Deployed on Vercel ([https://connect-ed-liard.vercel.app](https://connect-ed-liard.vercel.app)). Pushing to the `main` branch automatically triggers a new deployment.
- **Backend:** Deployed on Render ([https://connected-backend-6yoi.onrender.com](https://connected-backend-6yoi.onrender.com)). Render is configured to build and deploy from the `main` branch. Environment variables for Render are set directly on the Render dashboard.

---

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements, new features, or bug fixes, please open an issue or submit a pull request.
