import { useState, useEffect } from "react";
import { Typography, Button } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Avatar } from "@mui/material";
import KanvasGreen from "../../img/SVGs/KanvasGreen";
import DocsIcon from "../../img/SVGs/docsIcon";
import KanvasHorizontalLight from "../../img/SVGs/KanvasHorizontalLight";
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
import { randomApplicationNameGenerator } from "../../utils";
import {
  SistentThemeProviderWithoutBaseLine,
  InfoCircleIcon,
  CustomTooltip,
  Box,
  // CustomTooltip,
} from "@sistent/sistent";
import { SELECTED_PROVIDER_NAME } from "../utils/constants";
import { getBase64EncodedFile, getUnit8ArrayDecodedFile } from "../utils/file";

const proxyUrl = "http://127.0.0.1:7877";
const httpDelete = "DELETE";

export const Dasboard = ({ isDarkMode, token }) => {
  const isDarkTheme = isDarkMode;
  const [user, setUser] = useState("");

  const [KanvasVersion, setKanvasVersion] = useState(null);

  const logout = () => {
    fetch(proxyUrl + "/token", { method: httpDelete })
      .then(console.log)
      .catch(console.error);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user
        const userRes = await fetch(`${proxyUrl}/api/user`);
        const userText = await userRes.text();
        const userData = JSON.parse(userText);
        setUser(userData);

        // Fetch version
        const versionRes = await fetch(`${proxyUrl}/api/system/version`);
        const versionText = await versionRes.text();
        const versionData = JSON.parse(versionText);
        setKanvasVersion(versionData?.build);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };

    fetchData();
  }, []);

  const handleImport = async (e) => {
    try {
      const file = e.target?.files?.[0];

      if (!file) {
        window.ddClient.desktopUI.toast.error("No file selected.");
        return;
      }

      const name = randomApplicationNameGenerator();
      const base64File = await getBase64EncodedFile(file);
      console.log("base64", base64File);

      const body = JSON.stringify({
        name,
        file: getUnit8ArrayDecodedFile(base64File),
        file_name: file.name,
      });

      const res = await fetch(proxyUrl + "/api/pattern/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
        body,
      });

      if (!res.ok) throw new Error("Upload failed");

      window.ddClient.desktopUI.toast.success(
        `Design file has been uploaded with name: ${name}`,
      );
    } catch (err) {
      console.error("Error uploading file:", err);
      window.ddClient.desktopUI.toast.error(
        "Some error occurred while uploading the design file.",
      );
    }
  };

  const OpenDocs = () => {
    // window.location.href = proxyUrl;
    window.ddClient.host.openExternal(`https://docs.layer5.io/kanvas/`);
  };

  const launchKanvas = () => {
    console.log("Launching Kanvas...");
    window.location.href = proxyUrl;
  };

  return (
    <div>
      <SistentThemeProviderWithoutBaseLine>
        <StyledButton
          size="small"
          onClick={() => OpenDocs()}
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
            alt="Docs"
          />
          &nbsp;Docs
        </StyledButton>
      </SistentThemeProviderWithoutBaseLine>
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
        }}
      >
        <div>
          <KanvasHorizontalLight
            width="600"
            height="auto"
            CustomColor={isDarkTheme ? "white" : "#3C494F"}
          />

          <Typography sx={{ margin: "auto", paddingTop: "-1rem" }}>
            Design and operate your cloud native deployments with Kanvas.
          </Typography>
        </div>
      </div>

      <SectionWrapper>
        <ExtensionWrapper
          className="third-step"
          sx={{ backgroundColor: isDarkTheme ? "#393F49" : "#D7DADE" }}
        >
          <AccountDiv>
            <div style={{ marginBottom: "0.5rem" }}>
              <a
                style={{ textDecoration: "none" }}
                href={
                  token &&
                  `http://localhost:9081/api/user/token?token=" +
                      token +
                      "&provider=${SELECTED_PROVIDER_NAME}`
                }
              >
                <div>
                  <KanvasGreen height={70} width={72} />
                </div>
              </a>
              <LinkButton onClick={launchKanvas}>
                <StyledLink
                  style={{ textDecoration: "none", color: "white" }}
                  // href={
                  //   token &&
                  //   `http://localhost:9081/api/user/token?token=" +
                  //     token +
                  //     "&provider=${SELECTED_PROVIDER_NAME}`
                  // }
                >
                  Launch Kanvas
                </StyledLink>
              </LinkButton>
            </div>
          </AccountDiv>
        </ExtensionWrapper>
        <ExtensionWrapper
          className="second-step"
          sx={{ backgroundColor: isDarkTheme ? "#393F49" : "#D7DADE" }}
        >
          <AccountDiv>
            <Box
              display="flex"
              gap={2}
              mb="2rem"
              alignItems={"center"}
              justifyItems={"center"}
              justifyContent={"space-between"}
            >
              <Typography sx={{ whiteSpace: " nowrap" }}>
                Import Design File
              </Typography>
              <CustomTooltip title="Supported file types include Kubernetes manifests, Helm charts, Kustomize, and Docker Compose. Learn more at https://docs.kanvas.new">
                <div>
                  <InfoCircleIcon
                    height={24}
                    width={24}
                    style={{ minWidth: "auto", marginLeft: "8px" }}
                  />
                </div>
              </CustomTooltip>
            </Box>
            <div style={{ paddingBottom: "1rem" }}>
              <label htmlFor="upload-button">
                <StyledButton
                  variant="contained"
                  color="primary"
                  aria-label="Upload Button"
                  component="span"
                >
                  <input
                    id="upload-button"
                    type="file"
                    accept=".yaml, .yml"
                    hidden
                    name="upload-button"
                    onChange={handleImport}
                  />
                  Browse...
                </StyledButton>
              </label>
            </div>
          </AccountDiv>
        </ExtensionWrapper>

        <div>
          <ExtensionWrapper
            className="third-step"
            sx={{ backgroundColor: isDarkTheme ? "#393F49" : "#D7DADE" }}
          >
            <AccountDiv>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {user?.user_id && (
                  <Typography
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      marginBottom: "1.5rem",
                    }}
                  >
                    {user?.user_id}
                    <Avatar
                      src={user?.avatar_url}
                      sx={{
                        width: "5rem",
                        height: "5rem",
                        marginTop: "1.5rem",
                      }}
                    />
                  </Typography>
                )}
                <LogoutButton
                  variant="p"
                  component="p"
                  style={{
                    transform: "none",
                  }}
                >
                  <Button
                    onClick={logout}
                    color="secondary"
                    component="span"
                    variant="contained"
                  >
                    Logout
                  </Button>
                </LogoutButton>
              </div>
            </AccountDiv>
          </ExtensionWrapper>
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <div style={{ paddingTop: "1.2rem" }}>
          <CustomTooltip title="Kanvas Server version">
            <VersionText variant="span" component="span" align="end">
              {KanvasVersion || ""}
            </VersionText>
          </CustomTooltip>
          <a
            href={`https://docs.Kanvas.io/project/releases/${KanvasVersion}`}
            target="_blank"
            rel="noreferrer"
            style={{ color: isDarkTheme ? "white" : "black" }}
          >
            <OpenInNewIcon
              style={{ width: "0.85rem", verticalAlign: "middle" }}
            />
          </a>
        </div>
      </SectionWrapper>
    </div>
  );
};
