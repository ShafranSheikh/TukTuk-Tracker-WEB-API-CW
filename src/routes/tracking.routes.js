import express from "express";
import {
  createTrackingPing,
  getLatestVehicleLocation,
  getVehicleHistory,
  getFilteredTrackingHistory,
} from "../controllers/tracking.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import deviceAuthMiddleware from "../middleware/deviceAuth.middleware.js";
import { trackingValidation } from "../validators/tracking.validator.js";
import validateMiddleware from "../middleware/validate.middleware.js";
const router = express.Router();

// Device sends GPS ping
router.post(
  "/ping",
  deviceAuthMiddleware,
  trackingValidation,
  validateMiddleware,
  createTrackingPing
);

// Logged-in users can view latest location
router.get(
  "/vehicle/:vehicleId/latest",
  authMiddleware,
  getLatestVehicleLocation
);

// Logged-in users can view one vehicle history
router.get(
  "/vehicle/:vehicleId/history",
  authMiddleware,
  getVehicleHistory
);

// Logged-in users can view filtered history
router.get(
  "/history",
  authMiddleware,
  getFilteredTrackingHistory
);

export default router;