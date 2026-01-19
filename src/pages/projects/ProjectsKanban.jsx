import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Paper,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ViewKanban as KanbanIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { fetchProjects, updateProject, deleteProject } from "../../store/slices/projectSlice";
import ViewToggle from "../../components/charts/ViewToggle";

const ProjectsKanban = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { projects, loading } = useSelector((state) => state.projects);
  const projectParam = searchParams.get("project");

  const [openDialog, setOpenDialog] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "active",
  });

  // Don't fetch here - Projects component already fetches
  // useEffect(() => {
  //   dispatch(fetchProjects());
  // }, [dispatch]);

  // Filter projects if project param is provided
  const filteredProjects = projectParam && projects
    ? projects.filter((p) => p._id === projectParam)
    : (projects || []);

  const statusColumns = {
    active: { title: "Active", color: "#e8f5e9" },
    completed: { title: "Completed", color: "#e3f2fd" },
    archived: { title: "Archived", color: "#fafafa" },
  };

  const handleOpenDialog = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title || "",
        description: project.description || "",
        status: project.status || "active",
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: "",
        description: "",
        status: "active",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProject(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await dispatch(updateProject({ id: editingProject._id, ...formData })).unwrap();
      }
      handleCloseDialog();
      // Don't refetch - createProject/updateProject already updates Redux state
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  const handleDelete = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await dispatch(deleteProject(projectId)).unwrap();
        // Don't refetch - deleteProject already updates Redux state
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const project = projects.find((p) => p._id === draggableId);
    if (project) {
      try {
        await dispatch(
          updateProject({
            id: project._id,
            ...project,
            status: destination.droppableId,
          })
        ).unwrap();
        // Don't refetch - updateProject already updates Redux state
      } catch (error) {
        console.error("Error updating project status:", error);
      }
    }
  };

  const groupedProjects = filteredProjects.reduce((acc, project) => {
    const status = project.status || "active";
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(project);
    return acc;
  }, {});

  if (loading && projects.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <ViewToggle basePath="/projects" showKanban={true} showGantt={true} />
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <KanbanIcon sx={{ fontSize: 32 }} />
          <Typography variant="h4">Projects Kanban Board</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/projects/create")}
        >
          Create Project
        </Button>
      </Box>

      <DragDropContext onDragEnd={onDragEnd}>
        <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 2 }}>
          {Object.entries(statusColumns).map(([status, { title, color }]) => (
            <Paper
              key={status}
              sx={{
                minWidth: 350,
                width: 350,
                p: 2,
                backgroundColor: color,
                display: "flex",
                flexDirection: "column",
                maxHeight: "calc(100vh - 200px)",
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                {title} ({groupedProjects[status]?.length || 0})
              </Typography>
              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      flexGrow: 1,
                      minHeight: 100,
                      backgroundColor: snapshot.isDraggingOver ? "rgba(0,0,0,0.1)" : "transparent",
                      borderRadius: 1,
                      p: 1,
                      overflowY: "auto",
                    }}
                  >
                    {(groupedProjects[status] || []).map((project, index) => (
                      <Draggable key={project._id} draggableId={project._id} index={index}>
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              mb: 1,
                              cursor: "pointer",
                              backgroundColor: snapshot.isDragging ? "#fff" : "white",
                              boxShadow: snapshot.isDragging ? 4 : 1,
                            }}
                          >
                            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                  {project.title}
                                </Typography>
                                <Box>
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(`/projects/${project._id}`);
                                    }}
                                  >
                                    <ViewIcon fontSize="small" />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenDialog(project);
                                    }}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(project._id);
                                    }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              </Box>
                              {project.description && (
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                  {project.description.substring(0, 100)}
                                  {project.description.length > 100 ? "..." : ""}
                                </Typography>
                              )}
                              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
                                <Chip
                                  label={project.status || "active"}
                                  size="small"
                                  color={
                                    project.status === "active"
                                      ? "success"
                                      : project.status === "completed"
                                      ? "primary"
                                      : "default"
                                  }
                                />
                                <Chip
                                  label={`${project.teams?.length || 0} teams`}
                                  size="small"
                                  variant="outlined"
                                />
                                <Chip
                                  label={`${project.tasks?.length || 0} tasks`}
                                  size="small"
                                  variant="outlined"
                                />
                              </Box>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Paper>
          ))}
        </Box>
      </DragDropContext>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Project</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              multiline
              rows={3}
            />
            <Select
              fullWidth
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              margin="normal"
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="archived">Archived</MenuItem>
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              Update
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ProjectsKanban;

