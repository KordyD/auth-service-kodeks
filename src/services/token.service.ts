import { sign, verify } from 'jsonwebtoken';
import { prisma } from '../db';

class tokenService {
  private secretKey;
  constructor() {
    this.secretKey = process.env.JWT_SECRET_KEY || 'shh';
  }
  generateToken(payload: Object) {
    return sign(payload, this.secretKey, { expiresIn: '15m' });
  }
  async saveToken(userId: number, token: string) {
    await prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        token: token,
      },
    });
  }
  async deleteToken(userId: number) {
    await prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        token: null,
      },
    });
  }
  async verifyToken(token: string) {
    try {
      verify(token, this.secretKey);
      const userData = await prisma.users.findFirst({
        where: { token },
      });
      return userData;
    } catch (error) {
      return null;
    }
  }
}

export default new tokenService();
