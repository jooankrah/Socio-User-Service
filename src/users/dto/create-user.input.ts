import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';
import Role from '../entities/role.enum';

@InputType()
export class CreateUserDTO {
  @Field()
  @IsNotEmpty({
    message: 'Please provide a valid email',
  })
  @IsEmail(
    {},
    {
      message: 'Invalid email provided',
    },
  )
  email: string;

  @Field()
  @IsNotEmpty()
  password: string;

  @Field()
  username: string;

  @Field(() => Role, {
    description: "Users' role; must be a valid value of admin | user",
  })
  role: Role;
}
