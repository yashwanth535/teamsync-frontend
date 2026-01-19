import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { 
  Add as AddIcon, 
  Search as SearchIcon,
  ViewKanban as KanbanIcon,
} from "@mui/icons-material";
import { fetchProjects } from "../../store/slices/projectSlice";
import ProjectsKanban from "./ProjectsKanban";

const Projects = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { projects, loading, error } = useSelector((state) => state.projects);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showKanban, setShowKanban] = useState(true);

  useEffect(() => {
    // Fetch projects when navigating to /projects route
    if (location.pathname === "/projects" && !loading) {
      console.log("Fetching projects...");
      dispatch(fetchProjects());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]); // Re-fetch when route changes to /projects

  const filteredProjects = (projects || []).filter((project) => {
    if (!project) return false;
    const matchesSearch = 
      (project.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Projects</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate("/projects/create")}
        >
          Create Project
        </Button>
      </Box>

      {/* Kanban Board Section */}
      {showKanban && projects && projects.length > 0 && (
        <Box mb={4}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">Projects Kanban</Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setShowKanban(false)}
            >
              Hide Kanban
            </Button>
          </Box>
          <ProjectsKanban />
        </Box>
      )}

      {!showKanban && (
        <Button
          variant="outlined"
          startIcon={<KanbanIcon />}
          onClick={() => setShowKanban(true)}
          sx={{ mb: 3 }}
        >
          Show Kanban
        </Button>
      )}

      {/* Filters and Project List */}
      <Box mb={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">All Projects</Typography>
        </Box>
        
        <Box display="flex" gap={2} mb={3}>
          <TextField
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ flexGrow: 1, maxWidth: 400 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="archived">Archived</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {filteredProjects.length === 0 ? (
        <Box textAlign="center" py={5}>
          <Typography variant="h6" gutterBottom>
            {searchTerm || statusFilter !== "all" 
              ? "No Projects Match Your Filters" 
              : "No Projects Yet"}
          </Typography>
          <Typography color="text.secondary" paragraph>
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Create your first project to get started"}
          </Typography>
          {!searchTerm && statusFilter === "all" && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => navigate("/projects/create")}
              sx={{ mt: 2 }}
            >
              Create Project
            </Button>
          )}
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredProjects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project._id}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: 6,
                  }
                }}
                onClick={() => navigate(`/projects/${project._id}`)}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {project.title}
                  </Typography>
                  <Typography color="text.secondary" paragraph>
                    {project.description}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Chip
                      label={project.status}
                      color={
                        project.status === "active"
                          ? "success"
                          : project.status === "completed"
                          ? "primary"
                          : "default"
                      }
                    />
                    <Typography variant="body2" color="text.secondary">
                      {project.teams?.length || 0} teams
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Projects;
