import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    deviceCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    imei: {
      type: String,
      trim: true,
    },
    apiKey: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
    assignedVehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Device = mongoose.model("Device", deviceSchema);

export default Device;