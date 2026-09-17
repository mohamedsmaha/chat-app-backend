import {
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

export function Gmail(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'gmail',
      target: object.constructor,
      propertyName,
      options: validationOptions,

      validator: {
        validate(value: string) {
          return (
            typeof value === 'string' &&
            /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value)
          );
        },

        defaultMessage() {
          return 'Email must be a valid Gmail address';
        },
      },
    });
  };
}
