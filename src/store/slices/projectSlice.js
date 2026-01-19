import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

// Async thunks
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching projects from API...");
      const response = await axios.get("/projects");
      console.log("Projects API response:", response.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching projects:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch projects"
      );
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  "projects/fetchProjectById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/projects/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch project"
      );
    }
  }
);

export const createProject = createAsyncThunk(
  "projects/createProject",
  async (projectData, { rejectWithValue, getState }) => {
    try {
      const { user } = getState().auth;
      if (!user) {
        throw new Error("User not authenticated");
      }

      const projectWithUser = {
        ...projectData,
        owner: user._id,
        teams: projectData.teams || []
      };

      const response = await axios.post("/projects", projectWithUser);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create project"
      );
    }
  }
);

export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async ({ id, ...projectData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/projects/${id}`, projectData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update project"
      );
    }
  }
);

export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/projects/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete project"
      );
    }
  }
);

export const addTeamToProject = createAsyncThunk(
  "projects/addTeam",
  async ({ projectId, teamId, role = "contributor" }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/projects/${projectId}/teams`, {
        teamId,
        role
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add team to project"
      );
    }
  }
);

export const removeTeamFromProject = createAsyncThunk(
  "projects/removeTeam",
  async ({ projectId, teamId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/projects/${projectId}/teams/${teamId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove team from project"
      );
    }
  }
);

const initialState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
  success: null,
};

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Project by ID
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Project
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.projects = [...(state.projects || []), action.payload];
          state.success = "Project created successfully";
        }
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("Error creating project:", action.payload);
      })
      // Update Project
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.map((project) =>
          project._id === action.payload._id ? action.payload : project
        );
        if (state.currentProject?._id === action.payload._id) {
          state.currentProject = action.payload;
        }
        state.success = "Project updated successfully";
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Project
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.filter(
          (project) => project._id !== action.payload
        );
        if (state.currentProject?._id === action.payload) {
          state.currentProject = null;
        }
        state.success = "Project deleted successfully";
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Team to Project
      .addCase(addTeamToProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTeamToProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.map((project) =>
          project._id === action.payload._id ? action.payload : project
        );
        if (state.currentProject?._id === action.payload._id) {
          state.currentProject = action.payload;
        }
        state.success = "Team added to project successfully";
      })
      .addCase(addTeamToProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove Team from Project
      .addCase(removeTeamFromProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeTeamFromProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.map((project) =>
          project._id === action.payload._id ? action.payload : project
        );
        if (state.currentProject?._id === action.payload._id) {
          state.currentProject = action.payload;
        }
        state.success = "Team removed from project successfully";
      })
      .addCase(removeTeamFromProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess, setCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
