import { Injectable, Logger } from '@nestjs/common';
import { Prisma, Role, User } from '@prisma/client';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserInput } from './dto/update-user.input';
import { Profile } from './entities/profile.entity';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private logger = new Logger(UsersService.name);

  public async createUser(createUserInput: Prisma.UserCreateInput) {
    const { password, ...data } = createUserInput;
    const hashPassword = await argon.hash(password);

    try {
      await this.prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            ...data,
            password: hashPassword,
          },
        });

        await tx.profile.create({
          data: {
            userId: user.id,
          },
        });

        return user;
      });
    } catch (error) {
      this.logger.error('Error creating user Account', error);
      return null;
    }
  }

  public async findAllUsersByRole(role: Role, options: any) {
    try {
      return await this.prisma.user.findMany({
        where: {
          role: role,
        },
        ...options,
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async findUser(param: { id?: string; email?: string }): Promise<User> {
    try {
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
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async getUserProfile(id: string) {
    try {
      return await this.prisma.user
        .findUnique({
          where: {
            id: id,
          },
        })
        .profile();
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async updateUser(email: string, data: any) {
    try {
      return await this.prisma.user.update({
        where: {
          email: email,
        },
        data: {
          ...data,
        },
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async updateUserProfile(id: string, data: any): Promise<Profile> {
    try {
      return await this.prisma.profile.update({
        where: {
          userId: id,
        },
        data: {
          ...data,
        },
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
