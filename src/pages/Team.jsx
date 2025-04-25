import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
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
  Chip,
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
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Group as GroupIcon,
  PersonAdd as JoinIcon,
  Assignment as ProjectIcon,
  Task as TaskIcon,
} from "@mui/icons-material";
import { 
  fetchTeams, 
  createTeam, 
  joinTeam, 
  addTeamMember, 
  updateMemberRole, 
  removeMember,
  fetchTeamActivity,
  setCurrentTeam
} from "../store/slices/teamSlice";

const Team = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { teams, currentTeam, activity, loading, error } = useSelector((state) => state.team);
  const { user } = useSelector((state) => state.auth);

  const [openDialog, setOpenDialog] = useState(false);
  const [openJoinDialog, setOpenJoinDialog] = useState(false);
  const [openMemberDialog, setOpenMemberDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    projectId: "",
  });
  const [joinFormData, setJoinFormData] = useState({
    joinCode: "",
  });
  const [memberFormData, setMemberFormData] = useState({
    email: "",
    role: "contributor",
  });
  const [formError, setFormError] = useState(null);
  const [joinError, setJoinError] = useState(null);
  const [memberError, setMemberError] = useState(null);

  useEffect(() => {
    dispatch(fetchTeams());
  }, [dispatch]);

  useEffect(() => {
    if (currentTeam) {
      dispatch(fetchTeamActivity(currentTeam._id));
    }
  }, [dispatch, currentTeam]);

  const handleOpenDialog = () => {
    setFormData({
      name: "",
      description: "",
      projectId: "",
    });
    setFormError(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormError(null);
  };

  const handleOpenJoinDialog = () => {
    setJoinFormData({ joinCode: "" });
    setJoinError(null);
    setOpenJoinDialog(true);
  };

  const handleCloseJoinDialog = () => {
    setOpenJoinDialog(false);
    setJoinError(null);
  };

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

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setFormError(null);
    
    try {
      await dispatch(createTeam(formData)).unwrap();
      handleCloseDialog();
    } catch (error) {
      setFormError(error);
    }
  };

  const handleJoinTeam = async (e) => {
    e.preventDefault();
    setJoinError(null);
    
    try {
      await dispatch(joinTeam(joinFormData.joinCode)).unwrap();
      handleCloseJoinDialog();
    } catch (error) {
      setJoinError(error);
    }
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

  const handleTeamClick = (team) => {
    navigate(`/teams/${team._id}`);
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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Teams</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<JoinIcon />}
            onClick={handleOpenJoinDialog}
            sx={{ mr: 2 }}
          >
            Join Team
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            Create Team
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Teams List */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Teams
              </Typography>
              {teams.length === 0 ? (
                <Typography color="text.secondary">
                  You are not a member of any teams yet.
                </Typography>
              ) : (
                <List>
                  {teams.map((team) => (
                    <React.Fragment key={team._id}>
                      <ListItem
                        button
                        onClick={() => handleTeamClick(team)}
                      >
                        <ListItemAvatar>
                          <Avatar>
                            <GroupIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={team.name}
                          secondary={`${team.members?.length || 0} members`}
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Team Details */}
        <Grid item xs={12} md={8}>
          {currentTeam ? (
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5">{currentTeam.name}</Typography>
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
                        startIcon={<PersonAdd />}
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
                    {currentTeam.projects.map((project) => (
                      <Grid item xs={12} sm={6} key={project._id}>
                        <Card>
                          <CardContent>
                            <Box display="flex" alignItems="center">
                              <ProjectIcon sx={{ mr: 1 }} />
                              <Typography variant="h6">{project.title}</Typography>
                            </Box>
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
                    {currentTeam.tasks.map((task) => (
                      <Grid item xs={12} sm={6} key={task._id}>
                        <Card>
                          <CardContent>
                            <Box display="flex" alignItems="center">
                              <TaskIcon sx={{ mr: 1 }} />
                              <Typography variant="h6">{task.title}</Typography>
                            </Box>
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
                  <List>
                    {activity.map((log, index) => (
                      <React.Fragment key={index}>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar>
                              {log.user.name?.[0]}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={log.action}
                            secondary={new Date(log.timestamp).toLocaleString()}
                          />
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 5 }}>
                <Typography variant="h6" gutterBottom>
                  No Team Selected
                </Typography>
                <Typography color="text.secondary" paragraph>
                  Select a team from the list or create a new one
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Create Team Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Create New Team</DialogTitle>
        <form onSubmit={handleCreateTeam}>
          <DialogContent>
            {formError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formError}
              </Alert>
            )}
            <TextField
              autoFocus
              margin="dense"
              label="Team Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Join Team Dialog */}
      <Dialog open={openJoinDialog} onClose={handleCloseJoinDialog}>
        <DialogTitle>Join Team</DialogTitle>
        <form onSubmit={handleJoinTeam}>
          <DialogContent>
            {joinError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {joinError}
              </Alert>
            )}
            <TextField
              autoFocus
              margin="dense"
              label="Join Code"
              fullWidth
              value={joinFormData.joinCode}
              onChange={(e) => setJoinFormData({ joinCode: e.target.value })}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseJoinDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              Join
            </Button>
          </DialogActions>
        </form>
      </Dialog>

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

export default Team; 