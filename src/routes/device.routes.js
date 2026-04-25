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

/**
 * @swagger
 * /api/v1/devices:
 *   post:
 *     summary: Create a device
 *     tags: [Device]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deviceCode
 *             properties:
 *               deviceCode:
 *                 type: string
 *               imei:
 *                 type: string
 *     responses:
 *       201:
 *         description: Device created
 */

// Create device - HQ Admin only
router.post(
  "/",
  authMiddleware,
  roleMiddleware("HQ_ADMIN"),
  createDevice
);

/**
 * @swagger
 * /api/v1/devices:
 *   get:
 *     summary: Get all devices
 *     tags: [Device]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of devices
 */
// Get all devices
router.get("/", authMiddleware, getAllDevices);

/**
 * @swagger
 * /api/v1/devices/{id}:
 *   get:
 *     summary: Get device by ID
 *     tags: [Device]
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
 *         description: Device details
 */
// Get single device
router.get("/:id", authMiddleware, getDeviceById);


/**
 * @swagger
 * /api/v1/devices/{id}:
 *   patch:
 *     summary: Update device
 *     tags: [Device]
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
 *               status:
 *                 type: string
 *                 enum: [OPERATIONAL, MAINTENANCE, INACTIVE]
 *     responses:
 *       200:
 *         description: Device updated
 */
// Update device - HQ Admin only
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("HQ_ADMIN"),
  updateDevice
);

/**
 * @swagger
 * /api/v1/devices/{id}/assign:
 *   patch:
 *     summary: Assign device to vehicle
 *     tags: [Device]
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
 *             required:
 *               - vehicleId
 *             properties:
 *               vehicleId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Device assigned to vehicle
 */
// Assign device to vehicle
router.patch(
  "/:id/assign",
  authMiddleware,
  roleMiddleware("HQ_ADMIN"),
  assignDeviceToVehicle
);

export default router;