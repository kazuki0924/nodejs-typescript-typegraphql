import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";

@ValidatorConstraint({ async: true })
export class isEmailAlreadyExists implements ValidatorConstraintInterface {
  validate(userName: any, args: ValidationArguments) {
    return UserRepository.findOneByName(userName).then((user) => {
      if (user) return false;
      return true;
    });
  }
}

export function isEmailAlreadyExists(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: isEmailAlreadyExists,
    });
  };
}
