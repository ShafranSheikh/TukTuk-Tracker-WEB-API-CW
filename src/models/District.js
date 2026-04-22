import mongoose from "mongoose";

const districtSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate districts within same province
districtSchema.index({ name: 1, provinceId: 1 }, { unique: true });

const District = mongoose.model("District", districtSchema);

export default District;