import express from "express";
import {
  createDistrict,
  getAllDistricts,
  getDistrictById,
  updateDistrict,
} from "../controllers/district.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/districts:
 *   post:
 *     summary: Create a district
 *     tags: [District]
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: Colombo
 *               code:
 *                 type: string
 *                 example: CMB
 *               provinceId:
 *                 type: string
 *     responses:
 *       201:
 *         description: District created
 */
// Create district - HQ Admin only
router.post(
  "/",
  authMiddleware,
  roleMiddleware("HQ_ADMIN"),
  createDistrict
);

/**
 * @swagger
 * /api/v1/districts:
 *   get:
 *     summary: Get all districts
 *     tags: [District]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: provinceId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of districts
 */

// Get all districts - any logged-in user
router.get("/", authMiddleware, getAllDistricts);

// Get single district
router.get("/:id", authMiddleware, getDistrictById);

// Update district - HQ Admin only
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("HQ_ADMIN"),
  updateDistrict
);

export default router;