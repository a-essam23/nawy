import Joi from "joi";
import { FormErrors } from "@mantine/form";

export function joiResolver(schema: Joi.ObjectSchema) {
  return (values: Record<string, any>): FormErrors => {
    const { error } = schema.validate(values, { abortEarly: false });
    if (!error) {
      return {};
    }

    const errors: FormErrors = {};
    error.details.forEach((detail) => {
      const path = detail.path.join(".");
      if (!errors[path]) {
        errors[path] = detail.message;
      }
    });
    return errors;
  };
}
