const cors = require("cors");
const responseMiddleware = require("../middlewares/response");
const helmet = require("helmet");

const fs = require("fs");
const path = require("path");
const mime = require("mime-types");

module.exports = function (app, express) {
  app.use(helmet());
  app.use(responseMiddleware);
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  app.use(
    "/uploads/images",
    express.static(path.join(__dirname, "../public/uploads/images"))
  );

  app.get("/uploads/:filename", (req, res) => {
    const filePath = path.join(
      __dirname,
      "../public/uploads",
      req.params.filename
    );

    if (!fs.existsSync(filePath)) return res.status(404).send("File not found");

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    const contentType = mime.lookup(filePath) || "application/octet-stream";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", "inline");

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize)
        return res.status(416).send("Requested range not satisfiable");

      res.status(206); // Partial Content
      res.setHeader("Content-Range", `bytes ${start}-${end}/${fileSize}`);
      res.setHeader("Accept-Ranges", "bytes");
      res.setHeader("Content-Length", end - start + 1);

      fs.createReadStream(filePath, { start, end }).pipe(res);
    } else {
      res.setHeader("Content-Length", fileSize);
      fs.createReadStream(filePath).pipe(res);
    }
  });
};
