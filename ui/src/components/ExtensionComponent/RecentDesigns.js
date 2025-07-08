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
import { ProxyUrl } from "../utils/constants";
import { useCallback } from "react";

export const REFRESH_RECENT_DESIGNS_EVENT = "refreshRecentDesigns";

// Create a custom event with optional detail payload
export const refreshRecentDesignsEvent = new CustomEvent(
  REFRESH_RECENT_DESIGNS_EVENT,
  {},
);

export default function RecentDesignsCard({ isDarkTheme }) {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchRecentDesigns = useCallback(() => {
    setLoading(true);
    fetch(ProxyUrl + "/api/pattern?page=0&pagesize=10&search=&order=updated_at") // Replace with your actual API endpoint
      .then(async (res) => {
        if (!res.ok) {
          const message = await res.text();
          throw new Error(message || "Failed to fetch designs");
        }
        return res.json();
      })
      .then((data) => {
        console.log("data", data);
        setDesigns(data?.patterns || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Unknown error");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchRecentDesigns();
  }, [fetchRecentDesigns]);

  useEffect(() => {
    document.addEventListener(REFRESH_RECENT_DESIGNS_EVENT, fetchRecentDesigns);

    return () =>
      document.removeEventListener(
        REFRESH_RECENT_DESIGNS_EVENT,
        fetchRecentDesigns,
      );
  }, [fetchRecentDesigns]);

  const openDesign = (design) => {
    const name = design.name.replace(" ", "-").toLowerCase();
    // const url = `http://localhost:9081/extension/meshmap?mode=design&design=${design.id}`;
    const url = `https://cloud.layer5.io/catalog/content/my-designs/${name}-${design.id}?source=%257B%2522type%2522%253A%2522my-designs%2522%257D`;

    window.ddClient.host.openExternal(url);
    // window.location.href = url;
  };

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
                    onClick={() => openDesign(design)}
                    edge="end"
                    aria-label="open"
                  >
                    <OpenInNewIcon />
                  </IconButton>
                }
              >
                <ListItemIcon>
                  <DesignIcon />
                </ListItemIcon>
                <ListItemText primary={design.name} />
                <ListItemText
                  primary={`Updated ${getFormatDate(design.updated_at)}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </SectionCard>
  );
}
