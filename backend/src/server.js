const app = require("./app");
const { getConfig } = require("./config");
const prismaMongo = require("./lib/prismaMongo");

async function main() {
  // Verificar conexión a MongoDB (no crítico para iniciar el servidor)
  try {
    console.log("Verificando conexión a MongoDB...");
    await prismaMongo.$runCommandRaw({ ping: 1 });
    console.log("✅ MongoDB conectado correctamente");
  } catch (error) {
    console.warn("⚠️  Advertencia: No se pudo conectar a MongoDB:", error.message);
    console.warn("⚠️  Las rutas /mongo/* no estarán disponibles, pero el servidor iniciará normalmente");
    console.warn("⚠️  Asegúrate de que MONGODB_URL esté configurado correctamente en .env");
    // No hacemos exit(1) para permitir que el servidor inicie aunque MongoDB falle
  }

  const { port } = getConfig();
  app.listen(port, () => {
    console.log(`🚀 Servidor iniciado en http://localhost:${port}`);
    console.log(`📝 Rutas SQLite disponibles (login, tickets, etc.)`);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
