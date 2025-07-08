import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { DesignIcon } from "@sistent/sistent";

import { getFormatDate } from "@sistent/sistent";
import { SectionCard } from "./styledComponents";

const sampleResp = [
  {
    id: "1",
    name: "Landing Page Redesign",
    updatedAt: "2025-07-08T10:30:00Z",
  },
  {
    id: "2",
    name: "Mobile App UI",
    updatedAt: "2025-07-07T15:12:00Z",
  },
  {
    id: "3",
    name: "Mobile App UI",
    updatedAt: "2025-07-07T15:12:00Z",
  },
  {
    id: "4",
    name: "Mobile App UI",
    updatedAt: "2025-07-07T15:12:00Z",
  },
];

export default function RecentDesignsCard({ isDarkTheme }) {
  const [designs, setDesigns] = useState(sampleResp);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    return;
    fetch("/api/designs/recent") // Replace with your actual API endpoint
      .then(async (res) => {
        if (!res.ok) {
          const message = await res.text();
          throw new Error(message || "Failed to fetch designs");
        }
        return res.json();
      })
      .then((data) => {
        setDesigns(data);
        setLoading(false);
      })
      .catch((err) => {
        // setError(err.message || "Unknown error");
        setLoading(false);
      });
  }, []);

  return (
    <SectionCard
      isDarkTheme={isDarkTheme}
      sx={{ flexDirection: "column", pt: "0.5rem", pb: "0.5rem" }}
    >
      <CardHeader title="Recent Designs" />
      <CardContent>
        {loading ? (
          <Box display="flex" justifyContent="center" my={3}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : designs.length === 0 ? (
          <Typography color="text.secondary">
            No recent designs found.
          </Typography>
        ) : (
          <List disablePadding>
            {designs.map((design) => (
              <ListItem
                key={design.id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="open"
                    href={`/designs/${design.id}`}
                  >
                    <OpenInNewIcon />
                  </IconButton>
                }
              >
                <ListItemIcon>
                  <DesignIcon />
                </ListItemIcon>
                <ListItemText
                  primary={design.name}
                  secondary={`Updated ${getFormatDate(design.updatedAt)}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </SectionCard>
  );
}
