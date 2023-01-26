import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login-input';
import { LoginResponse } from './dto/login-response';

@Resolver('auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Mutation(() => LoginResponse, { name: 'login' })
  async login(@Args('loginInput') loginInput: LoginInput, @Context() context) {
    return this.authService.login(context.user);
  }
}
