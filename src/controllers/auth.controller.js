const { UsersRepository } = require('../repositories/users.repo');
const { SignupUseCase } = require('../usecases/auth/signup.usecase');
const { LoginUseCase } = require('../usecases/auth/login.usecase');
const { validateRequiredString } = require('../utils/validators');

const repos = {
  users: new UsersRepository()
};

class AuthController {
  async signup(req, res) {
    try {
      const { email, password } = req.body;
      
      // Validaciones usando validators centralizados
      validateRequiredString(email, 'email');
      validateRequiredString(password, 'password');

      const usecase = new SignupUseCase(repos);
      const user = await usecase.apply({ email, password });
      
      res.status(201).json({
        id: user.id,
        email: user.email,
        role: user.role
      });
    } catch (error) {
      if (error.message === 'Email ya está registrado') {
        return res.status(409).json({ error: error.message });
      }
      // Manejar errores de validación
      if (error.message && (
        error.message.includes('required') || 
        error.message.includes('must be')
      )) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Validaciones usando validators centralizados
      validateRequiredString(email, 'email');
      validateRequiredString(password, 'password');

      const usecase = new LoginUseCase(repos);
      const result = await usecase.apply({ email, password });
      
      res.json({
        token: result.token,
        user: {
          id: result.user.id,
          email: result.user.email,
          role: result.user.role
        }
      });
    } catch (error) {
      if (error.message === 'Credenciales inválidas') {
        return res.status(401).json({ error: error.message });
      }
      // Manejar errores de validación
      if (error.message && (
        error.message.includes('required') || 
        error.message.includes('must be')
      )) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = { AuthController };
