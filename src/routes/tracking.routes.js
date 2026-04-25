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

/**
 * @swagger
 * /api/v1/tracking/ping:
 *   post:
 *     summary: Send GPS data from device
 *     tags: [Tracking]
 *     security:
 *       - deviceApiKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - latitude
 *               - longitude
 *               - recordedAt
 *             properties:
 *               latitude:
 *                 type: number
 *                 example: 7.2906
 *               longitude:
 *                 type: number
 *                 example: 80.6337
 *               speed:
 *                 type: number
 *                 example: 40
 *               heading:
 *                 type: number
 *                 example: 180
 *               recordedAt:
 *                 type: string
 *                 example: 2026-04-08T03:00:00.000Z
 *     responses:
 *       201:
 *         description: Tracking ping saved
 */

// Device sends GPS ping
router.post(
  "/ping",
  deviceAuthMiddleware,
  trackingValidation,
  validateMiddleware,
  createTrackingPing
);

/**
 * @swagger
 * /api/v1/tracking/vehicle/{vehicleId}/latest:
 *   get:
 *     summary: Get latest vehicle location
 *     tags: [Tracking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Latest location returned
 */

// Logged-in users can view latest location
router.get(
  "/vehicle/:vehicleId/latest",
  authMiddleware,
  getLatestVehicleLocation
);

/**
 * @swagger
 * /api/v1/tracking/vehicle/{vehicleId}/history:
 *   get:
 *     summary: Get vehicle location history
 *     tags: [Tracking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vehicle history returned
 */
// Logged-in users can view one vehicle history
router.get(
  "/vehicle/:vehicleId/history",
  authMiddleware,
  getVehicleHistory
);

/**
 * @swagger
 * /api/v1/tracking/history:
 *   get:
 *     summary: Get filtered tracking history
 *     tags: [Tracking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: provinceId
 *         schema:
 *           type: string
 *       - in: query
 *         name: districtId
 *         schema:
 *           type: string
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Filtered logs returned
 */
// Logged-in users can view filtered history
router.get(
  "/history",
  authMiddleware,
  getFilteredTrackingHistory
);

export default router;