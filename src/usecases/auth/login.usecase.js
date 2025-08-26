const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UseCase } = require('../base');
const { JWT_SECRET } = require('../../middleware/auth');

class LoginUseCase extends UseCase {
  constructor(repos) {
    super();
    this.repos = repos;
  }

  async apply(input) {
    const { email, password } = input;
    
    // Buscar usuario por email
    const user = await this.repos.users.findByEmail(email);
    let userFound = false;
    let isValidPassword = false;
    
    if (user && user.active) {
      userFound = true;
      // Verificar password
      isValidPassword = await bcrypt.compare(password, user.password);
    }

    if (!userFound || !isValidPassword) {
      throw new Error('Credenciales inválidas');
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    };
  }
}

module.exports = { LoginUseCase };
