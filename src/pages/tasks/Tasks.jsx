import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import {
  createTask,
  updateTask,
  deleteTask,
} from "../../store/slices/taskSlice";
import { fetchProjects } from "../../store/slices/projectSlice";
import axios from "../../utils/axios";

const Tasks = () => {
  const dispatch = useDispatch();
  const tasksState = useSelector((state) => state.tasks);
  const { projects } = useSelector((state) => state.projects);
  const tasks = tasksState?.tasks || [];
  const loading = tasksState?.loading || false;

  const [openDialog, setOpenDialog] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [allTasks, setAllTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    projectId: "",
    assignedTo: "",
    dueDate: "",
  });

  // Load all tasks from all projects
  const loadAllTasks = async () => {
    try {
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
    } catch (error) {
      console.error("Error loading tasks:", error);
      setAllTasks([]);
    }
  };

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    if (projects.length > 0) {
      loadAllTasks();
    }
  }, [projects]);

  // Group tasks by status
  const groupedTasks = allTasks.reduce((acc, task) => {
    const status = task.status || "todo";
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(task);
    return acc;
  }, {});

  const statusColumns = {
    todo: { title: "To Do", color: "#e3f2fd" },
    in_progress: { title: "In Progress", color: "#fff3e0" },
    review: { title: "Review", color: "#f3e5f5" },
    done: { title: "Done", color: "#e8f5e9" },
  };

  const handleOpenDialog = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        projectId: task.project?._id || task.project || "",
        assignedTo: task.assignedTo?._id || task.assignedTo || "",
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        projectId: "",
        assignedTo: "",
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
      loadAllTasks(); // Reload tasks after create/update
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await dispatch(deleteTask(taskId)).unwrap();
        loadAllTasks(); // Reload tasks after delete
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
        loadAllTasks(); // Reload tasks after status update
      } catch (error) {
        console.error("Error updating task status:", error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Tasks</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Task
        </Button>
      </Box>

      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container spacing={3}>
          {Object.entries(statusColumns).map(([status, { title, color }]) => (
            <Grid item xs={12} md={4} key={status}>
              <Paper
                sx={{
                  p: 2,
                  backgroundColor: alpha(color, 0.1),
                  minHeight: "500px",
                }}
              >
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {title}
                </Typography>
                <Droppable droppableId={status}>
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      sx={{ minHeight: "400px" }}
                    >
                      {(groupedTasks[status] || []).map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                        >
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{ mb: 2 }}
                            >
                              <CardContent>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Typography variant="h6">
                                    {task.title}
                                  </Typography>
                                  <Box>
                                    <IconButton
                                      onClick={() => handleOpenDialog(task)}
                                    >
                                      <EditIcon />
                                    </IconButton>
                                    <IconButton
                                      onClick={() => handleDelete(task._id)}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </Box>
                                </Box>
                                <Typography color="textSecondary" gutterBottom>
                                  {task.description}
                                </Typography>
                                <Typography variant="body2">
                                  Priority: {task.priority}
                                </Typography>
                                <Typography variant="body2">
                                  Due:{" "}
                                  {new Date(task.dueDate).toLocaleDateString()}
                                </Typography>
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
            </Grid>
          ))}
        </Grid>
      </DragDropContext>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {editingTask ? "Edit Task" : "Create New Task"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            margin="normal"
            multiline
            rows={4}
          />
          <Select
            fullWidth
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
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
            onChange={(e) =>
              setFormData({ ...formData, priority: e.target.value })
            }
            margin="normal"
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </Select>
          <Select
            fullWidth
            value={formData.projectId}
            onChange={(e) =>
              setFormData({ ...formData, projectId: e.target.value })
            }
            margin="normal"
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
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingTask ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Tasks; 