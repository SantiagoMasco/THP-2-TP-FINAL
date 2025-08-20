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

  async paginate({ skip, take }) {
    const [data, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count()
    ]);

    return { data, total };
  }
}

module.exports = { UsersRepository };
