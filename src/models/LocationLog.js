import mongoose from "mongoose";

const locationLogSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    speed: {
      type: Number,
      default: 0,
    },
    heading: {
      type: Number,
      default: 0,
    },
    provinceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Province",
    },
    districtId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "District",
    },
    stationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PoliceStation",
    },
    recordedAt: {
      type: Date,
      required: true,
    },
    source: {
      type: String,
      default: "SIMULATED",
    },
  },
  {
    timestamps: true,
  }
);

// Useful indexes for performance
locationLogSchema.index({ vehicleId: 1, recordedAt: -1 });
locationLogSchema.index({ districtId: 1, recordedAt: -1 });

const LocationLog = mongoose.model("LocationLog", locationLogSchema);

export default LocationLog;