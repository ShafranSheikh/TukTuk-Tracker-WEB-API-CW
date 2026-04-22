import crypto from "crypto";
import Device from "../models/Device.js";
import Vehicle from "../models/Vehicle.js";

// Create device
export const createDevice = async (req, res) => {
  try {
    const { deviceCode, imei, status } = req.body;

    if (!deviceCode) {
      return res.status(400).json({
        success: false,
        message: "deviceCode is required",
      });
    }

    const existingDevice = await Device.findOne({ deviceCode });

    if (existingDevice) {
      return res.status(409).json({
        success: false,
        message: "Device with this code already exists",
      });
    }

    const apiKey = crypto.randomBytes(24).toString("hex");

    const device = await Device.create({
      deviceCode,
      imei,
      apiKey,
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Device created successfully",
      data: device,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create device",
      error: error.message,
    });
  }
};

// Get all devices
export const getAllDevices = async (req, res) => {
  try {
    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const devices = await Device.find(filter)
      .populate("assignedVehicleId", "registrationNo model status")
      .sort({ deviceCode: 1 });

    return res.status(200).json({
      success: true,
      count: devices.length,
      data: devices,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch devices",
      error: error.message,
    });
  }
};

// Get single device
export const getDeviceById = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id).populate(
      "assignedVehicleId",
      "registrationNo model status"
    );

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: device,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch device",
      error: error.message,
    });
  }
};

// Update device
export const updateDevice = async (req, res) => {
  try {
    const { deviceCode, imei, status } = req.body;

    const device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    if (deviceCode) device.deviceCode = deviceCode;
    if (imei) device.imei = imei;
    if (status) device.status = status;

    await device.save();

    return res.status(200).json({
      success: true,
      message: "Device updated successfully",
      data: device,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update device",
      error: error.message,
    });
  }
};

// Assign device to vehicle
export const assignDeviceToVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.body;

    if (!vehicleId) {
      return res.status(400).json({
        success: false,
        message: "vehicleId is required",
      });
    }

    const device = await Device.findById(req.params.id);
    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    device.assignedVehicleId = vehicleId;
    await device.save();

    return res.status(200).json({
      success: true,
      message: "Device assigned to vehicle successfully",
      data: device,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to assign device",
      error: error.message,
    });
  }
};