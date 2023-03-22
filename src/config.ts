import * as fs from "fs";
import * as path from "path";

interface Config {
  scssPaths: { path: string; alias: string }[];
}

export function getColorVars() {
  const config: Config = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../sassvarpickerc.json"), "utf-8")
  );

  const colors: { name: string; value: string }[] = [];

  config.scssPaths.forEach(({ path: scssPath }) => {
    const scssContent = fs.readFileSync(scssPath, "utf-8");
    const colorRegex = /\$([a-zA-Z0-9_-]+):\s*(#[a-zA-Z0-9]+);/g;

    let match;
    while ((match = colorRegex.exec(scssContent)) !== null) {
      colors.push({ name: match[1], value: match[2] });
    }
  });

  return colors;
}
