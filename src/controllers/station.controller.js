import PoliceStation from "../models/PoliceStation.js";
import Province from "../models/Province.js";
import District from "../models/District.js";

// Create station
export const createStation = async (req, res) => {
  try {
    const { name, code, provinceId, districtId, address, contactNo } = req.body;

    if (!name || !code || !provinceId || !districtId) {
      return res.status(400).json({
        success: false,
        message: "Name, code, provinceId and districtId are required",
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

    // Ensure district belongs to province
    if (district.provinceId.toString() !== provinceId) {
      return res.status(400).json({
        success: false,
        message: "District does not belong to given province",
      });
    }

    // Check duplicate
    const existingStation = await PoliceStation.findOne({
      name,
      districtId,
    });

    if (existingStation) {
      return res.status(409).json({
        success: false,
        message: "Station already exists in this district",
      });
    }

    const station = await PoliceStation.create({
      name,
      code,
      provinceId,
      districtId,
      address,
      contactNo,
    });

    return res.status(201).json({
      success: true,
      message: "Police station created successfully",
      data: station,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create station",
      error: error.message,
    });
  }
};

// Get all stations (with filtering)
export const getAllStations = async (req, res) => {
  try {
    const filter = {};

    if (req.query.provinceId) {
      filter.provinceId = req.query.provinceId;
    }

    if (req.query.districtId) {
      filter.districtId = req.query.districtId;
    }

    const stations = await PoliceStation.find(filter)
      .populate("provinceId", "name code")
      .populate("districtId", "name code")
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: stations.length,
      data: stations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch stations",
      error: error.message,
    });
  }
};

// Get single station
export const getStationById = async (req, res) => {
  try {
    const station = await PoliceStation.findById(req.params.id)
      .populate("provinceId", "name code")
      .populate("districtId", "name code");

    if (!station) {
      return res.status(404).json({
        success: false,
        message: "Station not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: station,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch station",
      error: error.message,
    });
  }
};

// Update station
export const updateStation = async (req, res) => {
  try {
    const { name, code, provinceId, districtId, address, contactNo } = req.body;

    const station = await PoliceStation.findById(req.params.id);

    if (!station) {
      return res.status(404).json({
        success: false,
        message: "Station not found",
      });
    }

    if (provinceId) station.provinceId = provinceId;
    if (districtId) station.districtId = districtId;
    if (name) station.name = name;
    if (code) station.code = code;
    if (address) station.address = address;
    if (contactNo) station.contactNo = contactNo;

    await station.save();

    return res.status(200).json({
      success: true,
      message: "Station updated successfully",
      data: station,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update station",
      error: error.message,
    });
  }
};