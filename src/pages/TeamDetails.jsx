import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
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
  TextField,
  Typography,
  Avatar,
  LinearProgress,
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import {
  fetchTeamById,
  addTeamMember,
  updateMemberRole,
  removeMember,
  fetchTeamActivity,
} from "../store/slices/teamSlice";

const TeamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentTeam, activity, loading, error } = useSelector((state) => state.team);
  const { user } = useSelector((state) => state.auth);

  const [openMemberDialog, setOpenMemberDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [memberFormData, setMemberFormData] = useState({
    email: "",
    role: "contributor",
  });
  const [memberError, setMemberError] = useState(null);

  useEffect(() => {
    dispatch(fetchTeamById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (currentTeam) {
      dispatch(fetchTeamActivity(currentTeam._id));
    }
  }, [dispatch, currentTeam]);

  const handleOpenMemberDialog = () => {
    setMemberFormData({
      email: "",
      role: "contributor",
    });
    setMemberError(null);
    setOpenMemberDialog(true);
  };

  const handleCloseMemberDialog = () => {
    setOpenMemberDialog(false);
    setMemberError(null);
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setMemberError(null);
    
    try {
      await dispatch(addTeamMember({
        teamId: currentTeam._id,
        ...memberFormData
      })).unwrap();
      handleCloseMemberDialog();
    } catch (error) {
      setMemberError(error);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await dispatch(updateMemberRole({
        teamId: currentTeam._id,
        userId,
        role: newRole
      })).unwrap();
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (window.confirm("Are you sure you want to remove this member?")) {
      try {
        await dispatch(removeMember({
          teamId: currentTeam._id,
          userId
        })).unwrap();
      } catch (error) {
        console.error("Error removing member:", error);
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!currentTeam) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        Team not found
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/teams')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">{currentTeam.name}</Typography>
      </Box>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">Team Details</Typography>
            <IconButton onClick={() => {}}>
              <EditIcon />
            </IconButton>
          </Box>
          <Typography color="text.secondary" paragraph>
            {currentTeam.description}
          </Typography>
          
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
            <Tab label="Members" />
            <Tab label="Projects" />
            <Tab label="Tasks" />
            <Tab label="Activity" />
          </Tabs>

          {activeTab === 0 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Team Members</Typography>
                <Button
                  variant="outlined"
                  startIcon={<PersonAddIcon />}
                  onClick={handleOpenMemberDialog}
                >
                  Add Member
                </Button>
              </Box>
              <List>
                {currentTeam.members?.map((member) => (
                  <ListItem key={member.user._id}>
                    <ListItemAvatar>
                      <Avatar>{member.user.name[0]}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={member.user.name}
                      secondary={member.role}
                    />
                    <Box>
                      <IconButton
                        onClick={() => handleUpdateRole(member.user._id, member.role === 'lead' ? 'contributor' : 'lead')}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleRemoveMember(member.user._id)}
                        disabled={member.role === 'lead'}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {activeTab === 1 && (
            <Grid container spacing={2}>
              {currentTeam.projects?.map((project) => (
                <Grid item xs={12} sm={6} key={project._id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{project.title}</Typography>
                      <Typography color="text.secondary">
                        {project.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {activeTab === 2 && (
            <Grid container spacing={2}>
              {currentTeam.tasks?.map((task) => (
                <Grid item xs={12} sm={6} key={task._id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{task.title}</Typography>
                      <Typography color="text.secondary">
                        Status: {task.status}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {activeTab === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Team Activity
              </Typography>
              {activity?.length === 0 ? (
                <Typography color="text.secondary">
                  No activity recorded yet
                </Typography>
              ) : (
                <List>
                  {activity?.map((log, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>
                            {log.user?.name?.[0] || '?'}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={log.action}
                          secondary={
                            <>
                              <Typography component="span" variant="body2" color="text.primary">
                                {log.user?.name || 'Unknown User'}
                              </Typography>
                              {' — '}
                              {new Date(log.timestamp).toLocaleString()}
                            </>
                          }
                        />
                      </ListItem>
                      {index < activity.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Add Member Dialog */}
      <Dialog open={openMemberDialog} onClose={handleCloseMemberDialog}>
        <DialogTitle>Add Team Member</DialogTitle>
        <form onSubmit={handleAddMember}>
          <DialogContent>
            {memberError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {memberError}
              </Alert>
            )}
            <TextField
              autoFocus
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              value={memberFormData.email}
              onChange={(e) => setMemberFormData({ ...memberFormData, email: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              label="Role"
              fullWidth
              select
              value={memberFormData.role}
              onChange={(e) => setMemberFormData({ ...memberFormData, role: e.target.value })}
            >
              <MenuItem value="lead">Lead</MenuItem>
              <MenuItem value="contributor">Contributor</MenuItem>
              <MenuItem value="viewer">Viewer</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseMemberDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default TeamDetails; 