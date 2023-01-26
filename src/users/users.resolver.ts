import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  ResolveReference,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { GetUsersByRoleDto } from './dto/get-users';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { AuthenticatedUser } from 'src/decorators/authenticatedUser';
import { User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';
import { updateProfileInput } from './dto/update-userProfile.input';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [User], { name: 'getUsersByRole' })
  findAll(
    @Args('getUsersInput') getUsersInput: GetUsersByRoleDto,
    @AuthenticatedUser() user: any,
  ) {
    const { role, ...options } = getUsersInput;
    return this.usersService.findAllUsersByRole(role, options);
  }

  @Query(() => User, { name: 'getUser' })
  findOne(
    @Args('email', { nullable: true }) email: string,
    @Args('id', { nullable: true }) id: string,
  ): Promise<User> {
    return this.usersService.findUser({ id, email });
  }

  @ResolveField()
  async profile(@Parent() user: User): Promise<Profile> {
    const { id } = user;
    return this.usersService.getUserProfile(id);
  }

  @ResolveReference()
  resolveReference(reference: {
    __typename: string;
    id: string;
  }): Promise<User> {
    return this.usersService.findUser({ id: reference.id });
  }

  @Mutation(() => User, { name: 'createUser' })
  create(@Args('createUserInput') createUserInput: CreateUserDTO) {
    return this.usersService.createUser(createUserInput);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => User, { name: 'updateUser' })
  update(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @AuthenticatedUser() user: any,
  ): Promise<User> {
    return this.usersService.updateUser(user.sub, updateUserInput);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Profile, { name: 'updateProfile' })
  async updateProfile(
    @Args('updateProfileInput') updateProfileInput: updateProfileInput,
    @AuthenticatedUser() user: any,
  ): Promise<Profile> {
    return this.usersService.updateUserProfile(user.id, updateProfileInput);
  }

  // @Mutation('removeUser')
  // remove(@Args('id') id: number) {
  //   return this.usersService.remove(id);
  // }
}
