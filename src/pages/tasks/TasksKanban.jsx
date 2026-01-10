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
} from "@mui/icons-material";
import { fetchTasks, updateTask, createTask, deleteTask } from "../../store/slices/taskSlice";
import { fetchProjects } from "../../store/slices/projectSlice";
import axios from "../../utils/axios";

const TasksKanban = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { tasks, loading } = useSelector((state) => state.tasks);
  const { projects } = useSelector((state) => state.projects);
  const [allTasks, setAllTasks] = useState([]);
  const projectParam = searchParams.get("project");
  const [selectedProject, setSelectedProject] = useState(projectParam || "all");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    project: "",
    dueDate: "",
  });

  useEffect(() => {
    dispatch(fetchProjects());
    loadAllTasks();
  }, [dispatch, selectedProject]);

  const loadAllTasks = async () => {
    try {
      let response;
      if (selectedProject === "all") {
        // Fetch all tasks from all projects
        const allProjectsTasks = [];
        for (const project of projects) {
          try {
            const taskResponse = await axios.get(`/tasks/project/${project._id}`);
            if (taskResponse.data) {
              allProjectsTasks.push(...taskResponse.data);
            }
          } catch (err) {
            console.error(`Error fetching tasks for project ${project._id}:`, err);
          }
        }
        setAllTasks(allProjectsTasks);
      } else {
        response = await axios.get(`/tasks/project/${selectedProject}`);
        setAllTasks(response.data || []);
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
      setAllTasks([]);
    }
  };

  useEffect(() => {
    loadAllTasks();
  }, [projects, selectedProject]);

  const statusColumns = {
    todo: { title: "To Do", color: "#e3f2fd" },
    in_progress: { title: "In Progress", color: "#fff3e0" },
    review: { title: "Review", color: "#f3e5f5" },
    done: { title: "Done", color: "#e8f5e9" },
  };

  const priorityColors = {
    low: "#4caf50",
    medium: "#ff9800",
    high: "#f44336",
  };

  const handleOpenDialog = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "todo",
        priority: task.priority || "medium",
        project: task.project?._id || task.project || "",
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        project: selectedProject !== "all" ? selectedProject : "",
        dueDate: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTask(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await dispatch(updateTask({ id: editingTask._id, ...formData })).unwrap();
      } else {
        await dispatch(createTask(formData)).unwrap();
      }
      handleCloseDialog();
      loadAllTasks();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await dispatch(deleteTask(taskId)).unwrap();
        loadAllTasks();
      } catch (error) {
        console.error("Error deleting task:", error);
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

    const task = allTasks.find((t) => t._id === draggableId);
    if (task) {
      try {
        await dispatch(
          updateTask({
            id: task._id,
            ...task,
            status: destination.droppableId,
          })
        ).unwrap();
        loadAllTasks();
      } catch (error) {
        console.error("Error updating task status:", error);
      }
    }
  };

  const groupedTasks = allTasks.reduce((acc, task) => {
    const status = task.status || "todo";
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(task);
    return acc;
  }, {});

  if (loading && allTasks.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <ViewToggle basePath="/tasks" showKanban={true} showGantt={true} />
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <KanbanIcon sx={{ fontSize: 32 }} />
          <Typography variant="h4">Tasks Kanban Board</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            size="small"
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="all">All Projects</MenuItem>
            {projects.map((project) => (
              <MenuItem key={project._id} value={project._id}>
                {project.title}
              </MenuItem>
            ))}
          </Select>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Task
          </Button>
        </Box>
      </Box>

      <DragDropContext onDragEnd={onDragEnd}>
        <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 2 }}>
          {Object.entries(statusColumns).map(([status, { title, color }]) => (
            <Paper
              key={status}
              sx={{
                minWidth: 300,
                width: 300,
                p: 2,
                backgroundColor: color,
                display: "flex",
                flexDirection: "column",
                maxHeight: "calc(100vh - 200px)",
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                {title} ({groupedTasks[status]?.length || 0})
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
                    {(groupedTasks[status] || []).map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
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
                                  {task.title}
                                </Typography>
                                <Box>
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenDialog(task);
                                    }}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(task._id);
                                    }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              </Box>
                              {task.description && (
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                  {task.description.substring(0, 50)}
                                  {task.description.length > 50 ? "..." : ""}
                                </Typography>
                              )}
                              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
                                <Chip
                                  label={task.priority || "medium"}
                                  size="small"
                                  sx={{
                                    backgroundColor: priorityColors[task.priority] || priorityColors.medium,
                                    color: "white",
                                    fontSize: "0.7rem",
                                  }}
                                />
                                {task.dueDate && (
                                  <Chip
                                    label={new Date(task.dueDate).toLocaleDateString()}
                                    size="small"
                                    variant="outlined"
                                  />
                                )}
                              </Box>
                              {task.assignedTo && (
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                                  Assigned to: {task.assignedTo.name || task.assignedTo.email}
                                </Typography>
                              )}
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
        <DialogTitle>{editingTask ? "Edit Task" : "Create New Task"}</DialogTitle>
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
              <MenuItem value="todo">To Do</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="review">Review</MenuItem>
              <MenuItem value="done">Done</MenuItem>
            </Select>
            <Select
              fullWidth
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              margin="normal"
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
            <Select
              fullWidth
              value={formData.project}
              onChange={(e) => setFormData({ ...formData, project: e.target.value })}
              margin="normal"
              required
            >
              {projects.map((project) => (
                <MenuItem key={project._id} value={project._id}>
                  {project.title}
                </MenuItem>
              ))}
            </Select>
            <TextField
              fullWidth
              type="date"
              label="Due Date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingTask ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default TasksKanban;

