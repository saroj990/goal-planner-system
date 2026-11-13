import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { User, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUserResponse } from '../auth/auth.types';
import { isAdmin } from '../auth/access';
import { RequestUser } from '../auth/auth.types';

const BCRYPT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  toAuthUser(user: Pick<User, 'id' | 'name' | 'email' | 'role' | 'createdAt'>): AuthUserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  async createWithPassword(
    name: string,
    email: string,
    password: string,
    role: UserRole = UserRole.MEMBER,
  ): Promise<User> {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    return this.prisma.user.create({
      data: { name, email, passwordHash, role },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async listAssignable(
    actor: RequestUser,
  ): Promise<Array<{ id: string; name: string; email: string; role: UserRole }>> {
    if (isAdmin(actor)) {
      return this.prisma.user.findMany({
        where: { role: UserRole.MEMBER },
        orderBy: { name: 'asc' },
        select: { id: true, name: true, email: true, role: true },
      });
    }

    const self = await this.findById(actor.id);
    return [{ id: self.id, name: self.name, email: self.email, role: self.role }];
  }

  async findById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    if (!user.passwordHash) {
      return false;
    }
    return bcrypt.compare(password, user.passwordHash);
  }

  async updateName(userId: string, name: string): Promise<AuthUserResponse> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { name },
    });
    return this.toAuthUser(user);
  }

  async updatePassword(userId: string, password: string): Promise<void> {
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }
}
