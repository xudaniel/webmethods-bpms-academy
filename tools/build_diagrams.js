// Writes standalone SVG files for diagrams that are referenced as images (knowledge topics).
// Usage: node tools/build_diagrams.js
const fs = require("fs");
const path = require("path");
const { D } = require("../js/diagrams.js");
for (const key of ["process-vs-rules", "rule-task-hot-deploy"]) {
  const out = path.join(__dirname, "..", "assets", "diagrams", key + ".svg");
  fs.writeFileSync(out, '<?xml version="1.0" encoding="UTF-8"?>\n' + D[key].draw(true) + "\n");
  console.log("wrote", path.relative(process.cwd(), out));
}
