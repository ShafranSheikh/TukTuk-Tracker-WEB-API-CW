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
/**
 * @swagger
 * /api/v1/vehicles:
 *   post:
 *     summary: Create a vehicle
 *     tags: [Vehicle]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - registrationNo
 *               - provinceId
 *               - districtId
 *               - stationId
 *             properties:
 *               registrationNo:
 *                 type: string
 *                 example: WP KG 1234
 *               model:
 *                 type: string
 *                 example: Bajaj RE
 *     responses:
 *       201:
 *         description: Vehicle created
 */

// Create vehicle - HQ Admin only
router.post(
  "/",
  authMiddleware,
  roleMiddleware("HQ_ADMIN"),
  createVehicle
);

/**
 * @swagger
 * /api/v1/vehicles:
 *   get:
 *     summary: Get all vehicles
 *     tags: [Vehicle]
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
 *     responses:
 *       200:
 *         description: List of vehicles
 */
// Get all vehicles
router.get("/", authMiddleware, getAllVehicles);

/**
 * @swagger
 * /api/v1/vehicles/{id}:
 *   get:
 *     summary: Get vehicle by ID
 *     tags: [Vehicle]
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
 *         description: Vehicle details
 */

// Get single vehicle
router.get("/:id", authMiddleware, getVehicleById);

// Update vehicle - HQ Admin only
/**
 * @swagger
 * /api/v1/vehicles/{id}:
 *   patch:
 *     summary: Update vehicle
 *     tags: [Vehicle]
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
 *         description: Vehicle updated
 */

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("HQ_ADMIN"),
  updateVehicle
);

export default router;