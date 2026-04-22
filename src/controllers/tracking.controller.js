import LocationLog from "../models/LocationLog.js";
import Vehicle from "../models/Vehicle.js";

// POST /api/v1/tracking/ping
export const createTrackingPing = async (req, res) => {
  try {
    const { latitude, longitude, speed, heading, recordedAt } = req.body;

    if (
      latitude === undefined ||
      longitude === undefined ||
      !recordedAt
    ) {
      return res.status(400).json({
        success: false,
        message: "latitude, longitude, and recordedAt are required",
      });
    }

    const device = req.device;

    if (!device.assignedVehicleId) {
      return res.status(400).json({
        success: false,
        message: "This device is not assigned to any vehicle",
      });
    }

    const vehicle = await Vehicle.findById(device.assignedVehicleId);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Assigned vehicle not found",
      });
    }

    const log = await LocationLog.create({
      vehicleId: vehicle._id,
      deviceId: device._id,
      latitude,
      longitude,
      speed: speed || 0,
      heading: heading || 0,
      provinceId: vehicle.provinceId,
      districtId: vehicle.districtId,
      stationId: vehicle.stationId,
      recordedAt,
      source: "DEVICE",
    });

    vehicle.lastKnownLocation = {
      latitude,
      longitude,
      speed: speed || 0,
      heading: heading || 0,
      recordedAt,
    };

    await vehicle.save();

    return res.status(201).json({
      success: true,
      message: "Tracking ping saved successfully",
      data: log,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to save tracking ping",
      error: error.message,
    });
  }
};

// GET /api/v1/tracking/vehicle/:vehicleId/latest
export const getLatestVehicleLocation = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.vehicleId)
      .populate("provinceId", "name")
      .populate("districtId", "name")
      .populate("stationId", "name")
      .populate("driverId", "fullName")
      .populate("deviceId", "deviceCode");

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        vehicleId: vehicle._id,
        registrationNo: vehicle.registrationNo,
        lastKnownLocation: vehicle.lastKnownLocation || null,
        province: vehicle.provinceId,
        district: vehicle.districtId,
        station: vehicle.stationId,
        driver: vehicle.driverId,
        device: vehicle.deviceId,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch latest location",
      error: error.message,
    });
  }
};

// GET /api/v1/tracking/vehicle/:vehicleId/history
export const getVehicleHistory = async (req, res) => {
  try {
    const { from, to } = req.query;
    const { vehicleId } = req.params;

    const filter = { vehicleId };

    if (from || to) {
      filter.recordedAt = {};
      if (from) filter.recordedAt.$gte = new Date(from);
      if (to) filter.recordedAt.$lte = new Date(to);
    }

    const logs = await LocationLog.find(filter)
      .sort({ recordedAt: -1 })
      .populate("deviceId", "deviceCode");

    return res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch vehicle history",
      error: error.message,
    });
  }
};

// GET /api/v1/tracking/history
export const getFilteredTrackingHistory = async (req, res) => {
  try {
    const { provinceId, districtId, stationId, from, to, vehicleId } = req.query;

    const filter = {};

    if (provinceId) filter.provinceId = provinceId;
    if (districtId) filter.districtId = districtId;
    if (stationId) filter.stationId = stationId;
    if (vehicleId) filter.vehicleId = vehicleId;

    if (from || to) {
      filter.recordedAt = {};
      if (from) filter.recordedAt.$gte = new Date(from);
      if (to) filter.recordedAt.$lte = new Date(to);
    }

    const logs = await LocationLog.find(filter)
      .sort({ recordedAt: -1 })
      .populate("vehicleId", "registrationNo")
      .populate("deviceId", "deviceCode")
      .populate("provinceId", "name")
      .populate("districtId", "name")
      .populate("stationId", "name");

    return res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tracking history",
      error: error.message,
    });
  }
};