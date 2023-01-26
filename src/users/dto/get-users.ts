import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { QueryOptions } from './queryOptions';
import Role from '../entities/role.enum';

@InputType()
export class GetUsersByRoleDto extends QueryOptions {
  @Field(() => Role, { nullable: false })
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}
