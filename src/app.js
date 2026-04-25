import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./docs/swagger.js";
import errorMiddleware from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import authMiddleware from "./middleware/auth.middleware.js";
import roleMiddleware from "./middleware/role.middleware.js";
import provinceRoutes from "./routes/province.routes.js";
import districtRoutes from "./routes/district.routes.js";
import stationRoutes from "./routes/station.routes.js";
import driverRoutes from "./routes/driver.routes.js";
import deviceRoutes from "./routes/device.routes.js";
import vehicleRoutes from "./routes/vehicle.routes.js";
import trackingRoutes from "./routes/tracking.routes.js";
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(errorMiddleware);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Tuk-Tuk Tracking API is running",
  });
});

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
  });
});

app.get(
  "/api/v1/test/protected",
  authMiddleware,
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Protected route accessed",
      user: req.user,
    });
  }
);

app.get(
  "/api/v1/test/admin",
  authMiddleware,
  roleMiddleware("HQ_ADMIN"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Admin route accessed",
      user: req.user,
    });
  }
);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/provinces", provinceRoutes);
app.use("/api/v1/districts", districtRoutes);
app.use("/api/v1/stations", stationRoutes);
app.use("/api/v1/drivers", driverRoutes);
app.use("/api/v1/devices", deviceRoutes);
app.use("/api/v1/vehicles", vehicleRoutes);
app.use("/api/v1/tracking", trackingRoutes);
export default app;