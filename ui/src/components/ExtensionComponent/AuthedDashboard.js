import { useState, useEffect } from "react";
import {
  Typography,
  Avatar,
  IconButton,
  Box as MuiBox,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { ExternalLinkIcon } from "@sistent/sistent";
import {
  AccountDiv,
  ExtensionWrapper,
  SectionWrapper,
  VersionText,
  StyledButton,
  StyledButtonLink,
} from "./styledComponents";

import { InfoCircleIcon, CustomTooltip, Box, CircularProgress,SistentThemeProvider } from "@sistent/sistent";

// import KanvasColor from "../../img/SVGs/kanvasColor";
import KanvasWhite from "../../img/SVGs/kanvasWhite";
import DocsIcon from "../../img/SVGs/docsIcon";
import VideosIcon from "../../img/SVGs/videosIcon";
import KanvasHorizontalLight from "../../img/SVGs/KanvasHorizontalLight";

import { randomApplicationNameGenerator } from "../../utils";
import { getBase64EncodedFile, getUnit8ArrayDecodedFile } from "../utils/file";
import RecentDesignsCard, { refreshRecentDesignsEvent } from "./RecentDesigns";
import QanelasSistentThemeProvider from "../../theme/QanelasSistentThemeProvider";

const proxyUrl = "http://127.0.0.1:7877";

// ─────── UI Components ───────────────────────────────

const DocsButton = ({ isDarkTheme, onClick }) => (
  <StyledButton
    size="small"
    onClick={onClick}
    style={{
      backgroundColor: isDarkTheme ? "#393F49" : "#D7DADE",
    }}
  >
    <DocsIcon
      width="24"
      height="24"
      CustomColor={isDarkTheme ? "white" : "#3C494F"}
    />
    &nbsp;Docs
  </StyledButton>
);

const VideosButton = ({ isDarkTheme, onClick }) => (
  <StyledButton
    size="small"
    onClick={onClick}
    style={{
      backgroundColor: isDarkTheme ? "#393F49" : "#D7DADE",
    }}
  >
    <VideosIcon
      width="24"
      height="24"
      CustomColor={isDarkTheme ? "white" : "#3C494F"}
    />
    &nbsp;Videos
  </StyledButton>
);

const HeaderSection = ({ isDarkTheme }) => (
  <MuiBox>
    <MuiBox
      display="flex"
      justifyContent={"end"}
      gap={1}
      alignItems={"center"}
      ml={2}
      mr={4}
      my={2}
    >
      <VersionInfoSection isDarkTheme={isDarkTheme} />
      <DocsButton
        isDarkTheme={isDarkTheme}
        onClick={() =>
          window.ddClient.host.openExternal("https://docs.layer5.io/kanvas/")
        }
      />      
      <VideosButton
        isDarkTheme={isDarkTheme}
        onClick={() =>
          window.ddClient.host.openExternal("https://docs.layer5.io/videos/")
        }
      />
      <UserAccountSection isDarkTheme={isDarkTheme} />
    </MuiBox>
    <MuiBox display="flex" justifyContent="center" mb={2}>
      <MuiBox textAlign="center">
        <KanvasHorizontalLight
          width="600"
          height="auto"
          CustomColor={isDarkTheme ? "white" : "#3C494F"}
        />
        <Typography>
          Design and operate your cloud and cloud native infrastructure.
        </Typography>
      </MuiBox>
    </MuiBox>
  </MuiBox>
);

const LaunchKanvasSection = ({ isDarkTheme }) => {
  const [launching, setLaunching] = useState(false);

  const openInExternalWindow = () => {
    window.ddClient.host.openExternal(proxyUrl + "/extension/meshmap");
  };

  return (
    <ExtensionWrapper
      sx={{ backgroundColor: isDarkTheme ? "#393F49" : "#D7DADE", flexDirection:"column"}}
    >
      <AccountDiv>
        <StyledButton
          variant="contained"
          component="span"
          onClick={() => {
            window.location.href = proxyUrl + "/extension/meshmap";
            setLaunching(true);
          }}
          sx={{margin:"0"}}
        > <KanvasWhite height={48} width={48} sx={{margin:"0", padding:"0"}}  />

          <MuiBox display={"flex"} gap={0} sx={{margin:"0", padding:"0"}} alignItems="center">
            {launching && (
              <CircularProgress
                sx={{
                  color: "#fff",
                }}
                size="24"
              />
            )}
            <StyledButtonLink style={{ color: "white" }}>
              {launching ? "Launching" : "Launch"} Kanvas
            </StyledButtonLink>
          </MuiBox>
        </StyledButton>
        <StyledButtonLink
          style={{
            color: "#ccc",
            cursor: "pointer",
            marginTop: "0.55rem",
            padding: "0px",
            fontSize: ".9rem"
          }}
          onClick={openInExternalWindow}
        >
          open in external window
          <ExternalLinkIcon width="12" fill="#eee" />
        </StyledButtonLink>
      </AccountDiv>
    </ExtensionWrapper>
  );
};

const ImportDesignSection = ({ isDarkTheme }) => {
  const handleImport = async (e) => {
    try {
      const file = e.target?.files?.[0];
      if (!file) {
        window.ddClient.desktopUI.toast.error("No file selected.");
        return;
      }

      const name = randomApplicationNameGenerator();
      const base64 = await getBase64EncodedFile(file);
      const payload = {
        name,
        file: getUnit8ArrayDecodedFile(base64),
        file_name: file.name,
      };

      const res = await fetch(`${proxyUrl}/api/pattern/import`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Upload failed");
      // refresh recent designs
      document.dispatchEvent(refreshRecentDesignsEvent);

      window.ddClient.desktopUI.toast.success(`Design uploaded as: ${name}`);
    } catch (err) {
      console.error("Import error:", err);
      window.ddClient.desktopUI.toast.error("Error uploading design file.");
    }
  };

  return (

    <ExtensionWrapper
      sx={{ backgroundColor: isDarkTheme ? "#393F49" : "#D7DADE" }}
    >
      
      <AccountDiv>
        <Box
          display="inline"
          position="relative"
          justifySelf="flex-end"
          alignSelf="flex-start"
          margin="-1.5rem 0rem 1rem -.5rem"
        >
       <CustomTooltip title="Supported formats: Helm chart, Kubernetes manifest, Kustomize, and Docker Compose. Learn more at https://docs.layer5.io/kanvas/getting-started/">
            <div>
              <InfoCircleIcon height={24} width={24} />
            </div>
          </CustomTooltip>
          </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap={1}
          mb={2}
        >
          <Typography variant="h6" whiteSpace="nowrap">Import Design File</Typography>
         
        </Box>
        <label htmlFor="upload-button">
          <StyledButton variant="contained" component="span" sx={{  padding: "1rem 3.5rem"}}  >
            <input
              id="upload-button"
              type="file"
              accept=".yaml, .yml, .json, .zip, .tar , .tar.gz"
              hidden
              onChange={handleImport}
              
            />
            Browse...
          </StyledButton>
        </label>
         
      </AccountDiv>
      
    </ExtensionWrapper>
  );
};

const VersionInfoSection = ({ isDarkTheme }) => {
  const [kanvasVersion, setVersion] = useState("");

  useEffect(() => {
    const fetchVersion = () => {
      fetch(proxyUrl + "/api/system/version")
        .then((result) => result.text())
        .then((result) => setVersion(JSON.parse(result)?.build))
        .catch(console.error);
    };

    fetchVersion();
  }, []);

  return (
    <MuiBox pt={1.2} display="flex" alignItems="center" gap={1}>
      <CustomTooltip title="Kanvas Server Version">
        <VersionText>{kanvasVersion}</VersionText>
      </CustomTooltip>
      <a
        href={`https://docs.layer5.io/project/releases/${kanvasVersion}`}
        target="_blank"
        rel="noreferrer"
        style={{ color: isDarkTheme ? "white" : "black" }}
      >
        <OpenInNewIcon sx={{ width: "0.85rem", verticalAlign: "middle" }} />
      </a>
    </MuiBox>
  );
};

const UserAccountSection = ({ isDarkTheme }) => {
  const [user, setUser] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  useEffect(() => {
    const fetchUserAndVersion = async () => {
      try {
        const userRes = await fetch(`${proxyUrl}/api/user`);
        const user = await userRes.json();
        setUser(user);
      } catch (err) {
        console.error("Error fetching user or version:", err);
      }
    };

    fetchUserAndVersion();
  }, []);

  const logout = async () => {
    try {
      await fetch(`${proxyUrl}/token`, { method: "DELETE" });
      console.log("Logged out");
      handleMenuClose();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  console.log("user", user);
  // if (!user) return null;

  return (
    <>
      <Tooltip title={user.user_id}>
        <IconButton onClick={handleMenuOpen} size="small" sx={{ ml: 2 }}>
          <Avatar src={user.avatar_url} sx={{ width: 40, height: 40 }} />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        slotProps={{
          paper: {
            elevation: 2,
            sx: {
              mt: 1.5,
              minWidth: 180,
              backgroundColor: isDarkTheme ? "#eee" : "#D7DADE",
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
    </>
  );
};

// ─────── Main Dashboard Component ─────────────────────

export const Dasboard = ({ isDarkMode }) => {
  const isDarkTheme = isDarkMode;

  return (
    <QanelasSistentThemeProvider>
      <HeaderSection isDarkTheme={isDarkTheme} />
      <SectionWrapper
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "1.5rem",
          alignItems: "center",
        }}
      >
        <SectionWrapper
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          alignItems: "center",
        }}
      >
        <LaunchKanvasSection isDarkTheme={isDarkTheme} />
        <ImportDesignSection isDarkTheme={isDarkTheme} />
      </SectionWrapper>
        <RecentDesignsCard isDarkTheme={isDarkMode} />
      </SectionWrapper>
                    </QanelasSistentThemeProvider>



  );
};
