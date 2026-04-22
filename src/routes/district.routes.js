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

// Create district - HQ Admin only
router.post(
  "/",
  authMiddleware,
  roleMiddleware("HQ_ADMIN"),
  createDistrict
);

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