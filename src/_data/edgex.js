// EdgeX form builder (leads). The key is a public `crm_live_` key meant for browser forms, like the admizz site.
// Read from the environment, or from a local .env file when building outside Docker.
const fs = require("fs");
const path = require("path");

function readKey() {
  if (process.env.EDGEX_API_KEY) return process.env.EDGEX_API_KEY.trim();
  try {
    const line = fs
      .readFileSync(path.join(__dirname, "..", "..", ".env"), "utf8")
      .split("\n")
      .find((l) => l.startsWith("EDGEX_API_KEY="));
    return line ? line.slice("EDGEX_API_KEY=".length).trim() : "";
  } catch (e) {
    return "";
  }
}

module.exports = {
  key: readKey(),
  base: "https://edgex.zunkireelabs.com/api/public/submit/zennly/",
  forms: { trial: "try-for-free" },
};
