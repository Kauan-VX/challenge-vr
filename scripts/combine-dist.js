const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const out = path.join(root, "out");

const layout = [
  { from: "packages/shell/dist", to: "" },
  { from: "packages/header/dist", to: "header" },
  { from: "packages/footer/dist", to: "footer" },
  { from: "packages/cards/dist", to: "cards" },
];

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

for (const { from, to } of layout) {
  const src = path.join(root, from);
  if (!fs.existsSync(src)) {
    throw new Error(`Missing build output: ${from}. Run 'npm run build' first.`);
  }
  const dest = to ? path.join(out, to) : out;
  fs.mkdirSync(dest, { recursive: true });
  fs.cpSync(src, dest, { recursive: true });
  console.log(`copied ${from} -> out/${to || "(root)"}`);
}

console.log("\nCombined output ready at out/");
