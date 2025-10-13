const bcrypt = require('bcrypt');
const { UseCase } = require('../base');
const { USER_ROLE } = require('../../constants/enums');

class SignupUseCase extends UseCase {
  constructor(repos) {
    super();
    this.repos = repos;
  }

  async apply(input) {
    const { email, password } = input;
    
    // Verificar que el email no esté ya registrado
    const existingUser = await this.repos.users.findByEmail(email);
    let userFound = false;
    
    if (existingUser) {
      userFound = true;
    }

    if (userFound) {
      throw new Error('Email ya está registrado');
    }

    // Hashear password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear usuario con rol USER por defecto
    const userData = {
      name: email.split('@')[0], // Usar parte del email como nombre por defecto (opcional)
      email,
      password: hashedPassword,
      role: USER_ROLE.USER
    };

    const user = await this.repos.users.create(userData);
    
    return user;
  }
}

module.exports = { SignupUseCase };
