const { prisma } = require("../lib/prisma");

class SettingsRepository {
  async getSettings() {
    let settings = await prisma.appSettings.findFirst();
    
    // Si no existe, crear configuración inicial
    if (!settings) {
      settings = await prisma.appSettings.create({
        data: {
          lastAssignedAgentId: null
        }
      });
    }
    
    return settings;
  }

  async updateLastAssignedAgent(agentId) {
    const settings = await this.getSettings();
    
    return await prisma.appSettings.update({
      where: { id: settings.id },
      data: {
        lastAssignedAgentId: agentId
      }
    });
  }

  async getNextAgent() {
    // Obtener agentes activos ordenados por id ASC
    const agents = await prisma.user.findMany({
      where: {
        role: 'AGENT',
        active: true
      },
      orderBy: { id: 'asc' },
      select: { id: true }
    });

    if (agents.length === 0) {
      return null; // No hay agentes disponibles
    }

    // Obtener configuración actual
    const settings = await this.getSettings();
    const lastAssignedId = settings.lastAssignedAgentId;

    let nextAgent;
    
    if (!lastAssignedId) {
      // Primera asignación: usar el primer agente
      nextAgent = agents[0];
    } else {
      // Buscar el índice del último agente asignado
      const lastIndex = agents.findIndex(agent => agent.id === lastAssignedId);
      
      if (lastIndex === -1 || lastIndex === agents.length - 1) {
        // Si no se encuentra o es el último, volver al primero (round-robin)
        nextAgent = agents[0];
      } else {
        // Usar el siguiente agente
        nextAgent = agents[lastIndex + 1];
      }
    }

    // Actualizar el último agente asignado (con transacción implícita)
    await this.updateLastAssignedAgent(nextAgent.id);
    
    return nextAgent;
  }
}

module.exports = { SettingsRepository };
