import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import DocsIcon from "../../img/SVGs/docsIcon";
import KanvasHorizontalLight from "../../img/SVGs/KanvasHorizontalLight";
import { DockerMuiThemeProvider } from "@docker/docker-mui-theme";
import CssBaseline from "@mui/material/CssBaseline";
import { LoadComp } from "../LoadingComponent/LoadComp";
import {
  LoadingDiv,
  AccountDiv,
  ExtensionWrapper,
  ComponentWrapper,
  SectionWrapper,
  StyledButton,
} from "./styledComponents";
import { randomApplicationNameGenerator } from "../../utils";
import { SistentThemeProviderWithoutBaseLine } from "@sistent/sistent";
import { providerUrl } from "../utils/constants";
import { Dasboard } from "./AuthedDashboard";

// Fallback theme provider for when Docker extension themes aren't available
const DockerMuiThemeProviderWithFallback = ({ children }) => {
  const isDarkMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  // Check if Docker extension themes are available
  if (window.__ddMuiV5Themes) {
    try {
      return React.createElement(DockerMuiThemeProvider, {}, children);
    } catch (error) {
      console.warn(
        "Docker MUI theme provider failed, falling back to default theme:",
        error,
      );
    }
  }

  // Fallback theme configuration
  const fallbackTheme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
      primary: {
        main: "#00B39F",
      },
      secondary: {
        main: "#00D3A9",
      },
      background: {
        default: isDarkMode ? "#121212" : "#ffffff",
        paper: isDarkMode ? "#1e1e1e" : "#ffffff",
      },
    },
  });

  return React.createElement(ThemeProvider, { theme: fallbackTheme }, children);
};

const AuthenticatedMsg = "Authenticated";
const UnauthenticatedMsg = "Unauthenticated";
const proxyUrl = "http://127.0.0.1:7877";
const httpDelete = "DELETE";
const httpPost = "POST";

/**
 * Gets the raw b64 file and convert it to uint8Array
 *
 * @param {string} dataUrl
 * @returns {number[]} - return array of uint8Array
 */
const getUnit8ArrayDecodedFile = (dataUrl) => {
  // Extract base64 content
  const [, base64Content] = dataUrl.split(";base64,");
  // Decode base64 content
  const decodedContent = atob(base64Content);
  // Convert decoded content to Uint8Array directly
  const uint8Array = Uint8Array.from(decodedContent, (char) =>
    char.charCodeAt(0),
  );
  return Array.from(uint8Array);
};

