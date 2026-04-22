import mongoose from "mongoose";

const policeStationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    provinceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Province",
      required: true,
    },
    districtId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "District",
      required: true,
    },
    address: {
      type: String,
      trim: true,
    },
    contactNo: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate station in same district
policeStationSchema.index({ name: 1, districtId: 1 }, { unique: true });

const PoliceStation = mongoose.model(
  "PoliceStation",
  policeStationSchema
);

export default PoliceStation;