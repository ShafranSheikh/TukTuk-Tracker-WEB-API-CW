import District from "../models/District.js";
import Province from "../models/Province.js";

// Create district
export const createDistrict = async (req, res) => {
  try {
    const { name, code, provinceId } = req.body;

    if (!name || !code || !provinceId) {
      return res.status(400).json({
        success: false,
        message: "Name, code, and provinceId are required",
      });
    }

    const province = await Province.findById(provinceId);

    if (!province) {
      return res.status(404).json({
        success: false,
        message: "Province not found",
      });
    }

    const existingDistrict = await District.findOne({ name, provinceId });

    if (existingDistrict) {
      return res.status(409).json({
        success: false,
        message: "District already exists in this province",
      });
    }

    const district = await District.create({
      name,
      code,
      provinceId,
    });

    return res.status(201).json({
      success: true,
      message: "District created successfully",
      data: district,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create district",
      error: error.message,
    });
  }
};

// Get all districts
export const getAllDistricts = async (req, res) => {
  try {
    const filter = {};

    if (req.query.provinceId) {
      filter.provinceId = req.query.provinceId;
    }

    const districts = await District.find(filter)
      .populate("provinceId", "name code")
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: districts.length,
      data: districts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch districts",
      error: error.message,
    });
  }
};

// Get district by ID
export const getDistrictById = async (req, res) => {
  try {
    const district = await District.findById(req.params.id).populate(
      "provinceId",
      "name code"
    );

    if (!district) {
      return res.status(404).json({
        success: false,
        message: "District not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: district,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch district",
      error: error.message,
    });
  }
};

// Update district
export const updateDistrict = async (req, res) => {
  try {
    const { name, code, provinceId } = req.body;

    const district = await District.findById(req.params.id);

    if (!district) {
      return res.status(404).json({
        success: false,
        message: "District not found",
      });
    }

    if (provinceId) {
      const province = await Province.findById(provinceId);

      if (!province) {
        return res.status(404).json({
          success: false,
          message: "Province not found",
        });
      }

      district.provinceId = provinceId;
    }

    if (name) district.name = name;
    if (code) district.code = code;

    await district.save();

    return res.status(200).json({
      success: true,
      message: "District updated successfully",
      data: district,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update district",
      error: error.message,
    });
  }
};