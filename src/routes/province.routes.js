import express from "express";
import {
  createProvince,
  getAllProvinces,
  getProvinceById,
  updateProvince,
} from "../controllers/province.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();
/**
 * @swagger
 * /api/v1/provinces:
 *   post:
 *     summary: Create a province
 *     tags: [Province]
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: Western
 *               code:
 *                 type: string
 *                 example: WEST
 *     responses:
 *       201:
 *         description: Province created
 */

// Create province (only HQ Admin)
router.post(
  "/",
  authMiddleware,
  roleMiddleware("HQ_ADMIN"),
  createProvince
);

/**
 * @swagger
 * /api/v1/provinces:
 *   get:
 *     summary: Get all provinces
 *     tags: [Province]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of provinces
 */

// Get all provinces (any logged-in user)
router.get("/", authMiddleware, getAllProvinces);

// Get single province
router.get("/:id", authMiddleware, getProvinceById);

// Update province (HQ Admin only)
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("HQ_ADMIN"),
  updateProvince
);

export default router;