import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Button, ButtonGroup } from "@mui/material";
import {
  ViewList as ListIcon,
  ViewKanban as KanbanIcon,
  Timeline as GanttIcon,
} from "@mui/icons-material";

const ViewToggle = ({ basePath, showKanban = true, showGantt = true }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isList = location.pathname === basePath;
  const isKanban = location.pathname === `${basePath}/kanban`;
  const isGantt = location.pathname === `${basePath}/gantt`;

  return (
    <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
      <ButtonGroup variant="outlined" size="small">
        <Button
          startIcon={<ListIcon />}
          variant={isList ? "contained" : "outlined"}
          onClick={() => navigate(basePath)}
        >
          List
        </Button>
        {showKanban && (
          <Button
            startIcon={<KanbanIcon />}
            variant={isKanban ? "contained" : "outlined"}
            onClick={() => navigate(`${basePath}/kanban`)}
          >
            Kanban
          </Button>
        )}
        {showGantt && (
          <Button
            startIcon={<GanttIcon />}
            variant={isGantt ? "contained" : "outlined"}
            onClick={() => navigate(`${basePath}/gantt`)}
          >
            Gantt
          </Button>
        )}
      </ButtonGroup>
    </Box>
  );
};

export default ViewToggle;

