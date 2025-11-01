const { prisma } = require("../lib/prisma");
const { DEFAULT_USER_ROLE } = require("../constants/enums");

class UsersRepository {
  async findById(id) {
    return await prisma.user.findUnique({
      where: { id: parseInt(id) }
    });
  }

  async findByEmail(email) {
    return await prisma.user.findUnique({
      where: { email }
    });
  }

  async create(data) {
    return await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password || null, // Manejar password opcional
        role: data.role || DEFAULT_USER_ROLE,
        active: data.active !== undefined ? data.active : true
      }
    });
  }

  async update(id, data) {
    return await prisma.user.update({
      where: { id: parseInt(id) },
      data
    });
  }

  async paginate({ skip, take, where = {} }) {
    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          active: true,
          createdAt: true,
          updatedAt: true
          // No exponer password en listados
        }
      }),
      prisma.user.count({ where })
    ]);

    return { data, total };
  }
}

module.exports = { UsersRepository };
