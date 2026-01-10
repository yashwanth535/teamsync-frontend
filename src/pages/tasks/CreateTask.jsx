import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import { createTask } from "../../store/slices/taskSlice";
import { fetchProjects } from "../../store/slices/projectSlice";
import axios from "../../utils/axios";

const CreateTask = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const projectParam = searchParams.get("project");
  const { loading: projectsLoading, error: projectsError, projects } = useSelector(
    (state) => state.projects
  );
  const { loading: taskLoading, error: taskError } = useSelector(
    (state) => state.tasks
  );
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
    project: projectParam || "",
    team: "",
  });
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    dispatch(fetchProjects());
    loadTeams();
    if (projectParam) {
      setFormData(prev => ({ ...prev, project: projectParam }));
    }
  }, [dispatch, projectParam]);

  const loadTeams = async () => {
    try {
      const response = await axios.get("/team");
      setTeams(response.data || []);
    } catch (error) {
      console.error("Error loading teams:", error);
      setTeams([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(createTask(formData));
    if (projectParam) {
      navigate(`/projects/${projectParam}`);
    } else {
      navigate("/tasks");
    }
  };

  if (projectsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (projectsError) {
    return (
      <Box p={3}>
        <Alert severity="error">{projectsError}</Alert>
        <Button
          variant="contained"
          onClick={() => navigate("/tasks")}
          sx={{ mt: 2 }}
        >
          Back to Tasks
        </Button>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Create New Task
      </Typography>
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                multiline
                rows={4}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Status"
                name="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                required
              >
                <MenuItem value="todo">To Do</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="review">Review</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Priority"
                name="priority"
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                required
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Due Date"
                name="dueDate"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Project"
                name="project"
                value={formData.project}
                onChange={(e) =>
                  setFormData({ ...formData, project: e.target.value })
                }
                required
              >
                {projects?.map((project) => (
                  <MenuItem key={project._id} value={project._id}>
                    {project.title}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Team (Optional)"
                name="team"
                value={formData.team}
                onChange={(e) =>
                  setFormData({ ...formData, team: e.target.value })
                }
              >
                <MenuItem value="">No Team</MenuItem>
                {teams.map((team) => (
                  <MenuItem key={team._id} value={team._id}>
                    {team.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between">
                <Button
                  variant="outlined"
                  onClick={() => navigate("/tasks")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={taskLoading}
                >
                  {taskLoading ? <CircularProgress size={24} /> : "Create Task"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
      {taskError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {taskError}
        </Alert>
      )}
    </Box>
  );
};

export default CreateTask; 