import { execSync } from "node:child_process";
import pkg from "../package.json" with { type: "json" };

const version = pkg.version;

const targets = [
  ["bun-windows-x64", `TravelAlbums-${version}-win32.exe`],
  ["bun-windows-arm64", `TravelAlbums-${version}-arm64.exe`],
];

for (const [target, outfile] of targets) {
  execSync(
    `bun build server.mjs --compile --target=${target} --outfile=${outfile}`,
    { stdio: "inherit" }
  );
}
