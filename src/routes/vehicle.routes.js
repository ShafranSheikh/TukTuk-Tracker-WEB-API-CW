import express from "express";
import {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
} from "../controllers/vehicle.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

// Create vehicle - HQ Admin only
router.post(
  "/",
  authMiddleware,
  roleMiddleware("HQ_ADMIN"),
  createVehicle
);

// Get all vehicles
router.get("/", authMiddleware, getAllVehicles);

// Get single vehicle
router.get("/:id", authMiddleware, getVehicleById);

// Update vehicle - HQ Admin only
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("HQ_ADMIN"),
  updateVehicle
);

export default router;