function mergeFullHTMLIntoCurrentPage(htmlString, proxyBase = proxyUrl) {
  const parser = new DOMParser();
  const newDoc = parser.parseFromString(htmlString, "text/html");

  if (!newDoc || !newDoc.head || !newDoc.body) {
    console.error("Invalid HTML content");
    return;
  }

  // === 🔁 Helper: Rewrite absolute paths ===
  const rewriteAbsolutePaths = (str) =>
    str.replace(/(["'`(=])\/(?!\/)/g, `$1${proxyBase}/`);

  const rewriteUrls = (el, attr) => {
    const val = el.getAttribute(attr);
    if (val && val.startsWith("/")) {
      el.setAttribute(attr, proxyBase + val);
    }
  };

  const tagsToRewrite = [
    { tag: "script", attr: "src" },
    { tag: "link", attr: "href" },
    { tag: "img", attr: "src" },
    { tag: "iframe", attr: "src" },
    { tag: "source", attr: "src" },
    { tag: "video", attr: "src" },
    { tag: "audio", attr: "src" },
    { tag: "a", attr: "href" },
  ];

  // === 🔁 Rewrite URLs in newDoc ===
  tagsToRewrite.forEach(({ tag, attr }) => {
    newDoc.querySelectorAll(tag).forEach((el) => rewriteUrls(el, attr));
  });

  // === 🔁 Rewrite inline API references in <script>, <style>, etc. ===
  const textContentTags = ["script", "style", "template"];
  textContentTags.forEach((tag) => {
    newDoc.querySelectorAll(tag).forEach((el) => {
      if (el.textContent && el.textContent.includes('"api/')) {
        el.textContent = rewriteAbsolutePaths(el.textContent);
      }
    });
  });

  // === ⚡ Replace <body> ===
  document.body.replaceWith(newDoc.body.cloneNode(true));

  // === 🧠 Merge <head> ===
  const existingHead = document.head;
  const existingTags = Array.from(existingHead.children).map(
    (el) => el.outerHTML,
  );

  Array.from(newDoc.head.children).forEach((el) => {
    const html = el.outerHTML;
    if (existingTags.includes(html)) return;

    if (tagsToRewrite.some(({ tag }) => tag === el.tagName.toLowerCase())) {
      const { attr } = tagsToRewrite.find(
        (t) => t.tag === el.tagName.toLowerCase(),
      );
      rewriteUrls(el, attr);
    }

    if (el.tagName === "SCRIPT") {
      const newScript = document.createElement("script");
      for (let attr of el.attributes) {
        newScript.setAttribute(attr.name, attr.value);
      }
      newScript.textContent = rewriteAbsolutePaths(el.textContent || "");
      existingHead.appendChild(newScript);
    } else {
      existingHead.appendChild(el.cloneNode(true));
    }
  });
}

export function RemoteShellLoader() {
  useEffect(() => {
    async function loadRemoteHTML() {
      try {
        const response = await fetch(proxyUrl, {
          credentials: "include", // optional
        });

        if (!response.ok) throw new Error("Failed to load remote HTML");

        const html = await response.text();

        mergeFullHTMLIntoCurrentPage(html);
      } catch (error) {
        console.error("Failed to load remote index.html", error);
      }
    }

    loadRemoteHTML();
  }, []);

  return null; // optionally show loading spinner
}

const useThemeDetector = () => {
  const getCurrentTheme = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [isDarkTheme, setIsDarkTheme] = useState(getCurrentTheme());
  const mqListener = (e) => {
    setIsDarkTheme(e.matches);
  };

  useEffect(() => {
    const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
    darkThemeMq.addListener(mqListener);
    return () => darkThemeMq.removeListener(mqListener);
  }, []);
  return isDarkTheme;
};

const ExtensionsComponent = () => {
  // const [switchesState, setSwitchesState] = useState(null)
  const [isHovered, setIsHovered] = useState(false);
  const isDarkTheme = useThemeDetector();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState("");
  const [token, setToken] = useState();
  const [changing, isChanging] = useState(false);
  // const [emptystate, isEmptystate] = useState(true)
  // const [meshAdapters, setMeshAdapters] = useState(null)
  const [catalogDesigns, setCatalogDesigns] = useState(null);
  const [filter, setFilter] = useState(null);
  const [userDesigns, setUserDesigns] = useState(null);

  const [KanvasVersion, setKanvasVersion] = useState(null);

  const logout = () => {
    fetch(proxyUrl + "/token", { method: httpDelete })
      .then(console.log)
      .catch(console.error);
  };

  useEffect(() => {
    let ws = new WebSocket("ws://127.0.0.1:7877/ws");
    ws.onmessage = (msg) => {
      if (msg.data === AuthenticatedMsg) setIsLoggedIn(true);
      if (msg.data === UnauthenticatedMsg) {
        setIsLoggedIn(false);
      }
    };
    return () => ws.close();
  }, []);

  // Event Interceptor to redirect all external links
  useEffect(() => {
    const handleLinkClick = (event) => {
      const target = event.target.closest("a");

      // Ensure the target is an anchor tag with a valid href and external link
      if (target && target.href && target.href.startsWith("http")) {
        event.preventDefault();
        window.ddClient.host.openExternal(target.href);
      }
    };

    // Attach the event listener to a specific container (if possible), or use document
    const container = document.getElementById("root") || document;
    container.addEventListener("click", handleLinkClick);

    // Cleanup the event listener on unmount
    return () => {
      container.removeEventListener("click", handleLinkClick);
    };
  }, []);

  useEffect(() => {
    fetch(proxyUrl + "/token")
      .then((res) => res.text())
      .then((res) => {
        setToken(res);
        if (res !== "null") {
          setIsLoggedIn(true);

          fetch(proxyUrl + "/api/user")
            .then((res) => res.text())
            .then((res) => {
              setUser(JSON.parse(res));
            })
            .catch(console.error);
          // fetch(proxyUrl + '/api/system/sync')
          //   .then((res) => res.json())
          //   .then((data) => {
          //     setMeshAdapters(data.meshAdapters)
          //     isEmptystate(false)
          //   })
          //   .catch(console.err)
          fetch(proxyUrl + "/api/system/version")
            .then((result) => result.text())
            .then((result) => setKanvasVersion(JSON.parse(result)?.build))
            .catch(console.error);
          fetch(`${providerUrl}/api/catalog/content/pattern`)
            .then((result) => result.text())
            .then((result) => {
              setCatalogDesigns(JSON.parse(result));
            })
            .catch(console.error);
          fetch(`${providerUrl}/api/catalog/content/filter`)
            .then((result) => result.text())
            .then((result) => {
              setFilter(JSON.parse(result));
            })
            .catch(console.error);
        }
      })
      .catch(console.error);
  }, [isLoggedIn]);

  useEffect(() => {
    if (user?.id) {
      fetch(`${providerUrl}/api/catalog/content/pattern?userid=${user?.id}`)
        .then((result) => result.text())
        .then((result) => {
          setUserDesigns(JSON.parse(result));
        })
        .catch(console.error);
    }
  }, [user]);

  const onMouseOver = (e) => {
    let target = e.target.closest("div");
    target.style.transition = "all .5s";
    target.style.transform = "scale(1)";
  };
  const onMouseOut = (e) => {
    setIsHovered(!isHovered);
    let target = e.target.closest("div");
    target.style.transition = "all .8s";
    target.style.transform = "scale(1)";
  };
  const onClick = (e) => {
    let target = e.target.closest("div");
    target.style.transition = "all .2s";
    target.style.transform = "scale(0.8)";
    isChanging(true);
    setIsHovered(true);
  };

  const OpenDocs = () => {
    // window.location.href = proxyUrl;
    window.ddClient.host.openExternal(`https://docs.layer5.io/kanvas/`);
  };

  if (isLoggedIn && token) {
    return (
      <DockerMuiThemeProviderWithFallback>
        <CssBaseline />
        <Dasboard isDarkMode={isDarkTheme} token={token} />
      </DockerMuiThemeProviderWithFallback>
    );
  }

  return (
    <DockerMuiThemeProviderWithFallback>
      <CssBaseline />
      {changing && (
        <LoadingDiv sx={{ opacity: "1" }}>
          <LoadComp />
        </LoadingDiv>
      )}
      <ComponentWrapper sx={{ opacity: changing ? "0.3" : "1" }}>
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
              {!isLoggedIn ? (
                <StyledButton
                  sx={{ marginTop: "0.3rem" }}
                  variant="contained"
                  disabled={isLoggedIn}
                  color="primary"
                  component="span"
                  onClick={() => {
                    const url =
                      providerUrl +
                      "?source=aHR0cDovL2xvY2FsaG9zdDo3ODc3L3Rva2VuL3N0b3Jl&provider_version=v0.3.14";
                    console.log("provider url", url);
                    window?.ddClient?.host?.openExternal?.(url);
                  }}
                >
                  Login
                </StyledButton>
              ) : (
                <></>
              )}
            </AccountDiv>
          </ExtensionWrapper>
        </SectionWrapper>
      </ComponentWrapper>
    </DockerMuiThemeProviderWithFallback>
  );
};

export default ExtensionsComponent;
