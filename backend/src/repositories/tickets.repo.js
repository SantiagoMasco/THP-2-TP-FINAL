const { prisma } = require("../lib/prisma");
const { DEFAULT_TICKET_STATUS, DEFAULT_TICKET_PRIORITY, VALID_TICKET_STATUSES } = require("../constants/enums");

class TicketsRepository {
  async findById(id) {
    return await prisma.ticket.findUnique({
      where: { id: parseInt(id) },
      include: {
        createdBy: true,
        assignedTo: true,
        product: true
      }
    });
  }

  async create(data) {
    return await prisma.ticket.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status || DEFAULT_TICKET_STATUS,
        priority: data.priority || DEFAULT_TICKET_PRIORITY,
        category: data.category,
        createdByUserId: parseInt(data.createdByUserId),
        assignedUserId: data.assignedUserId ? parseInt(data.assignedUserId) : null,
        productId: data.productId ? parseInt(data.productId) : null
      },
      include: {
        createdBy: true,
        assignedTo: true,
        product: true
      }
    });
  }

  async update(id, data) {
    return await prisma.ticket.update({
      where: { id: parseInt(id) },
      data,
      include: {
        createdBy: true,
        assignedTo: true,
        product: true
      }
    });
  }

  async delete(id) {
    await prisma.ticket.delete({
      where: { id: parseInt(id) }
    });
    return { success: true };
  }

  async findMany({ where, orderBy, skip, take }) {
    // OrderBy compuesto por defecto optimizado para índices
    const defaultOrderBy = [
      { createdAt: 'desc' },
      { id: 'desc' }
    ];

    return await prisma.ticket.findMany({
      where,
      orderBy: orderBy || defaultOrderBy,
      skip,
      take,
      include: {
        createdBy: true,
        assignedTo: true,
        product: true
      }
    });
  }

  async count(where) {
    return await prisma.ticket.count({
      where
    });
  }

  async countByStatus(where) {
    const results = {};

    // Inicializar todos los estados con 0
    for (const status of VALID_TICKET_STATUSES) {
      results[status] = 0;
    }

    // Obtener conteos reales desde la base de datos
    const counts = await prisma.ticket.groupBy({
      by: ['status'],
      where,
      _count: {
        status: true
      }
    });

    // Mapear los resultados
    for (const count of counts) {
      if (VALID_TICKET_STATUSES.includes(count.status)) {
        results[count.status] = count._count.status;
      }
    }

    return results;
  }
}

module.exports = { TicketsRepository };
