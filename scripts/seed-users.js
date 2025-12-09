const bcrypt = require('bcrypt');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedUsers() {
  console.log("🌱 Iniciando seed de usuarios...");

  try {
    const password = "password123";
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Verificar si los usuarios ya existen
    const existingAdmin = await prisma.user.findUnique({
      where: { email: "admin@test.com" }
    });
    const existingAgent = await prisma.user.findUnique({
      where: { email: "agent1@test.com" }
    });
    const existingUser = await prisma.user.findUnique({
      where: { email: "user@test.com" }
    });

    const usersToCreate = [];

    if (!existingAdmin) {
      usersToCreate.push({
        name: "Admin",
        email: "admin@test.com",
        password: hashedPassword,
        role: "ADMIN",
        active: true
      });
    } else {
      console.log("⚠️  admin@test.com ya existe, omitiendo...");
    }

    if (!existingAgent) {
      usersToCreate.push({
        name: "Agente 1",
        email: "agent1@test.com",
        password: hashedPassword,
        role: "AGENT",
        active: true
      });
    } else {
      console.log("⚠️  agent1@test.com ya existe, omitiendo...");
    }

    if (!existingUser) {
      usersToCreate.push({
        name: "Usuario",
        email: "user@test.com",
        password: hashedPassword,
        role: "USER",
        active: true
      });
    } else {
      console.log("⚠️  user@test.com ya existe, omitiendo...");
    }

    if (usersToCreate.length === 0) {
      console.log("✅ Todos los usuarios de prueba ya existen.");
      return;
    }

    // Crear usuarios
    const users = await Promise.all(
      usersToCreate.map(userData => 
        prisma.user.create({ data: userData })
      )
    );

    console.log(`✅ ${users.length} usuario(s) creado(s) exitosamente:`);
    users.forEach(user => {
      console.log(`   - ${user.email} (${user.role}) - ID: ${user.id}`);
    });

    console.log("\n📝 Credenciales de acceso:");
    console.log("   Email: admin@test.com | Password: password123 (ADMIN)");
    console.log("   Email: agent1@test.com | Password: password123 (AGENT)");
    console.log("   Email: user@test.com | Password: password123 (USER)");

  } catch (error) {
    console.error("❌ Error al crear usuarios:", error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedUsers();

