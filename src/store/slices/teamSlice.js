import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

// Async thunks
export const fetchTeams = createAsyncThunk(
  "team/fetchTeams",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/team");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch teams");
    }
  }
);

export const createTeam = createAsyncThunk(
  "team/createTeam",
  async (teamData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/team", teamData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create team");
    }
  }
);

export const joinTeam = createAsyncThunk(
  "team/joinTeam",
  async (joinCode, { rejectWithValue }) => {
    try {
      const response = await axios.post("/team/join", { joinCode });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to join team");
    }
  }
);

export const addTeamMember = createAsyncThunk(
  "team/addMember",
  async ({ teamId, email, role }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/team/${teamId}/members`, { email, role });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add team member");
    }
  }
);

export const updateMemberRole = createAsyncThunk(
  "team/updateRole",
  async ({ teamId, userId, role }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/team/${teamId}/members/${userId}`, { role });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update member role");
    }
  }
);

export const removeMember = createAsyncThunk(
  "team/removeMember",
  async ({ teamId, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/team/${teamId}/members/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to remove member");
    }
  }
);

export const fetchTeamActivity = createAsyncThunk(
  "team/fetchActivity",
  async (teamId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/team/${teamId}/activity`);
      return response.data;
    } catch (error) {
      console.error("Error fetching team activity:", error);
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        "Failed to fetch team activity"
      );
    }
  }
);

export const fetchTeamById = createAsyncThunk(
  "team/fetchTeamById",
  async (teamId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/team/${teamId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch team");
    }
  }
);

const initialState = {
  teams: [],
  currentTeam: null,
  activity: [],
  loading: false,
  error: null,
};

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentTeam: (state, action) => {
      state.currentTeam = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Teams
      .addCase(fetchTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Team
      .addCase(createTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.teams.push(action.payload);
      })
      .addCase(createTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Join Team
      .addCase(joinTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.teams.push(action.payload);
      })
      .addCase(joinTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Member
      .addCase(addTeamMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTeamMember.fulfilled, (state, action) => {
        state.loading = false;
        const teamIndex = state.teams.findIndex(team => team._id === action.payload._id);
        if (teamIndex !== -1) {
          state.teams[teamIndex] = action.payload;
        }
      })
      .addCase(addTeamMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Member Role
      .addCase(updateMemberRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMemberRole.fulfilled, (state, action) => {
        state.loading = false;
        const teamIndex = state.teams.findIndex(team => team._id === action.payload._id);
        if (teamIndex !== -1) {
          state.teams[teamIndex] = action.payload;
        }
      })
      .addCase(updateMemberRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove Member
      .addCase(removeMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeMember.fulfilled, (state, action) => {
        state.loading = false;
        const teamIndex = state.teams.findIndex(team => team._id === action.payload._id);
        if (teamIndex !== -1) {
          state.teams[teamIndex] = action.payload;
        }
      })
      .addCase(removeMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Activity
      .addCase(fetchTeamActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.activity = action.payload;
      })
      .addCase(fetchTeamActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Team by ID
      .addCase(fetchTeamById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTeam = action.payload;
      })
      .addCase(fetchTeamById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setCurrentTeam } = teamSlice.actions;
export default teamSlice.reducer;
