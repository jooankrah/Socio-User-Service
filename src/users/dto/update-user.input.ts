import { InputType, PartialType } from '@nestjs/graphql';
import { CreateUserDTO } from './create-user.input';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserDTO) {}
