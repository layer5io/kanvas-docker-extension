import React, { useEffect, useState } from "react";
import {
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
import {
  ExternalLinkIcon,
  CustomTooltip,
  InfoCircleIcon,
} from "@sistent/sistent";
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

  const openDesignInKanvas = (design) => {
    const kanvasURL = `${ProxyUrl}/extension/meshmap?mode=design&design=${design.id}`;
    window.location.href = kanvasURL;
  };

  const openDesignInCloud = (design) => {
    const name = encodeURIComponent(
      design.name.replace(/\s+/g, "-").toLowerCase(),
    );
    const myDesignsURL = `https://cloud.layer5.io/catalog/content/my-designs/${name}-${design.id}?source=%257B%2522type%2522%253A%2522my-designs%2522%257D`;
    window.ddClient.host.openExternal(myDesignsURL);
  };

  const RecentDesignsTooltipTitle = (
    <Typography variant="body1" component="p" sx={{ mt: 0.5 }}>
      Designs in this list are those owned by you, available in your currently
      selected Organization and Workspace. Learn more about Spaces at
      <a
        onClick={() => openExternalLink("https://docs.layer5.io/cloud/spaces/")}
        style={{ color: "#00b39f" }}
      >
        https://docs.layer5.io/cloud/spaces/
      </a>
    </Typography>
  );

  return (
    <SectionCard
      isDarkTheme={isDarkTheme}
      sx={{ flexDirection: "column", pt: "0.5rem", pb: "0.5rem" }}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignContent="center"
        width="100%"
      >
        <Box
          display="flex"
          justifySelf="center"
          sx={{
            display: "flex",
            margin: "auto",
            marginRight: "-1rem",
            alignSelf: "flex-start",
            justifySelf: "center",
            flexDirection: "row",
          }}
          alignSelf="flex-start"
        >
          <CustomTooltip title={RecentDesignsTooltipTitle}>
            <div>
              <InfoCircleIcon height={24} width={24} />
            </div>
          </CustomTooltip>
        </Box>
        <CardHeader title="Recent Designs" sx={{ flexGrow: 1 }} />
      </Box>
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
                onClick={() => openDesignInKanvas(design)}
                style={{ cursor: "pointer" }}
                divider
                sx={{
                  "&:hover": {
                    backgroundColor: isDarkTheme ? "#4F5B69" : "#C0C7CB", // A shade darker
                  },
                }}
                secondaryAction={
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      openDesignInCloud(design);
                    }}
                    edge="end"
                    aria-label="open"
                    sx={{ "&:hover": { "& svg": { fill: "#00b39f" } } }}
                  >
                    <ExternalLinkIcon width="16" fill="#ccc" />
                  </IconButton>
                }
              >
                <ListItemIcon sx={{ minWidth: "32px" }}>
                  <DesignIcon />
                </ListItemIcon>
                <ListItemText
                  primary={design.name}
                  style={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    marginRight: "1rem",
                  }}
                />
                <ListItemText
                  style={{ color: "#ccc", textAlign: "right" }}
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
