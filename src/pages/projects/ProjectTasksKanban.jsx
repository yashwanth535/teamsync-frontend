import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ViewKanban as KanbanIcon,
} from "@mui/icons-material";
import { updateTask, createTask, deleteTask } from "../../store/slices/taskSlice";
import { fetchProjects } from "../../store/slices/projectSlice";
import axios from "../../utils/axios";

const ProjectTasksKanban = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const { projects } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    team: "",
    dueDate: "",
  });
  const [teams, setTeams] = useState([]);
  const [canEditStatus, setCanEditStatus] = useState({});

  useEffect(() => {
    dispatch(fetchProjects());
    loadTeams();
    loadTasks();
  }, [dispatch, projectId]);

  const loadTeams = async () => {
    try {
      const response = await axios.get("/team");
      setTeams(response.data || []);
    } catch (error) {
      console.error("Error loading teams:", error);
      setTeams([]);
    }
  };

  const loadTasks = async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const response = await axios.get(`/tasks/project/${projectId}`);
      const tasksData = response.data || [];
      setTasks(tasksData);
      
      // Check which tasks user can edit status for
      const editPermissions = {};
      for (const task of tasksData) {
        if (task.team) {
          const team = teams.find(t => (t._id || t).toString() === (task.team._id || task.team).toString());
          if (team) {
            const isTeamLead = team.members?.some(
              member => 
                (member.user._id || member.user).toString() === (user._id || user.id).toString() &&
                member.role === "lead"
            );
            editPermissions[task._id] = isTeamLead;
          }
        } else {
          // If no team, check if user is project owner
          const project = projects.find(p => p._id === projectId);
          editPermissions[task._id] = project?.owner?._id?.toString() === (user._id || user.id).toString();
        }
      }
      setCanEditStatus(editPermissions);
    } catch (error) {
      console.error("Error loading tasks:", error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (teams.length > 0 && tasks.length > 0) {
      loadTasks(); // Reload to update permissions
    }
  }, [teams]);

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
        team: task.team?._id || task.team || "",
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        team: "",
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
      const taskData = {
        ...formData,
        project: projectId,
      };
      
      if (editingTask) {
        await dispatch(updateTask({ id: editingTask._id, ...taskData })).unwrap();
      } else {
        await dispatch(createTask(taskData)).unwrap();
      }
      handleCloseDialog();
      loadTasks();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await dispatch(deleteTask(taskId)).unwrap();
        loadTasks();
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

    const task = tasks.find((t) => t._id === draggableId);
    if (!task) return;

    // Check if user can edit this task's status
    if (!canEditStatus[task._id]) {
      alert("Only team lead can change task status");
      return;
    }

    try {
      await dispatch(
        updateTask({
          id: task._id,
          ...task,
          status: destination.droppableId,
        })
      ).unwrap();
      loadTasks();
    } catch (error) {
      console.error("Error updating task status:", error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      }
    }
  };

  const groupedTasks = tasks.reduce((acc, task) => {
    const status = task.status || "todo";
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(task);
    return acc;
  }, {});

  if (loading && tasks.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <KanbanIcon sx={{ fontSize: 32 }} />
          <Typography variant="h4">Project Tasks Kanban</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Task
        </Button>
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
                    {(groupedTasks[status] || []).map((task, index) => {
                      const canEdit = canEditStatus[task._id] || false;
                      return (
                        <Draggable 
                          key={task._id} 
                          draggableId={task._id} 
                          index={index}
                          isDragDisabled={!canEdit}
                        >
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{
                                mb: 1,
                                cursor: canEdit ? "pointer" : "not-allowed",
                                backgroundColor: snapshot.isDragging ? "#fff" : "white",
                                boxShadow: snapshot.isDragging ? 4 : 1,
                                opacity: canEdit ? 1 : 0.7,
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
                                  {task.team && (
                                    <Chip
                                      label={task.team.name || "Team"}
                                      size="small"
                                      variant="outlined"
                                    />
                                  )}
                                  {task.dueDate && (
                                    <Chip
                                      label={new Date(task.dueDate).toLocaleDateString()}
                                      size="small"
                                      variant="outlined"
                                    />
                                  )}
                                </Box>
                                {!canEdit && (
                                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                                    Only team lead can change status
                                  </Typography>
                                )}
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      );
                    })}
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
              value={formData.team}
              onChange={(e) => setFormData({ ...formData, team: e.target.value })}
              margin="normal"
            >
              <MenuItem value="">No Team</MenuItem>
              {teams.map((team) => (
                <MenuItem key={team._id} value={team._id}>
                  {team.name}
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

export default ProjectTasksKanban;

