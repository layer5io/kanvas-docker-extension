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

import {
  AccountDiv,
  ExtensionWrapper,
  LinkButton,
  SectionWrapper,
  VersionText,
  StyledButton,
  StyledLink,
  IconWrapper,
} from "./styledComponents";

import {
  SistentThemeProviderWithoutBaseLine,
  InfoCircleIcon,
  CustomTooltip,
  Box,
} from "@sistent/sistent";

import kanvasColor from "../../img/SVGs/kanvasColor";
import DocsIcon from "../../img/SVGs/docsIcon";
import KanvasHorizontalLight from "../../img/SVGs/KanvasHorizontalLight";

import { randomApplicationNameGenerator } from "../../utils";
import { getBase64EncodedFile, getUnit8ArrayDecodedFile } from "../utils/file";
import RecentDesignsCard, { refreshRecentDesignsEvent } from "./RecentDesigns";

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

const HeaderSection = ({ isDarkTheme }) => (
  <MuiBox>
    <MuiBox
      display="flex"
      justifyContent={"end"}
      gap={2}
      alignItems={"center"}
      mb={2}
    >
      <DocsButton
        isDarkTheme={isDarkTheme}
        onClick={() =>
          window.ddClient.host.openExternal("https://docs.layer5.io/kanvas/")
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
          Design and operate your cloud native deployments with Kanvas.
        </Typography>
      </MuiBox>
    </MuiBox>
  </MuiBox>
);

const LaunchKanvasSection = ({ isDarkTheme }) => (
  <ExtensionWrapper
    sx={{ backgroundColor: isDarkTheme ? "#393F49" : "#D7DADE" }}
  >
    <AccountDiv>
      <kanvasColor height={70} width={72} style={{ marginBottom: "1rem" }} />
      <StyledButton variant="contained" component="span" onClick={() => (window.location.href = proxyUrl)}>
        <StyledLink style={{ color: "white" }}>Launch Kanvas</StyledLink>
      </StyledButton>
    </AccountDiv>
  </ExtensionWrapper>
);

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
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap={1}
          mb={2}
        >
          <Typography whiteSpace="nowrap">Import Design File</Typography>
          <CustomTooltip title="Supported formats: Helm chart, Kubernetes manifest, Kustomize, and Docker Compose. Learn more at https://docs.layer5.io/kanvas/getting-started/">
            <div>
              <InfoCircleIcon height={24} width={24} />
            </div>
          </CustomTooltip>
        </Box>
        <label htmlFor="upload-button">
          <StyledButton variant="contained" component="span">
            <input
              id="upload-button"
              type="file"
              accept=".yaml, .yml"
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
        href={`https://docs.Kanvas.io/project/releases/${kanvasVersion}`}
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
        console.log("user Res", userRes);
        // fetch(`${proxyUrl}/api/system/version`),
        const j = await userRes.json();

        console.log("json", j);

        const user = JSON.parse(await userRes.text());

        console.log("user", user);
        // const version = JSON.parse(await versionRes.text());

        setUser(user);
        // setKanvasVersion(version?.build || "");
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
    <SistentThemeProviderWithoutBaseLine>
      <HeaderSection isDarkTheme={isDarkTheme} />
      <SectionWrapper
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "1.5rem",
          alignItems: "center",
        }}
      >
        <LaunchKanvasSection isDarkTheme={isDarkTheme} />
        <ImportDesignSection isDarkTheme={isDarkTheme} />
        <RecentDesignsCard isDarkTheme={isDarkMode} />
      </SectionWrapper>
      <VersionInfoSection isDarkTheme={isDarkMode} />
    </SistentThemeProviderWithoutBaseLine>
  );
};
