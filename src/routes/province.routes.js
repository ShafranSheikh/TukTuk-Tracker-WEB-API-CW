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

// Create province (only HQ Admin)
router.post(
  "/",
  authMiddleware,
  roleMiddleware("HQ_ADMIN"),
  createProvince
);

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