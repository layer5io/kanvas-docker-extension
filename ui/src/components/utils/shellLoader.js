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
