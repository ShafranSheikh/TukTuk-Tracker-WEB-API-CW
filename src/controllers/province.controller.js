import Province from "../models/Province.js";

// Create province
export const createProvince = async (req, res) => {
  try {
    const { name, code } = req.body;

    if (!name || !code) {
      return res.status(400).json({
        success: false,
        message: "Name and code are required",
      });
    }

    const existingProvince = await Province.findOne({
      $or: [{ name }, { code }],
    });

    if (existingProvince) {
      return res.status(409).json({
        success: false,
        message: "Province with this name or code already exists",
      });
    }

    const province = await Province.create({ name, code });

    return res.status(201).json({
      success: true,
      message: "Province created successfully",
      data: province,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create province",
      error: error.message,
    });
  }
};

// Get all provinces
export const getAllProvinces = async (req, res) => {
  try {
    const provinces = await Province.find().sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: provinces.length,
      data: provinces,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch provinces",
      error: error.message,
    });
  }
};

// Get single province by ID
export const getProvinceById = async (req, res) => {
  try {
    const province = await Province.findById(req.params.id);

    if (!province) {
      return res.status(404).json({
        success: false,
        message: "Province not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: province,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch province",
      error: error.message,
    });
  }
};

// Update province
export const updateProvince = async (req, res) => {
  try {
    const { name, code } = req.body;

    const province = await Province.findById(req.params.id);

    if (!province) {
      return res.status(404).json({
        success: false,
        message: "Province not found",
      });
    }

    if (name) province.name = name;
    if (code) province.code = code;

    await province.save();

    return res.status(200).json({
      success: true,
      message: "Province updated successfully",
      data: province,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update province",
      error: error.message,
    });
  }
};