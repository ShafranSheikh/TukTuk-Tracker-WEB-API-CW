import express from "express";
import {
  createDevice,
  getAllDevices,
  getDeviceById,
  updateDevice,
  assignDeviceToVehicle,
} from "../controllers/device.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

// Create device - HQ Admin only
router.post(
  "/",
  authMiddleware,
  roleMiddleware("HQ_ADMIN"),
  createDevice
);

// Get all devices
router.get("/", authMiddleware, getAllDevices);

// Get single device
router.get("/:id", authMiddleware, getDeviceById);

// Update device - HQ Admin only
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("HQ_ADMIN"),
  updateDevice
);

// Assign device to vehicle
router.patch(
  "/:id/assign",
  authMiddleware,
  roleMiddleware("HQ_ADMIN"),
  assignDeviceToVehicle
);

export default router;