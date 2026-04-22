import Vehicle from "../models/Vehicle.js";
import Province from "../models/Province.js";
import District from "../models/District.js";
import PoliceStation from "../models/PoliceStation.js";
import Driver from "../models/Driver.js";
import Device from "../models/Device.js";

// Create vehicle
export const createVehicle = async (req, res) => {
  try {
    const {
      registrationNo,
      model,
      color,
      ownerName,
      provinceId,
      districtId,
      stationId,
      driverId,
      deviceId,
      status,
    } = req.body;

    if (!registrationNo || !provinceId || !districtId || !stationId) {
      return res.status(400).json({
        success: false,
        message: "registrationNo, provinceId, districtId, stationId are required",
      });
    }

    const existingVehicle = await Vehicle.findOne({ registrationNo });

    if (existingVehicle) {
      return res.status(409).json({
        success: false,
        message: "Vehicle already exists",
      });
    }

    // Validate province
    const province = await Province.findById(provinceId);
    if (!province) {
      return res.status(404).json({
        success: false,
        message: "Province not found",
      });
    }

    // Validate district
    const district = await District.findById(districtId);
    if (!district) {
      return res.status(404).json({
        success: false,
        message: "District not found",
      });
    }

    // Validate station
    const station = await PoliceStation.findById(stationId);
    if (!station) {
      return res.status(404).json({
        success: false,
        message: "Station not found",
      });
    }

    // Optional validations
    if (driverId) {
      const driver = await Driver.findById(driverId);
      if (!driver) {
        return res.status(404).json({
          success: false,
          message: "Driver not found",
        });
      }
    }

    if (deviceId) {
      const device = await Device.findById(deviceId);
      if (!device) {
        return res.status(404).json({
          success: false,
          message: "Device not found",
        });
      }
    }

    const vehicle = await Vehicle.create({
      registrationNo,
      model,
      color,
      ownerName,
      provinceId,
      districtId,
      stationId,
      driverId,
      deviceId,
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: vehicle,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create vehicle",
      error: error.message,
    });
  }
};

// Get all vehicles (with filtering)
export const getAllVehicles = async (req, res) => {
  try {
    const filter = {};

    if (req.query.provinceId) filter.provinceId = req.query.provinceId;
    if (req.query.districtId) filter.districtId = req.query.districtId;
    if (req.query.stationId) filter.stationId = req.query.stationId;
    if (req.query.status) filter.status = req.query.status;

    const vehicles = await Vehicle.find(filter)
      .populate("provinceId", "name")
      .populate("districtId", "name")
      .populate("stationId", "name")
      .populate("driverId", "fullName")
      .populate("deviceId", "deviceCode")
      .sort({ registrationNo: 1 });

    return res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch vehicles",
      error: error.message,
    });
  }
};

// Get single vehicle
export const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
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
      data: vehicle,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch vehicle",
      error: error.message,
    });
  }
};

// Update vehicle
export const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    Object.assign(vehicle, req.body);

    await vehicle.save();

    return res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: vehicle,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update vehicle",
      error: error.message,
    });
  }
};