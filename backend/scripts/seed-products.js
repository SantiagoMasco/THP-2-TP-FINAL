const { prisma } = require("../src/lib/prisma");

async function seedProducts() {
  console.log("🌱 Iniciando seed de productos...");

  try {
    // Crear productos de ejemplo
    const products = await Promise.all([
      prisma.product.create({
        data: {
          name: "Impresora HP 2130",
          price: 299.99
        }
      }),
      prisma.product.create({
        data: {
          name: "Mouse Logitech MX Master",
          price: 89.99
        }
      }),
      prisma.product.create({
        data: {
          name: "Teclado Mecánico Corsair K70",
          price: 159.99
        }
      }),
      prisma.product.create({
        data: {
          name: "Monitor Samsung 27 pulgadas",
          price: 349.99
        }
      }),
      prisma.product.create({
        data: {
          name: "Laptop Dell Inspiron 15",
          price: 899.99
        }
      })
    ]);

    console.log(`✅ ${products.length} productos creados exitosamente:`);
    products.forEach(product => {
      console.log(`   - ${product.name} (ID: ${product.id})`);
    });

    console.log("\n📝 Ahora puedes crear tickets con estos productos usando:");
    console.log("   productId: 1, 2, 3, 4 o 5");

  } catch (error) {
    console.error("❌ Error al crear productos:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

seedProducts();





