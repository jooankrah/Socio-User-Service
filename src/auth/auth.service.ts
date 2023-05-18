import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginResponse } from './dto/login-response';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const foundUser = await this.userService.findUser({ email });
    if (!foundUser) return null;
    const { password: hashedPassword, ...user } = foundUser;
    const isMatch = await argon.verify(hashedPassword, password);
    if (isMatch) {
      return user;
    }
    return null;
  }

  async login(user: User): Promise<LoginResponse> {
    const payload = {
      username: user.username,
      sub: user.email,
      role: user.role,
      id: user.id,
    };
    return {
      user: user,
      access_Token: this.jwtService.sign(payload),
    };
  }
}
