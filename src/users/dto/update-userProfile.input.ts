import { InputType, PartialType } from '@nestjs/graphql';
import { Profile } from '../entities/profile.entity';

@InputType()
export class updateProfileInput extends PartialType(Profile, InputType) {}
