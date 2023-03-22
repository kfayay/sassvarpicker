"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getColorVars = void 0;
const fs = require("fs");
const path = require("path");
function getColorVars() {
    const config = JSON.parse(fs.readFileSync(path.join(__dirname, "../sassvarpickerc.json"), "utf-8"));
    const colors = [];
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
exports.getColorVars = getColorVars;
//# sourceMappingURL=config.js.map