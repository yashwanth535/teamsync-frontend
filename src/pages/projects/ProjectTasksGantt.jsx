import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Typography,
  Paper,
  Tooltip,
  CircularProgress,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Timeline as GanttIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addDays, subDays } from "date-fns";
import { fetchProjects } from "../../store/slices/projectSlice";
import { updateTask, createTask, deleteTask } from "../../store/slices/taskSlice";
import axios from "../../utils/axios";

const ProjectTasksGantt = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const { projects } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState([]);
  const [canEditStatus, setCanEditStatus] = useState({});
  const [dateRange, setDateRange] = useState({
    start: startOfWeek(new Date(), { weekStartsOn: 1 }),
    end: endOfWeek(addDays(new Date(), 14), { weekStartsOn: 1 }),
  });
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
      loadTasks();
    }
  }, [teams]);

  const days = eachDayOfInterval({ start: dateRange.start, end: dateRange.end });
  const cellWidth = 120;
  const rowHeight = 60;

  const getTaskPosition = (task) => {
    if (!task.dueDate && !task.createdAt) return null;
    
    const startDate = task.createdAt ? new Date(task.createdAt) : new Date();
    const endDate = task.dueDate ? new Date(task.dueDate) : addDays(startDate, 7);
    
    const startIndex = days.findIndex((day) => isSameDay(day, startDate) || day > startDate);
    const endIndex = days.findIndex((day) => isSameDay(day, endDate) || day > endDate);
    
    if (startIndex === -1 || endIndex === -1) return null;
    
    const left = startIndex * cellWidth;
    const width = Math.max((endIndex - startIndex) * cellWidth, cellWidth);
    
    return { left, width, startDate, endDate };
  };

  const priorityColors = {
    low: "#4caf50",
    medium: "#ff9800",
    high: "#f44336",
  };

  const statusColors = {
    todo: "#e3f2fd",
    in_progress: "#fff3e0",
    review: "#f3e5f5",
    done: "#e8f5e9",
  };

  const handlePreviousWeek = () => {
    setDateRange({
      start: subDays(dateRange.start, 7),
      end: subDays(dateRange.end, 7),
    });
  };

  const handleNextWeek = () => {
    setDateRange({
      start: addDays(dateRange.start, 7),
      end: addDays(dateRange.end, 7),
    });
  };

  const handleToday = () => {
    setDateRange({
      start: startOfWeek(new Date(), { weekStartsOn: 1 }),
      end: endOfWeek(addDays(new Date(), 14), { weekStartsOn: 1 }),
    });
  };

  const handleStatusChange = async (taskId, newStatus) => {
    const task = tasks.find(t => t._id === taskId);
    if (!task) return;

    if (!canEditStatus[taskId]) {
      alert("Only team lead can change task status");
      return;
    }

    try {
      await dispatch(
        updateTask({
          id: taskId,
          ...task,
          status: newStatus,
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
          <GanttIcon sx={{ fontSize: 32 }} />
          <Typography variant="h4">Project Tasks Gantt Chart</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="outlined" onClick={handlePreviousWeek}>
            Previous
          </Button>
          <Button variant="outlined" onClick={handleToday}>
            Today
          </Button>
          <Button variant="outlined" onClick={handleNextWeek}>
            Next
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Task
          </Button>
        </Box>
      </Box>

      <Paper sx={{ overflowX: "auto", p: 2 }}>
        <Box sx={{ minWidth: days.length * cellWidth }}>
          {/* Header with dates */}
          <Box sx={{ display: "flex", borderBottom: 2, borderColor: "divider", mb: 1 }}>
            <Box sx={{ width: 250, p: 1, borderRight: 1, borderColor: "divider", fontWeight: "bold" }}>
              Task
            </Box>
            <Box sx={{ display: "flex", flex: 1 }}>
              {days.map((day, index) => (
                <Box
                  key={index}
                  sx={{
                    width: cellWidth,
                    p: 1,
                    textAlign: "center",
                    borderRight: 1,
                    borderColor: "divider",
                    backgroundColor: isSameDay(day, new Date()) ? "#e3f2fd" : "transparent",
                  }}
                >
                  <Typography variant="caption" display="block">
                    {format(day, "EEE")}
                  </Typography>
                  <Typography variant="caption" display="block">
                    {format(day, "MMM d")}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Task rows */}
          <Box>
            {tasks.length === 0 ? (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography color="text.secondary">No tasks found</Typography>
              </Box>
            ) : (
              tasks.map((task, taskIndex) => {
                const position = getTaskPosition(task);
                const canEdit = canEditStatus[task._id] || false;
                return (
                  <Box
                    key={task._id}
                    sx={{
                      display: "flex",
                      borderBottom: 1,
                      borderColor: "divider",
                      minHeight: rowHeight,
                      position: "relative",
                    }}
                  >
                    {/* Task name column */}
                    <Box
                      sx={{
                        width: 250,
                        p: 1,
                        borderRight: 1,
                        borderColor: "divider",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        {task.title}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                        {task.team && (
                          <Chip label={task.team.name || "Team"} size="small" />
                        )}
                        <Select
                          value={task.status}
                          onChange={(e) => handleStatusChange(task._id, e.target.value)}
                          size="small"
                          disabled={!canEdit}
                          sx={{ height: 24, fontSize: "0.75rem" }}
                        >
                          <MenuItem value="todo">To Do</MenuItem>
                          <MenuItem value="in_progress">In Progress</MenuItem>
                          <MenuItem value="review">Review</MenuItem>
                          <MenuItem value="done">Done</MenuItem>
                        </Select>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(task)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      {!canEdit && (
                        <Typography variant="caption" color="text.secondary">
                          Only team lead can change status
                        </Typography>
                      )}
                    </Box>

                    {/* Timeline area */}
                    <Box
                      sx={{
                        flex: 1,
                        position: "relative",
                        minHeight: rowHeight,
                      }}
                    >
                      {position && (
                        <Tooltip
                          title={
                            <Box>
                              <Typography variant="caption" display="block">
                                {task.title}
                              </Typography>
                              <Typography variant="caption" display="block">
                                Start: {format(position.startDate, "MMM d, yyyy")}
                              </Typography>
                              <Typography variant="caption" display="block">
                                End: {format(position.endDate, "MMM d, yyyy")}
                              </Typography>
                              <Typography variant="caption" display="block">
                                Status: {task.status}
                              </Typography>
                              <Typography variant="caption" display="block">
                                Priority: {task.priority}
                              </Typography>
                              {task.team && (
                                <Typography variant="caption" display="block">
                                  Team: {task.team.name}
                                </Typography>
                              )}
                            </Box>
                          }
                        >
                          <Box
                            sx={{
                              position: "absolute",
                              left: position.left,
                              width: position.width,
                              height: rowHeight - 8,
                              top: 4,
                              backgroundColor: statusColors[task.status] || statusColors.todo,
                              border: `2px solid ${priorityColors[task.priority] || priorityColors.medium}`,
                              borderRadius: 1,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              opacity: canEdit ? 1 : 0.7,
                              "&:hover": {
                                opacity: 0.8,
                                transform: canEdit ? "scale(1.02)" : "none",
                              },
                            }}
                            onClick={() => handleOpenDialog(task)}
                          >
                            <Typography variant="caption" sx={{ fontWeight: "bold", px: 1 }}>
                              {task.title.substring(0, Math.floor(position.width / 10))}
                              {task.title.length > Math.floor(position.width / 10) ? "..." : ""}
                            </Typography>
                          </Box>
                        </Tooltip>
                      )}
                    </Box>
                  </Box>
                );
              })
            )}
          </Box>
        </Box>
      </Paper>

      {/* Legend */}
      <Box sx={{ mt: 3, p: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
          Legend
        </Typography>
        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                backgroundColor: statusColors.todo,
                border: `2px solid ${priorityColors.medium}`,
                borderRadius: 1,
              }}
            />
            <Typography variant="caption">To Do</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                backgroundColor: statusColors.in_progress,
                border: `2px solid ${priorityColors.medium}`,
                borderRadius: 1,
              }}
            />
            <Typography variant="caption">In Progress</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                backgroundColor: statusColors.review,
                border: `2px solid ${priorityColors.medium}`,
                borderRadius: 1,
              }}
            />
            <Typography variant="caption">Review</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                backgroundColor: statusColors.done,
                border: `2px solid ${priorityColors.medium}`,
                borderRadius: 1,
              }}
            />
            <Typography variant="caption">Done</Typography>
          </Box>
        </Box>
      </Box>

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

export default ProjectTasksGantt;

