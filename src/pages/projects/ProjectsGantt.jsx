import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Paper,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Timeline as GanttIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addDays, subDays } from "date-fns";
import { fetchProjects } from "../../store/slices/projectSlice";
import axios from "../../utils/axios";
import ViewToggle from "../../components/charts/ViewToggle";

const ProjectsGantt = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { projects, loading } = useSelector((state) => state.projects);
  const projectParam = searchParams.get("project");
  const [projectTasks, setProjectTasks] = useState({});
  const [dateRange, setDateRange] = useState({
    start: startOfWeek(new Date(), { weekStartsOn: 1 }),
    end: endOfWeek(addDays(new Date(), 30), { weekStartsOn: 1 }),
  });

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    loadProjectTasks();
  }, [projects]);

  // Filter projects if project param is provided
  const filteredProjects = projectParam
    ? projects.filter((p) => p._id === projectParam)
    : projects;

  const loadProjectTasks = async () => {
    const tasksMap = {};
    for (const project of projects) {
      try {
        const response = await axios.get(`/tasks/project/${project._id}`);
        if (response.data) {
          tasksMap[project._id] = response.data;
        }
      } catch (err) {
        console.error(`Error fetching tasks for project ${project._id}:`, err);
        tasksMap[project._id] = [];
      }
    }
    setProjectTasks(tasksMap);
  };

  const days = eachDayOfInterval({ start: dateRange.start, end: dateRange.end });
  const cellWidth = 100;
  const rowHeight = 80;

  const getProjectPosition = (project) => {
    if (!project.createdAt) return null;
    
    const startDate = new Date(project.createdAt);
    const endDate = project.updatedAt ? new Date(project.updatedAt) : addDays(startDate, 30);
    
    const startIndex = days.findIndex((day) => isSameDay(day, startDate) || day > startDate);
    const endIndex = days.findIndex((day) => isSameDay(day, endDate) || day > endDate);
    
    if (startIndex === -1 || endIndex === -1) return null;
    
    const left = startIndex * cellWidth;
    const width = Math.max((endIndex - startIndex) * cellWidth, cellWidth * 2);
    
    return { left, width, startDate, endDate };
  };

  const statusColors = {
    active: "#e8f5e9",
    completed: "#e3f2fd",
    archived: "#fafafa",
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
      end: endOfWeek(addDays(new Date(), 30), { weekStartsOn: 1 }),
    });
  };

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
          <GanttIcon sx={{ fontSize: 32 }} />
          <Typography variant="h4">Projects Gantt Chart</Typography>
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
            onClick={() => navigate("/projects/create")}
          >
            Create Project
          </Button>
        </Box>
      </Box>

      <Paper sx={{ overflowX: "auto", p: 2 }}>
        <Box sx={{ minWidth: days.length * cellWidth }}>
          {/* Header with dates */}
          <Box sx={{ display: "flex", borderBottom: 2, borderColor: "divider", mb: 1 }}>
            <Box sx={{ width: 300, p: 1, borderRight: 1, borderColor: "divider", fontWeight: "bold" }}>
              Project
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

          {/* Project rows */}
          <Box>
              {filteredProjects.length === 0 ? (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography color="text.secondary">No projects found</Typography>
              </Box>
            ) : (
              filteredProjects.map((project) => {
                const position = getProjectPosition(project);
                const tasks = projectTasks[project._id] || [];
                return (
                  <Box key={project._id}>
                    {/* Project row */}
                    <Box
                      sx={{
                        display: "flex",
                        borderBottom: 2,
                        borderColor: "divider",
                        minHeight: rowHeight,
                        position: "relative",
                        backgroundColor: "#f5f5f5",
                      }}
                    >
                      {/* Project name column */}
                      <Box
                        sx={{
                          width: 300,
                          p: 1,
                          borderRight: 1,
                          borderColor: "divider",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}
                      >
                        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                          {project.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {tasks.length} tasks • {project.teams?.length || 0} teams
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
                                  {project.title}
                                </Typography>
                                <Typography variant="caption" display="block">
                                  Created: {format(position.startDate, "MMM d, yyyy")}
                                </Typography>
                                <Typography variant="caption" display="block">
                                  Updated: {format(position.endDate, "MMM d, yyyy")}
                                </Typography>
                                <Typography variant="caption" display="block">
                                  Status: {project.status}
                                </Typography>
                                <Typography variant="caption" display="block">
                                  Tasks: {tasks.length}
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
                                backgroundColor: statusColors[project.status] || statusColors.active,
                                border: "2px solid #1976d2",
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
                              onClick={() => navigate(`/projects/${project._id}`)}
                            >
                              <Typography variant="body2" sx={{ fontWeight: "bold", px: 1 }}>
                                {project.title.substring(0, Math.floor(position.width / 12))}
                                {project.title.length > Math.floor(position.width / 12) ? "..." : ""}
                              </Typography>
                            </Box>
                          </Tooltip>
                        )}
                      </Box>
                    </Box>

                    {/* Tasks sub-rows */}
                    {tasks.slice(0, 3).map((task, taskIndex) => {
                      const taskStart = task.createdAt ? new Date(task.createdAt) : new Date();
                      const taskEnd = task.dueDate ? new Date(task.dueDate) : addDays(taskStart, 7);
                      const taskStartIndex = days.findIndex((day) => isSameDay(day, taskStart) || day > taskStart);
                      const taskEndIndex = days.findIndex((day) => isSameDay(day, taskEnd) || day > taskEnd);
                      
                      if (taskStartIndex === -1 || taskEndIndex === -1) return null;
                      
                      const taskLeft = taskStartIndex * cellWidth;
                      const taskWidth = Math.max((taskEndIndex - taskStartIndex) * cellWidth, cellWidth);
                      
                      return (
                        <Box
                          key={task._id}
                          sx={{
                            display: "flex",
                            borderBottom: 1,
                            borderColor: "divider",
                            minHeight: 40,
                            position: "relative",
                          }}
                        >
                          <Box sx={{ width: 300, p: 1, borderRight: 1, borderColor: "divider" }}>
                            <Typography variant="caption" sx={{ pl: 2, color: "text.secondary" }}>
                              • {task.title}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              flex: 1,
                              position: "relative",
                              minHeight: 40,
                            }}
                          >
                            <Tooltip title={`${task.title} - ${task.status}`}>
                              <Box
                                sx={{
                                  position: "absolute",
                                  left: taskLeft,
                                  width: taskWidth,
                                  height: 32,
                                  top: 4,
                                  backgroundColor: "#fff3e0",
                                  border: "1px solid #ff9800",
                                  borderRadius: 0.5,
                                  display: "flex",
                                  alignItems: "center",
                                  px: 0.5,
                                  cursor: "pointer",
                                }}
                                onClick={() => navigate(`/tasks/${task._id}`)}
                              >
                                <Typography variant="caption" sx={{ fontSize: "0.65rem" }}>
                                  {task.title.substring(0, Math.floor(taskWidth / 8))}
                                  {task.title.length > Math.floor(taskWidth / 8) ? "..." : ""}
                                </Typography>
                              </Box>
                            </Tooltip>
                          </Box>
                        </Box>
                      );
                    })}
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
                backgroundColor: statusColors.active,
                border: "2px solid #1976d2",
                borderRadius: 1,
              }}
            />
            <Typography variant="caption">Active Project</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                backgroundColor: statusColors.completed,
                border: "2px solid #1976d2",
                borderRadius: 1,
              }}
            />
            <Typography variant="caption">Completed Project</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                backgroundColor: statusColors.archived,
                border: "2px solid #1976d2",
                borderRadius: 1,
              }}
            />
            <Typography variant="caption">Archived Project</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                backgroundColor: "#fff3e0",
                border: "1px solid #ff9800",
                borderRadius: 0.5,
              }}
            />
            <Typography variant="caption">Task</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProjectsGantt;

