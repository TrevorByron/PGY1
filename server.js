/**
 * Serves this static site on Render (or any Node host) with correct MIME types.
 * Static files must be registered before the SPA-style HTML fallback, or og:image
 * and other assets are returned as text/html and social previews break.
 */
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const root = __dirname;
const rootIndex = path.join(root, "index.html");

app.use(
  express.static(root, {
    index: false,
    fallthrough: true,
    setHeaders(res, filePath) {
      if (filePath.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-cache");
      }
    },
  })
);

app.use((req, res, next) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    next();
    return;
  }
  if (path.extname(req.path)) {
    res.status(404).end();
    return;
  }

  const relativeDir = path.normalize(req.path).replace(/^(\.\.(\/|\\|$))+/, "");
  const nestedIndex = path.resolve(path.join(root, relativeDir, "index.html"));
  const underRoot =
    nestedIndex === rootIndex || nestedIndex.startsWith(root + path.sep);

  if (underRoot && fs.existsSync(nestedIndex)) {
    res.sendFile(nestedIndex);
    return;
  }

  res.sendFile(rootIndex);
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Listening on 0.0.0.0:${port}`);
});
