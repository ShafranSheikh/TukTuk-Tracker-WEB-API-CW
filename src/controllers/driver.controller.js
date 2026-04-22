import Driver from "../models/Driver.js";

// Create driver
export const createDriver = async (req, res) => {
  try {
    const { fullName, nic, licenseNo, phone, status } = req.body;

    if (!fullName || !nic || !licenseNo) {
      return res.status(400).json({
        success: false,
        message: "fullName, nic, and licenseNo are required",
      });
    }

    const existingDriver = await Driver.findOne({
      $or: [{ nic }, { licenseNo }],
    });

    if (existingDriver) {
      return res.status(409).json({
        success: false,
        message: "Driver with this NIC or license already exists",
      });
    }

    const driver = await Driver.create({
      fullName,
      nic,
      licenseNo,
      phone,
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Driver created successfully",
      data: driver,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create driver",
      error: error.message,
    });
  }
};

// Get all drivers
export const getAllDrivers = async (req, res) => {
  try {
    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const drivers = await Driver.find(filter).sort({ fullName: 1 });

    return res.status(200).json({
      success: true,
      count: drivers.length,
      data: drivers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch drivers",
      error: error.message,
    });
  }
};

// Get single driver
export const getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: driver,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch driver",
      error: error.message,
    });
  }
};

// Update driver
export const updateDriver = async (req, res) => {
  try {
    const { fullName, phone, status } = req.body;

    const driver = await Driver.findById(req.params.id);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    if (fullName) driver.fullName = fullName;
    if (phone) driver.phone = phone;
    if (status) driver.status = status;

    await driver.save();

    return res.status(200).json({
      success: true,
      message: "Driver updated successfully",
      data: driver,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update driver",
      error: error.message,
    });
  }
};