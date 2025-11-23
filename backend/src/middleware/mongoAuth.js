const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required. Please set JWT_SECRET in your .env file.');
}

/**
 * Middleware para verificar autenticación JWT en rutas MongoDB
 * No consulta ninguna base de datos, solo valida el token y usa el payload
 */
const requireAuthMongo = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization') || req.header('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Token de acceso requerido' 
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Usar directamente el payload del token sin consultar base de datos
    req.user = {
      id: decoded.id,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

/**
 * Middleware para requerir un rol específico
 * @param {string} requiredRole - Rol requerido (ej: 'ADMIN')
 */
const requireRoleMongo = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'No autenticado' 
      });
    }

    if (req.user.role !== requiredRole) {
      return res.status(403).json({ 
        error: 'No tienes permisos para acceder a este recurso' 
      });
    }

    next();
  };
};

module.exports = {
  requireAuthMongo,
  requireRoleMongo,
};

