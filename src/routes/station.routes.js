import express from "express";
import {
  createStation,
  getAllStations,
  getStationById,
  updateStation,
} from "../controllers/station.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/stations:
 *   post:
 *     summary: Create a police station
 *     tags: [Station]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - code
 *               - provinceId
 *               - districtId
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               provinceId:
 *                 type: string
 *               districtId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Station created
 */

// Create station - HQ Admin only
router.post(
  "/",
  authMiddleware,
  roleMiddleware("HQ_ADMIN"),
  createStation
);

/**
 * @swagger
 * /api/v1/stations:
 *   get:
 *     summary: Get all stations
 *     tags: [Station]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of stations
 */

// Get all stations - any logged-in user
router.get("/", authMiddleware, getAllStations);

// Get single station
router.get("/:id", authMiddleware, getStationById);

// Update station - HQ Admin only
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("HQ_ADMIN"),
  updateStation
);

export default router;