import Device from "../models/Device.js";

const deviceAuthMiddleware = async (req, res, next) => {
  try {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: "Device API key is required",
      });
    }

    const device = await Device.findOne({ apiKey });

    if (!device) {
      return res.status(401).json({
        success: false,
        message: "Invalid device API key",
      });
    }

    if (device.status !== "ACTIVE") {
      return res.status(403).json({
        success: false,
        message: "Device is inactive",
      });
    }

    req.device = device;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Device authentication failed",
      error: error.message,
    });
  }
};

export default deviceAuthMiddleware;