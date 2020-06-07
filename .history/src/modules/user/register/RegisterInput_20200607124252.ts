import { Length, IsEmail } from "class-validator";
import { InputType, Field } from "type-graphql";
import { isEmailAlreadyExists } from "./isEmailAlreadyExists";

@InputType()
export class RegisterInput {
  @Field()
  @Length(1, 255)
  firstName: string;

  @Field()
  @Length(1, 255)
  lastName: string;

  @Field()
  @IsEmail()
  @isEmailAlreadyExists()
  email: string;

  @Field()
  password: string;
}
