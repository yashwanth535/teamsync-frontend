import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Avatar,
  Alert,
  Paper,
  CircularProgress,
  Divider,
  Chip,
} from "@mui/material";
import {
  updateProfile,
  clearError,
  setError,
  loadUser,
} from "../store/slices/authSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector(
    (state) => state.auth
  );
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword, ...profileData } =
      formData;

    if (newPassword && newPassword !== confirmPassword) {
      setSuccessMessage("");
      dispatch(setError("New passwords do not match"));
      return;
    }

    if (newPassword && !currentPassword) {
      setSuccessMessage("");
      dispatch(setError("Please enter your current password to change it"));
      return;
    }

    const updateData = {
      ...profileData,
      ...(newPassword && { password: newPassword }),
      ...(currentPassword && { currentPassword }),
    };

    try {
      const result = await dispatch(updateProfile(updateData)).unwrap();
      setSuccessMessage("Profile updated successfully");
      dispatch(clearError());
      // Clear password fields
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      // Reload user to get updated data
      await dispatch(loadUser());
    } catch (err) {
      setSuccessMessage("");
    }
  };

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4, p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: "primary.main",
              fontSize: "2rem",
              mr: 3,
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </Avatar>
          <Box>
            <Typography variant="h4" gutterBottom>
              {user?.name || "User"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {user?.email || ""}
            </Typography>
            <Chip
              label={user?.role || "user"}
              color="primary"
              size="small"
              sx={{ mt: 1 }}
            />
          </Box>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Profile Settings
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            disabled
          />

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Change Password
          </Typography>

          <TextField
            fullWidth
            label="Current Password"
            name="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="New Password"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Update Profile"}
          </Button>
        </form>

        <Box sx={{ mt: 4, p: 3, bgcolor: "grey.50", borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Account Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Member Since
              </Typography>
              <Typography variant="body1">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Last Login
              </Typography>
              <Typography variant="body1">
                {user?.lastLogin
                  ? new Date(user.lastLogin).toLocaleDateString()
                  : "Never"}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile;
