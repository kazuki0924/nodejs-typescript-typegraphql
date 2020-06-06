/** @format */

import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Root,
  FieldResolver,
} from "type-graphql";
import * as bcrypt from "bcryptjs";

import { User } from "../../entity/User";

@Resolver(User)
export class RegisterResolver {
  @Query(() => String, { nullable: true })
  async hello() {
    return "Hello World";
  }

  @FieldResolver()
  async name(@Root() parent: User) {
    return `${parent.firstName} ${parent.lastName}`;
  }

  @Mutation(() => String, { nullable: true })
  async register(
    @Arg("firstName") firstName: string,
    @Arg("lastName") lastName: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    }).save();

    return user;
  }
}
