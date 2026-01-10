import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { loadUser } from "./store/slices/authSlice";
import { connectSocket, disconnectSocket } from "./utils/socket";
import theme from "./theme";
import Layout from "./components/layout/Layout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/projects/Projects";
import CreateProject from "./pages/projects/CreateProject";
import JoinProject from "./pages/projects/JoinProject";
import ProjectDetails from "./pages/projects/ProjectDetails";
import Team from "./pages/Team";
import TeamDetails from "./pages/TeamDetails";
import Tasks from "./pages/tasks/Tasks";
import CreateTask from "./pages/tasks/CreateTask";
import TaskDetails from "./pages/tasks/TaskDetails";
import TasksKanban from "./pages/tasks/TasksKanban";
import TasksGantt from "./pages/tasks/TasksGantt";
import ProjectsKanban from "./pages/projects/ProjectsKanban";
import ProjectsGantt from "./pages/projects/ProjectsGantt";
import ProjectTasksKanban from "./pages/projects/ProjectTasksKanban";
import ProjectTasksGantt from "./pages/projects/ProjectTasksGantt";
import Landing from "./pages/landing/Landing";
import Privacy from "./pages/landing/Privacy";
import Terms from "./pages/landing/Terms";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Profile from "./pages/Profile";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <div>Loading...</div>;
  }
  console.log(isAuthenticated?"authenticated":"going to landing");
  return isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check if we have a token in localStorage
    const token = localStorage.getItem("token");
    if (token) {
      // If we have a token, try to load the user
      dispatch(loadUser());
      // Initialize socket connection
      connectSocket();
    }

    return () => {
      // Cleanup socket on unmount
      disconnectSocket();
    };
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router 
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          {/* Public routes */}
          <Route
            path="/"
            element={
              !isAuthenticated ? <Landing /> : <Navigate to="/dashboard" />
            }
          />
          
          <Route
            path="/login"
            element={
              !isAuthenticated ? <Login /> : <Navigate to="/dashboard" />
            }
          />
          <Route
            path="/register"
            element={
              !isAuthenticated ? <Register /> : <Navigate to="/dashboard" />
            }
          />
          <Route
            path="/forgot-password"
            element={
              !isAuthenticated ? <ForgotPassword /> : <Navigate to="/dashboard" />
            }
          />
          <Route
            path="/reset-password"
            element={
              !isAuthenticated ? <ResetPassword /> : <Navigate to="/dashboard" />
            }
          />
          
          <Route
            path="/privacy"
            element={
              !isAuthenticated ? <Privacy /> : <Navigate to="/dashboard" />
            }
          />
          <Route
            path="/terms"
            element={
              !isAuthenticated ? <Terms /> : <Navigate to="/dashboard" />
            }
          />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="team" element={<Team />} />
            <Route path="teams" element={<Team />} />
            <Route path="teams/:id" element={<TeamDetails />} />

            <Route path="projects">
              <Route index element={<Projects />} />
              <Route path="create" element={<CreateProject />} />
              <Route path="join" element={<JoinProject />} />
              <Route path="kanban" element={<ProjectsKanban />} />
              <Route path=":projectId" element={<ProjectDetails />} />
              <Route path=":projectId/kanban" element={<ProjectTasksKanban />} />
              <Route path=":projectId/gantt" element={<ProjectTasksGantt />} />
            </Route>

            <Route path="tasks">
              <Route index element={<Tasks />} />
              <Route path="create" element={<CreateTask />} />
              <Route path="kanban" element={<TasksKanban />} />
              <Route path="gantt" element={<TasksGantt />} />
              <Route path=":taskId" element={<TaskDetails />} />
            </Route>

            <Route path="profile" element={<Profile />} />
            
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
