const app = require("./app");
const { getConfig } = require("./config");

async function main() {
  const { port } = getConfig();
  app.listen(port, () => console.log(`http://localhost:${port}`));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
