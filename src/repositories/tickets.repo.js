const { prisma } = require("../lib/prisma");

class TicketsRepository {
  async findById(id) {
    return await prisma.ticket.findUnique({
      where: { id: parseInt(id) },
      include: {
        createdBy: true,
        assignedTo: true
      }
    });
  }

  async create(data) {
    return await prisma.ticket.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status || "open",
        priority: data.priority || "med",
        category: data.category,
        createdByUserId: parseInt(data.createdByUserId),
        assignedUserId: data.assignedUserId ? parseInt(data.assignedUserId) : null
      },
      include: {
        createdBy: true,
        assignedTo: true
      }
    });
  }

  async update(id, data) {
    return await prisma.ticket.update({
      where: { id: parseInt(id) },
      data,
      include: {
        createdBy: true,
        assignedTo: true
      }
    });
  }

  async delete(id) {
    await prisma.ticket.delete({
      where: { id: parseInt(id) }
    });
    return { success: true };
  }

  async list({ where, skip, take }) {
    return await prisma.ticket.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: true,
        assignedTo: true
      }
    });
  }

  async count(where) {
    return await prisma.ticket.count({
      where
    });
  }
}

module.exports = { TicketsRepository };
