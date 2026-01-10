import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Paper,
  Select,
  MenuItem,
  Tooltip,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import {
  Add as AddIcon,
  Timeline as GanttIcon,
} from "@mui/icons-material";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addDays, subDays } from "date-fns";
import { fetchProjects } from "../../store/slices/projectSlice";
import axios from "../../utils/axios";
import ViewToggle from "../../components/charts/ViewToggle";

const TasksGantt = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { projects } = useSelector((state) => state.projects);
  const [allTasks, setAllTasks] = useState([]);
  const projectParam = searchParams.get("project");
  const [selectedProject, setSelectedProject] = useState(projectParam || "all");
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: startOfWeek(new Date(), { weekStartsOn: 1 }),
    end: endOfWeek(addDays(new Date(), 14), { weekStartsOn: 1 }),
  });

  useEffect(() => {
    dispatch(fetchProjects());
    loadAllTasks();
  }, [dispatch, selectedProject]);

  const loadAllTasks = async () => {
    setLoading(true);
    try {
      let tasks = [];
      if (selectedProject === "all") {
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
        tasks = allProjectsTasks;
      } else {
        const response = await axios.get(`/tasks/project/${selectedProject}`);
        tasks = response.data || [];
      }
      setAllTasks(tasks);
    } catch (error) {
      console.error("Error loading tasks:", error);
      setAllTasks([]);
    } finally {
      setLoading(false);
    }
  };

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
          <GanttIcon sx={{ fontSize: 32 }} />
          <Typography variant="h4">Tasks Gantt Chart</Typography>
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
            onClick={() => window.location.href = "/tasks/create"}
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
            {allTasks.length === 0 ? (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography color="text.secondary">No tasks found</Typography>
              </Box>
            ) : (
              allTasks.map((task, taskIndex) => {
                const position = getTaskPosition(task);
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
                      <Typography variant="caption" color="text.secondary">
                        {task.project?.title || "No project"}
                      </Typography>
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
                              "&:hover": {
                                opacity: 0.8,
                                transform: "scale(1.02)",
                              },
                            }}
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                backgroundColor: "#fff",
                border: `2px solid ${priorityColors.low}`,
                borderRadius: 1,
              }}
            />
            <Typography variant="caption">Low Priority</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                backgroundColor: "#fff",
                border: `2px solid ${priorityColors.medium}`,
                borderRadius: 1,
              }}
            />
            <Typography variant="caption">Medium Priority</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                backgroundColor: "#fff",
                border: `2px solid ${priorityColors.high}`,
                borderRadius: 1,
              }}
            />
            <Typography variant="caption">High Priority</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TasksGantt;

