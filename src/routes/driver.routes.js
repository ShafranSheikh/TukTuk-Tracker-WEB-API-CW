import express from "express";
import {
  createDriver,
  getAllDrivers,
  getDriverById,
  updateDriver,
} from "../controllers/driver.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

// Create driver - HQ Admin only
router.post(
  "/",
  authMiddleware,
  roleMiddleware("HQ_ADMIN"),
  createDriver
);

// Get all drivers - any logged-in user
router.get("/", authMiddleware, getAllDrivers);

// Get single driver
router.get("/:id", authMiddleware, getDriverById);

// Update driver - HQ Admin only
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("HQ_ADMIN"),
  updateDriver
);

export default router;