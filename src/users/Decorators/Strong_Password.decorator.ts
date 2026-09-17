import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function StrongPassword(validationOptions?: ValidationOptions,) {
  return function (object: object, propertyName: string) {
    registerDecorator({ name: 'strongPassword', target: object.constructor,propertyName, options: validationOptions,
      validator: {
        validate(value: string) {
          return (
            typeof value === 'string' &&
            value.length >= 8 &&
            /[A-Z]/.test(value) &&
            /[a-z]/.test(value) &&
            /[0-9]/.test(value) &&
            /[^A-Za-z0-9]/.test(value)
          );
        },

        defaultMessage() {
          return 'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character';
        },
      },
    });
  };
}