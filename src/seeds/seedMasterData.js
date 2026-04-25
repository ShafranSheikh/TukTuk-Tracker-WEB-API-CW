import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "../config/db.js";
import Province from "../models/Province.js";
import District from "../models/District.js";
import PoliceStation from "../models/PoliceStation.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const provincesPath = path.join(__dirname, "provinces.json");
const districtsPath = path.join(__dirname, "districts.json");
const stationsPath = path.join(__dirname, "stations.json");

const provincesData = JSON.parse(fs.readFileSync(provincesPath, "utf-8"));
const districtsData = JSON.parse(fs.readFileSync(districtsPath, "utf-8"));
const stationsData = JSON.parse(fs.readFileSync(stationsPath, "utf-8"));

const seedMasterData = async () => {
  try {
    await connectDB();

    // Clear old master data
    await PoliceStation.deleteMany({});
    await District.deleteMany({});
    await Province.deleteMany({});

    // Insert provinces
    const insertedProvinces = await Province.insertMany(provincesData);

    const provinceMap = {};
    insertedProvinces.forEach((province) => {
      provinceMap[province.code] = province._id;
    });

    // Prepare districts with real provinceId
    const districtsToInsert = districtsData.map((district) => ({
      name: district.name,
      code: district.code,
      provinceId: provinceMap[district.provinceCode],
    }));

    const insertedDistricts = await District.insertMany(districtsToInsert);

    const districtMap = {};
    insertedDistricts.forEach((district) => {
      districtMap[district.code] = district;
    });

    // Prepare stations with real districtId and provinceId
    const stationsToInsert = stationsData.map((station) => {
      const district = districtMap[station.districtCode];

      return {
        name: station.name,
        code: station.code,
        districtId: district._id,
        provinceId: district.provinceId,
        address: station.address,
        contactNo: station.contactNo,
      };
    });

    await PoliceStation.insertMany(stationsToInsert);

    console.log("Master data seeded successfully");
    console.log(`Provinces: ${insertedProvinces.length}`);
    console.log(`Districts: ${insertedDistricts.length}`);
    console.log(`Stations: ${stationsToInsert.length}`);

    process.exit(0);
  } catch (error) {
    console.error("Master data seeding failed:", error.message);
    process.exit(1);
  }
};

seedMasterData();