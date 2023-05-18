import { Directive, Field, ObjectType } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { Profile } from './profile.entity';

@ObjectType({ description: 'User model' })
@Directive('@key(fields: "id")')
export class User {
  @Field({ nullable: false })
  id: string;

  @Field({ nullable: false })
  email: string;

  @Field({ nullable: true })
  username: string;

  @Field(() => Role, { nullable: false })
  role: Role;

  @Field(() => Profile, { nullable: true })
  profile?: Profile;
}
