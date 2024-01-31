import { compare } from 'bcrypt';
import { prisma } from '../db';
import { APIError } from '../errors';
import { authDataI } from './interfaces';
import tokenService from './token.service';

class authService {
  async login(authData: authDataI) {
    const candidate = await prisma.users.findFirst({
      where: {
        login: authData.login,
      },
    });
    if (!candidate) {
      throw APIError.BadRequestError("User doesn't exist");
    }
    const isValidPassword = await compare(
      authData.password,
      candidate.password
    );

    if (!isValidPassword) {
      throw APIError.BadRequestError('The password is invalid');
    }
    const token = tokenService.generateToken({
      id: candidate.id,
    });

    await tokenService.saveToken(candidate.id, token);

    return token;
  }

  async logout(token: string) {
    const userData = await tokenService.verifyToken(token);
    // Middleware уже верифицировал токен
    await tokenService.deleteToken(userData!.id);
  }
}

export default new authService();
