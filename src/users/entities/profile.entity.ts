import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Profile Model' })
export class Profile {
  @Field(() => ID)
  id: string;

  @Field({ description: 'First Name', nullable: true })
  firstName?: string;

  @Field({ description: 'Other Names', nullable: true })
  otherNames?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  image?: string;
}
