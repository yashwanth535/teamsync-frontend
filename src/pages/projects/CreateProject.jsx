import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Alert,
  CircularProgress,
  Divider,
  useTheme,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import {
  Add as AddIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Group as GroupIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { createProject, clearError } from "../../store/slices/projectSlice";
import { fetchTeams } from "../../store/slices/teamSlice";
import { toast } from "react-toastify";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
}));

const CreateProject = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading: projectLoading, error: projectError } = useSelector((state) => state.projects);
  const { teams, loading: teamsLoading, error: teamsError } = useSelector((state) => state.team);
  const [openMemberDialog, setOpenMemberDialog] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "Medium",
    status: "active",
    teams: [],
  });

  useEffect(() => {
    dispatch(fetchTeams());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTeamChange = (event) => {
    const {
      target: { value },
    } = event;
    setFormData((prev) => ({
      ...prev,
      teams: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleAddMember = () => {
    if (newMemberEmail && !formData.teams.includes(newMemberEmail)) {
      setFormData({
        ...formData,
        teams: [...formData.teams, newMemberEmail],
      });
      setNewMemberEmail("");
    }
  };

  const handleRemoveMember = (memberId) => {
    if (memberId === user?.id) {
      return; // Prevent removing the owner
    }
    setFormData({
      ...formData,
      teams: formData.teams.filter((id) => id !== memberId),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Clear any previous errors
      dispatch(clearError());

      // Format the deadline if provided
      const projectData = {
        ...formData,
        deadline: formData.deadline
          ? new Date(formData.deadline).toISOString()
          : undefined,
      };

      const result = await dispatch(createProject(projectData)).unwrap();

      if (!result) {
        throw new Error("No result received from server");
      }

      toast.success("Project created successfully!");
      navigate("/projects");
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error(error.message || "Failed to create project");
    }
  };

  if (teamsLoading) {
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

  if (teamsError) {
    return (
      <Box p={3}>
        <Alert severity="error">{teamsError}</Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <StyledPaper>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Project
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Create a new project and assign teams to it. Team members will automatically have access to the project based on their team's role.
        </Typography>

        {projectError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {projectError}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Project Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                variant="outlined"
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Deadline"
                name="deadline"
                type="datetime-local"
                value={formData.deadline}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                variant="outlined"
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
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
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Teams</InputLabel>
                <Select
                  multiple
                  value={formData.teams}
                  onChange={handleTeamChange}
                  label="Teams"
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={
                            teams.find((team) => team._id === value)?.name || value
                          }
                        />
                      ))}
                    </Box>
                  )}
                >
                  {teams?.map((team) => (
                    <MenuItem key={team._id} value={team._id}>
                      {team.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/projects")}
                  disabled={projectLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={projectLoading}
                  startIcon={projectLoading ? <CircularProgress size={20} /> : null}
                >
                  Create Project
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </StyledPaper>

      {/* Add Member Dialog */}
      <Dialog
        open={openMemberDialog}
        onClose={() => setOpenMemberDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Team Member</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Member Email"
            type="email"
            fullWidth
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMemberDialog(false)}>Cancel</Button>
          <Button
            onClick={() => {
              handleAddMember();
              setOpenMemberDialog(false);
            }}
            variant="contained"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CreateProject;
