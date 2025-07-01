import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import HomePage from "./pages/HomePage";
import LoginRegister from "./pages/LoginRegister";
import Dashboard from "./pages/Dashboard";
import Notes from "./pages/Notes";
import BacklogPost from "./pages/Backlog";
import Notifications from "./pages/Notifications";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import MainLayout from "./components/MainLayout";
import ProfileLayout from "./pages/profile/ProfileLayout";
import ViewProfile from "./pages/profile/ViewProfile";
import EditProfile from "./pages/profile/EditProfile";
import BecomeMentor from "./pages/profile/BecomeMentor";
import Mentorship from "./pages/Mentor/Mentorship";
import ConnectionRequests from "./pages/Mentor/ConnectionRequests";
import ConnectedChats from "./pages/Mentor/ConnectedChats";
import MentorshipHub from "./pages/Mentor/MentorshipHub";
import MentorList from "./pages/MentorList";
import UpdateMentorProfile from "./pages/UpdateMentorProfile";
import CareerPathFinder from "./components/CareerPathFinder";
import MyRoadmapsPage from "./pages/MyRoadmapsPage";
import CareerHubPage from "./pages/CareerHubPage";
import AboutPage from "./pages/AboutPage";
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginRegister />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Notes />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/backlogs"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <BacklogPost />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Notifications />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ProfileLayout />
                </MainLayout>
              </ProtectedRoute>
            }
          >
            <Route path="view" element={<ViewProfile />} />
            <Route path="edit" element={<EditProfile />} />
            <Route path="become-mentor" element={<BecomeMentor />} />
          </Route>
          <Route
            path="/mentorship"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <MentorshipHub />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentorship/list"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Mentorship />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor/requests"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ConnectionRequests />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ConnectedChats />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentors"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <MentorList />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor/edit-profile"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <UpdateMentorProfile />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/career-finder"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <CareerPathFinder />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-roadmaps"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <MyRoadmapsPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/career-hub"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <CareerHubPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
           <Route path="*" element={<NotFoundPage />} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={1500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
