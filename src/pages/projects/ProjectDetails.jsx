import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Snackbar,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
  PersonRemove as PersonRemoveIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from "@mui/icons-material";
import {
  fetchProjectById,
  updateProject,
  deleteProject,
  addTeamToProject,
  removeTeamFromProject,
} from "../../store/slices/projectSlice";
import { loadUser, refreshToken } from "../../store/slices/authSlice";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProject, loading, error } = useSelector((state) => state.projects);
  const { user, isAuthenticated, token } = useSelector((state) => state.auth);
  const { teams } = useSelector((state) => state.team);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addTeamDialogOpen, setAddTeamDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
  });
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedRole, setSelectedRole] = useState("contributor");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      
      if (!storedToken) {
        navigate("/login");
        return;
      }

      if (!isAuthenticated) {
        try {
          await dispatch(loadUser()).unwrap();
        } catch (error) {
          try {
            await dispatch(refreshToken()).unwrap();
            await dispatch(loadUser()).unwrap();
          } catch (refreshError) {
            navigate("/login");
            return;
          }
        }
      }

      if (projectId) {
        console.log("Fetching project with ID:", projectId);
        dispatch(fetchProjectById(projectId));
      } else {
        navigate("/projects");
      }
    };

    initializeAuth();
  }, [dispatch, projectId, navigate, isAuthenticated]);

  useEffect(() => {
    if (currentProject) {
      console.log("Current project updated:", currentProject);
      setFormData({
        title: currentProject.title || "",
        description: currentProject.description || "",
        status: currentProject.status || "",
      });
    }
  }, [currentProject]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/projects")}
          sx={{ mt: 2 }}
        >
          Back to Projects
        </Button>
      </Box>
    );
  }

  if (!currentProject) {
    return (
      <Box p={3}>
        <Alert severity="warning">Project not found</Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/projects")}
          sx={{ mt: 2 }}
        >
          Back to Projects
        </Button>
      </Box>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProject = async () => {
    try {
      await dispatch(updateProject({ id: projectId, ...formData })).unwrap();
      setEditDialogOpen(false);
      setSnackbar({
        open: true,
        message: "Project updated successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to update project",
        severity: "error",
      });
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await dispatch(deleteProject(projectId)).unwrap();
        navigate("/projects");
      } catch (error) {
        setSnackbar({
          open: true,
          message: error.message || "Failed to delete project",
          severity: "error",
        });
      }
    }
  };

  const handleAddTeam = async () => {
    if (!selectedTeam) return;

    try {
      await dispatch(
        addTeamToProject({
          projectId,
          teamId: selectedTeam,
          role: selectedRole,
        })
      ).unwrap();
      setAddTeamDialogOpen(false);
      setSelectedTeam("");
      setSelectedRole("contributor");
      setSnackbar({
        open: true,
        message: "Team added successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to add team",
        severity: "error",
      });
    }
  };

  const handleRemoveTeam = async (teamId) => {
    try {
      await dispatch(
        removeTeamFromProject({
          projectId,
          teamId,
        })
      ).unwrap();
      setSnackbar({
        open: true,
        message: "Team removed successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to remove team",
        severity: "error",
      });
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">{currentProject.title}</Typography>
        {user?._id === currentProject.owner?._id && (
          <Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={() => setEditDialogOpen(true)}
              sx={{ mr: 1 }}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteProject}
            >
              Delete
            </Button>
          </Box>
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography paragraph>{currentProject.description}</Typography>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Teams</Typography>
              {user?._id === currentProject.owner?._id && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setAddTeamDialogOpen(true)}
                >
                  Add Team
                </Button>
              )}
            </Box>
            <List>
              {currentProject.teams?.filter(team => team?.team)?.map((team) => (
                <ListItem
                  key={team.team._id}
                  secondaryAction={
                    user?._id === currentProject.owner?._id && (
                      <IconButton
                        edge="end"
                        aria-label="remove"
                        onClick={() => handleRemoveTeam(team.team._id)}
                      >
                        <RemoveIcon />
                      </IconButton>
                    )
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      <PersonAddIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={team.team?.name || "Unknown Team"}
                    secondary={`Role: ${team.role || "contributor"}`}
                  />
                </ListItem>
              ))}
              {(!currentProject.teams || currentProject.teams.length === 0) && (
                <ListItem>
                  <ListItemText primary="No teams assigned to this project" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Project Details
            </Typography>
            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary">
                Status
              </Typography>
              <Chip
                label={currentProject.status}
                color={
                  currentProject.status === "active"
                    ? "success"
                    : currentProject.status === "completed"
                    ? "primary"
                    : "default"
                }
              />
            </Box>
            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary">
                Owner
              </Typography>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ mr: 1 }}>
                  <PersonAddIcon />
                </Avatar>
                <Typography>{currentProject.owner?.name}</Typography>
              </Box>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Created At
              </Typography>
              <Typography>
                {new Date(currentProject.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Project</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={4}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              label="Status"
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="archived">Archived</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateProject} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Team Dialog */}
      <Dialog open={addTeamDialogOpen} onClose={() => setAddTeamDialogOpen(false)}>
        <DialogTitle>Add Team to Project</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Team</InputLabel>
            <Select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              label="Team"
            >
              {teams?.map((team) => (
                <MenuItem key={team._id} value={team._id}>
                  {team.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              label="Role"
            >
              <MenuItem value="lead">Lead</MenuItem>
              <MenuItem value="contributor">Contributor</MenuItem>
              <MenuItem value="viewer">Viewer</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddTeamDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddTeam} variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProjectDetails;
