// import {
//   Resolver,
//   Mutation,
//   Arg,
//   ClassType,
//   Field,
//   InputType,
// } from "type-graphql";
// import { User } from "../../entity/User";
// import { RegisterInput } from "./register/RegisterInput";
// import { Product } from "../../entity/Product";

// function createBaseResolver<T extends ClassType, X extends ClassType>(
//   suffix: string,
//   returnType: T,
//   inputType: X,
//   entity: any
// ) {
//   @Resolver({ isAbstract: true })
//   abstract class BaseResolver {
//     @Mutation(() => returnType, { name: `create${suffix}` })
//     async createUser(@Arg("data", () => inputType) data: any) {
//       return entity.create(data).save();
//     }
//   }

//   return BaseResolver;
// }

// @InputType()
// class ProductInput {
//   @Field()
//   name: string;
// }

// const BaseCreateUser = createBaseResolver("User", User, RegisterInput, User);
// const BaseCreateProduct = createBaseResolver(
//   "Product",
//   Product,
//   ProductInput,
//   Product
// );
// @Resolver()
// export class CreateUserResolver extends BaseCreateUser {}
// @Resolver()
// export class CreateProductResolver extends BaseCreateProduct {}

import {
  Resolver,
  Mutation,
  Arg,
  ClassType,
  Field,
  InputType,
  UseMiddleware,
} from "type-graphql";
import { User } from "../../entity/User";
import { RegisterInput } from "./register/RegisterInput";
import { Product } from "../../entity/Product";
import { Middleware } from "type-graphql/dist/interfaces/Middleware";

function createResolver<T extends ClassType, X extends ClassType>(
  suffix: string,
  returnType: T,
  inputType: X,
  entity: any,
  middleware?: Middleware<any>[]
) {
  @Resolver()
  class BaseResolver {
    @Mutation(() => returnType, { name: `create${suffix}` })
    @UseMiddleware(...(middleware || []))
    async create(@Arg("data", () => inputType) data: any) {
      return entity.create(data).save();
    }
  }

  return BaseResolver;
}

@InputType()
class ProductInput {
  @Field()
  name: string;
}

export const CreateUserResolver = createResolver(
  "User",
  User,
  RegisterInput,
  User
);
export const CreateProductResolver = createResolver(
  "Product",
  Product,
  ProductInput,
  Product
);
