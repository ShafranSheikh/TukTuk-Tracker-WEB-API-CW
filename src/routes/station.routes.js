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

// Create station - HQ Admin only
router.post(
  "/",
  authMiddleware,
  roleMiddleware("HQ_ADMIN"),
  createStation
);

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