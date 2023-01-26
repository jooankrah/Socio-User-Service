import { Injectable } from '@nestjs/common';
import { Prisma, Role, User } from '@prisma/client';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserInput } from './dto/update-user.input';
import { Profile } from './entities/profile.entity';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  public async createUser(createUserInput: Prisma.UserCreateInput) {
    const { password, ...data } = createUserInput;
    const hashPassword = await argon.hash(password);

    return await this.prisma.user.create({
      data: {
        ...data,
        password: hashPassword,
      },
      include: {
        Profile: true,
      },
    });
  }

  public async findAllUsersByRole(role: Role, options: any) {
    return await this.prisma.user.findMany({
      where: {
        role: role,
      },
      ...options,
    });
  }

  public async findUser(param: { id?: string; email?: string }): Promise<User> {
    return await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            email: param.email,
          },
          {
            id: param.id,
          },
        ],
      },
    });
  }

  public async getUserProfile(id: string) {
    return await this.prisma.user
      .findUnique({
        where: {
          id: id,
        },
      })
      .Profile();
  }

  public async updateUser(email: string, data: any) {
    return await this.prisma.user.update({
      where: {
        email: email,
      },
      data: {
        ...data,
      },
    });
  }

  public async updateUserProfile(id: string, data: any): Promise<Profile> {
    return await this.prisma.profile.update({
      where: {
        userId: id,
      },
      data: {
        ...data,
      },
    });
  }
}
