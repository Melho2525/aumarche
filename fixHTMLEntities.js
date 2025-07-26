const fs = require("fs");
const path = require("path");

const directory = "./"; // point de départ

function walk(dir, callback) {
  fs.readdirSync(dir).forEach((file) => {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);
    if (stat.isDirectory()) {
      walk(filepath, callback);
    } else if (file.endsWith(".tsx") || file.endsWith(".ts") || file.endsWith(".js")) {
      callback(filepath);
    }
  });
}

function fixEntities(file) {
  let content = fs.readFileSync(file, "utf8");
  const newContent = content.replace(/&apos;/g, "'");
  if (newContent !== content) {
    fs.writeFileSync(file, newContent, "utf8");
    console.log(`✅ Fixed HTML entities in ${file}`);
  }
}

walk(directory, fixEntities);
