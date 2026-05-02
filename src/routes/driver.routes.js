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


/**
 * @swagger
 * /api/v1/drivers/{id}:
 *   get:
 *     summary: Get a driver by ID
 *     tags: [Driver]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Driver found
 *       404:
 *         description: Driver not found
 */
// Get single driver
router.get("/:id", authMiddleware, getDriverById);

/**
 * @swagger
 * /api/v1/drivers/{id}:
 *   patch:
 *     summary: Update a driver
 *     tags: [Driver]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               nic:
 *                 type: string
 *               licenseNo:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Driver updated
 */ 
// Update driver - HQ Admin only
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("HQ_ADMIN"),
  updateDriver
);

export default router;