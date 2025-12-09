const bcrypt = require('bcrypt');
const { prisma } = require("../src/lib/prisma");

async function seedUsers() {
  console.log("🌱 Iniciando seed de usuarios...");

  try {
    const password = "password123";
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Definir usuarios de prueba
    const testUsers = [
      {
        name: "Admin",
        email: "admin@test.com",
        role: "ADMIN",
        active: true
      },
      {
        name: "Agente 1",
        email: "agent1@test.com",
        role: "AGENT",
        active: true
      },
      {
        name: "Usuario",
        email: "user@test.com",
        role: "USER",
        active: true
      }
    ];

    const createdUsers = [];
    const updatedUsers = [];

    // Crear o actualizar cada usuario
    for (const userData of testUsers) {
      const existing = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (existing) {
        // Actualizar contraseña y asegurar que esté activo
        await prisma.user.update({
          where: { email: userData.email },
          data: {
            password: hashedPassword,
            role: userData.role,
            active: true
          }
        });
        updatedUsers.push(userData.email);
        console.log(`🔄 ${userData.email} actualizado con nueva contraseña`);
      } else {
        // Crear nuevo usuario
        const user = await prisma.user.create({
          data: {
            ...userData,
            password: hashedPassword
          }
        });
        createdUsers.push(user);
        console.log(`✅ ${userData.email} creado`);
      }
    }

    if (createdUsers.length > 0) {
      console.log(`\n✅ ${createdUsers.length} usuario(s) creado(s) exitosamente`);
    }
    if (updatedUsers.length > 0) {
      console.log(`🔄 ${updatedUsers.length} usuario(s) actualizado(s) exitosamente`);
    }

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

