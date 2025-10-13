const { prisma } = require("../lib/prisma");

class ProductsRepository {
  async findById(id) {
    return await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });
  }

  async create(data) {
    return await prisma.product.create({
      data: {
        name: data.name,
        price: data.price
      }
    });
  }

  async findMany() {
    return await prisma.product.findMany({
      orderBy: {
        name: 'asc'
      }
    });
  }
}

module.exports = { ProductsRepository };




