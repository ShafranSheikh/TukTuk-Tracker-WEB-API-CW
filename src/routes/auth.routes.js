import express from "express";
import { loginUser } from "../controllers/auth.controller.js";
import { loginValidation } from "../validators/auth.validator.js";
import validateMiddleware from "../middleware/validate.middleware.js";

const router = express.Router();
/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@police.lk
 *               password:
 *                 type: string
 *                 example: Admin12345
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", loginValidation, validateMiddleware, loginUser);

export default router;