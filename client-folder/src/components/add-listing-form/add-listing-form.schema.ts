import Joi from "joi";

export const apartmentValidationSchema = Joi.object({
  name: Joi.string().min(3).max(255).required().messages({
    "string.min": "Name must be at least 3 characters",
    "string.empty": "Name is required",
  }),
  description: Joi.string().min(10).max(5000).required().messages({
    "string.min": "Description must be at least 10 characters",
    "string.empty": "Description is required",
  }),
  address: Joi.string()
    .required()
    .messages({ "string.empty": "Address is required" }),
  price: Joi.number().min(0).required().messages({
    "number.base": "Price must be a number",
    "number.min": "Price must be positive",
    "any.required": "Price is required",
  }),
  bedrooms: Joi.number().min(0).integer().required().messages({
    "number.base": "Bedrooms must be a number",
    "number.min": "Bedrooms must be non-negative",
    "number.integer": "Bedrooms must be a whole number",
    "any.required": "Bedrooms are required",
  }),
  bathrooms: Joi.number().min(1).integer().required().messages({
    "number.base": "Bathrooms must be a number",
    "number.min": "Bathrooms must be at least 1",
    "number.integer": "Bathrooms must be a whole number",
    "any.required": "Bathrooms are required",
  }),
  area: Joi.number().min(1).required().messages({
    "number.base": "Area must be a number",
    "number.min": "Area must be positive",
    "any.required": "Area is required",
  }),
  unitNumber: Joi.number().required().positive(),
  project: Joi.string()
    .required()
    .messages({ "string.empty": "Project name is required" }),
  developer: Joi.string()
    .required()
    .messages({ "string.empty": "Developer name is required" }),
  location: Joi.object({
    latitude: Joi.number().min(-90).max(90).required().messages({
      "number.base": "Latitude must be a number",
      "any.required": "Latitude is required",
    }),
    longitude: Joi.number().min(-180).max(180).required().messages({
      "number.base": "Longitude must be a number",
      "any.required": "Longitude is required",
    }),
  }).required(),
  files: Joi.array().items(Joi.any()).min(1).required().messages({
    "array.min": "At least one image (for cover) must be uploaded.",
    "any.required": "Images are required.",
  }),
  coverImageIndex: Joi.number().allow(null).optional(), // Now part of form values for validation
});

// --- Step 1: Basic Info ---
export const step1ApartmentSchema = Joi.object({
  name: Joi.string().min(3).max(255).required().messages({
    "string.min": "Name must be at least 3 characters long.",
    "string.max": "Name cannot exceed 255 characters.",
    "string.empty": "Apartment name is required.",
    "any.required": "Apartment name is required.",
  }),
  description: Joi.string().min(10).max(5000).required().messages({
    "string.min": "Description must be at least 10 characters long.",
    "string.max": "Description cannot exceed 5000 characters.",
    "string.empty": "Description is required.",
    "any.required": "Description is required.",
  }),
  address: Joi.string().required().messages({
    "string.empty": "Address is required.",
    "any.required": "Address is required.",
  }),
  price: Joi.number().min(0).required().messages({
    "number.base": "Price must be a valid number.",
    "number.min": "Price cannot be negative.",
    "any.required": "Price is required.",
  }),
  area: Joi.number().min(1).required().messages({
    "number.base": "Area must be a valid number.",
    "number.min": "Area must be a positive number.",
    "any.required": "Area is required.",
  }),
  bedrooms: Joi.number().min(0).integer().required().messages({
    "number.base": "Bedrooms must be a valid number.",
    "number.min": "Bedrooms cannot be negative.",
    "number.integer": "Bedrooms must be a whole number.",
    "any.required": "Number of bedrooms is required.",
  }),
  bathrooms: Joi.number().min(1).integer().required().messages({
    "number.base": "Bathrooms must be a valid number.",
    "number.min": "Bathrooms must be at least 1.",
    "number.integer": "Bathrooms must be a whole number.",
    "any.required": "Number of bathrooms is required.",
  }),
  unitNumber: Joi.number().required().messages({
    "number.base": "Unit number must be a valid number.",
    "any.required": "Unit number is required.",
  }),
  project: Joi.string().required().messages({
    "string.empty": "Project name is required.",
    "any.required": "Project name is required.",
  }),
  developer: Joi.string().required().messages({
    "string.empty": "Developer name is required.",
    "any.required": "Developer name is required.",
  }),
});

// --- Step 2: Location & Images ---
export const step2ApartmentSchema = Joi.object({
  location: Joi.object({
    latitude: Joi.number().min(-90).max(90).required().messages({
      "number.base": "Latitude must be a valid number.",
      "number.min": "Latitude must be between -90 and 90.",
      "number.max": "Latitude must be between -90 and 90.",
      "any.required": "Latitude is required.",
    }),
    longitude: Joi.number().min(-180).max(180).required().messages({
      "number.base": "Longitude must be a valid number.",
      "number.min": "Longitude must be between -180 and 180.",
      "number.max": "Longitude must be between -180 and 180.",
      "any.required": "Longitude is required.",
    }),
  }).required(),
  files: Joi.array()
    .items(
      Joi.custom((value, helpers) => {
        // Custom validation for FileWithPath instances
        if (!(value instanceof File)) {
          // Check if it's a File object (FileWithPath extends File)
          return helpers.error("any.custom", { message: "Invalid file type." });
        }
        return value; // If valid, return the value
      })
    )
    .min(1) // At least one file (which will include the cover)
    .required()
    .messages({
      "array.min": "At least one image must be uploaded to serve as a cover.",
      "any.required": "Images are required.",
      "any.custom": "One or more uploaded items are not valid files.",
    }),
  coverImageIndex: Joi.number()
    .integer()
    .min(0)
    .allow(null)
    .required()
    .messages({
      // coverImageIndex can be 0. It's required to be explicitly set (even if to 0) if files exist.
      // If files array is empty, this field might not make sense, but files.min(1) handles that.
      "number.base": "Cover image selection is invalid.",
      "number.min": "Cover image selection is invalid.",
      "any.required":
        "A cover image must be selected from the uploaded images.",
    }),
});
