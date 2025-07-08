import { useState, useEffect } from "react";
import { Typography, Button, Avatar, Box as MuiBox } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import {
  AccountDiv,
  ExtensionWrapper,
  LinkButton,
  SectionWrapper,
  VersionText,
  LogoutButton,
  StyledButton,
  StyledLink,
} from "./styledComponents";

import {
  SistentThemeProviderWithoutBaseLine,
  InfoCircleIcon,
  CustomTooltip,
  Box,
} from "@sistent/sistent";

import KanvasGreen from "../../img/SVGs/KanvasGreen";
import DocsIcon from "../../img/SVGs/docsIcon";
import KanvasHorizontalLight from "../../img/SVGs/KanvasHorizontalLight";

import { randomApplicationNameGenerator } from "../../utils";
import { getBase64EncodedFile, getUnit8ArrayDecodedFile } from "../utils/file";

const proxyUrl = "http://127.0.0.1:7877";

// ─────── UI Components ───────────────────────────────

const DocsButton = ({ isDarkTheme, onClick }) => (
  <StyledButton
    size="small"
    onClick={onClick}
    style={{
      backgroundColor: isDarkTheme ? "#393F49" : "#D7DADE",
      position: "absolute",
      top: "1rem",
      right: "1rem",
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
);

const LaunchKanvasSection = ({ isDarkTheme }) => (
  <ExtensionWrapper
    sx={{ backgroundColor: isDarkTheme ? "#393F49" : "#D7DADE" }}
  >
    <AccountDiv>
      <KanvasGreen height={70} width={72} />
      <LinkButton onClick={() => (window.location.href = proxyUrl)}>
        <StyledLink style={{ color: "white" }}>Launch Kanvas</StyledLink>
      </LinkButton>
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
          mb={2}
        >
          <Typography whiteSpace="nowrap">Import Design File</Typography>
          <CustomTooltip title="Supported formats: Helm, K8s, Kustomize, Docker Compose">
            <InfoCircleIcon height={24} width={24} />
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

const VersionInfoSection = ({ kanvasVersion, isDarkTheme }) => (
  <MuiBox pt={1.2} display="flex" alignItems="center" gap={1}>
    <CustomTooltip title="Kanvas Server Version">
      <VersionText>{kanvasVersion}</VersionText>
    </CustomTooltip>
    {kanvasVersion && (
      <a
        href={`https://docs.Kanvas.io/project/releases/${kanvasVersion}`}
        target="_blank"
        rel="noreferrer"
        style={{ color: isDarkTheme ? "white" : "black" }}
      >
        <OpenInNewIcon sx={{ width: "0.85rem", verticalAlign: "middle" }} />
      </a>
    )}
  </MuiBox>
);

const UserAccountSection = ({ isDarkTheme }) => {
  const [user, setUser] = useState(null);
  const [kanvasVersion, setKanvasVersion] = useState("");

  useEffect(() => {
    const fetchUserAndVersion = async () => {
      try {
        const [userRes, versionRes] = await Promise.all([
          fetch(`${proxyUrl}/api/user`),
          fetch(`${proxyUrl}/api/system/version`),
        ]);

        const user = JSON.parse(await userRes.text());
        const version = JSON.parse(await versionRes.text());

        setUser(user);
        setKanvasVersion(version?.build || "");
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
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <ExtensionWrapper
      sx={{ backgroundColor: isDarkTheme ? "#393F49" : "#D7DADE" }}
    >
      <AccountDiv>
        {user?.user_id && (
          <MuiBox display="flex" flexDirection="column" alignItems="center">
            <Typography mb={2}>{user.user_id}</Typography>
            <Avatar
              src={user.avatar_url}
              sx={{ width: 80, height: 80, mb: 2 }}
            />
          </MuiBox>
        )}
        <LogoutButton>
          <Button onClick={logout} color="secondary" variant="contained">
            Logout
          </Button>
        </LogoutButton>
        <MuiBox pt={2}>
          <VersionInfoSection
            kanvasVersion={kanvasVersion}
            isDarkTheme={isDarkTheme}
          />
        </MuiBox>
      </AccountDiv>
    </ExtensionWrapper>
  );
};

// ─────── Main Dashboard Component ─────────────────────

export const Dasboard = ({ isDarkMode }) => {
  const isDarkTheme = isDarkMode;

  return (
    <SistentThemeProviderWithoutBaseLine>
      <DocsButton
        isDarkTheme={isDarkTheme}
        onClick={() =>
          window.ddClient.host.openExternal("https://docs.layer5.io/kanvas/")
        }
      />
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
        <UserAccountSection isDarkTheme={isDarkTheme} />
      </SectionWrapper>
    </SistentThemeProviderWithoutBaseLine>
  );
};
