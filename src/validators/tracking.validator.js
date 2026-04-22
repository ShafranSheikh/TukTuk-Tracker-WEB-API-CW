import { body } from "express-validator";

export const trackingValidation = [
  body("latitude")
    .notEmpty()
    .withMessage("Latitude is required")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be between -90 and 90"),

  body("longitude")
    .notEmpty()
    .withMessage("Longitude is required")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be between -180 and 180"),

  body("speed")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Speed must be a positive number"),

  body("heading")
    .optional()
    .isFloat({ min: 0, max: 360 })
    .withMessage("Heading must be between 0 and 360"),

  body("recordedAt")
    .notEmpty()
    .withMessage("recordedAt is required")
    .isISO8601()
    .withMessage("recordedAt must be a valid date"),
];