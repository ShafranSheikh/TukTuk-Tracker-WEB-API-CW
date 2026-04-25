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

/**
 * @swagger
 * /api/v1/drivers:
 *   post:
 *     summary: Create a driver
 *     tags: [Driver]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - nic
 *               - licenseNo
 *             properties:
 *               fullName:
 *                 type: string
 *               nic:
 *                 type: string
 *               licenseNo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Driver created
 */

// Create driver - HQ Admin only
router.post(
  "/",
  authMiddleware,
  roleMiddleware("HQ_ADMIN"),
  createDriver
);

/**
 * @swagger
 * /api/v1/drivers:
 *   get:
 *     summary: Get all drivers
 *     tags: [Driver]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of drivers
 */

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