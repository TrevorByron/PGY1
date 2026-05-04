/**
 * Serves this static site on Render (or any Node host) with correct MIME types.
 * Static files must be registered before the SPA-style HTML fallback, or og:image
 * and other assets are returned as text/html and social previews break.
 */
const express = require("express");
const path = require("path");

const app = express();
const root = __dirname;

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
  res.sendFile(path.join(root, "index.html"));
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
