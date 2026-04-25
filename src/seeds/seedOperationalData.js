import dotenv from "dotenv";
import connectDB from "../config/db.js";

import Driver from "../models/Driver.js";
import Device from "../models/Device.js";
import Vehicle from "../models/Vehicle.js";
import Province from "../models/Province.js";
import District from "../models/District.js";
import PoliceStation from "../models/PoliceStation.js";

dotenv.config();

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const randomPhone = () =>
  `07${Math.floor(10000000 + Math.random() * 90000000)}`;

const randomNIC = (index) => `900000${String(index).padStart(3, "0")}V`;

const randomLicense = (index) => `B${1000000 + index}`;

const randomIMEI = (index) => `35678912345${String(index).padStart(4, "0")}`;

const randomRegNo = (index) => `WP KG ${1000 + index}`;

const driverNames = [
  "Sunil Perera",
  "Kamal Fernando",
  "Nimal Silva",
  "Ruwan Jayasuriya",
  "Saman Kumara",
  "Ajith Bandara",
  "Tharindu Nawarathna",
  "Lakshan Peris",
  "Chathura Dilshan",
  "Asela Fernando",
];

const vehicleModels = [
  "Bajaj RE",
  "Piaggio Ape",
  "TVS King",
];

const vehicleColors = [
  "Green",
  "Blue",
  "Red",
  "Yellow",
  "Black",
];

const seedOperationalData = async () => {
  try {
    await connectDB();

    const provinces = await Province.find();
    const districts = await District.find();
    const stations = await PoliceStation.find();

    if (!provinces.length || !districts.length || !stations.length) {
      throw new Error("Seed master data first");
    }

    await Driver.deleteMany({});
    await Device.deleteMany({});
    await Vehicle.deleteMany({});

    const drivers = [];
    const devices = [];
    const vehicles = [];

    for (let i = 1; i <= 200; i++) {
      const station = randomItem(stations);
      const district = districts.find(
        (d) => d._id.toString() === station.districtId.toString()
      );
      const province = provinces.find(
        (p) => p._id.toString() === station.provinceId.toString()
      );

      const driver = {
        fullName: `${randomItem(driverNames)} ${i}`,
        nic: randomNIC(i),
        licenseNo: randomLicense(i),
        phone: randomPhone(),
        status: "ACTIVE",
      };

      const device = {
        deviceCode: `DEV-${String(i).padStart(3, "0")}`,
        imei: randomIMEI(i),
        apiKey: `device_key_${i}_${Date.now()}`,
        status: "ACTIVE",
      };

      drivers.push(driver);
      devices.push(device);

      vehicles.push({
        registrationNo: randomRegNo(i),
        model: randomItem(vehicleModels),
        color: randomItem(vehicleColors),
        ownerName: `Owner ${i}`,
        provinceId: province._id,
        districtId: district._id,
        stationId: station._id,
        status: "ACTIVE",
      });
    }

    const insertedDrivers = await Driver.insertMany(drivers);
    const insertedDevices = await Device.insertMany(devices);

    const vehiclesWithLinks = vehicles.map((vehicle, index) => ({
      ...vehicle,
      driverId: insertedDrivers[index]._id,
      deviceId: insertedDevices[index]._id,
    }));

    const insertedVehicles = await Vehicle.insertMany(vehiclesWithLinks);

    for (let i = 0; i < insertedDevices.length; i++) {
      insertedDevices[i].assignedVehicleId = insertedVehicles[i]._id;
      await insertedDevices[i].save();
    }

    console.log("Operational data seeded successfully");
    console.log(`Drivers: ${insertedDrivers.length}`);
    console.log(`Devices: ${insertedDevices.length}`);
    console.log(`Vehicles: ${insertedVehicles.length}`);

    process.exit(0);
  } catch (error) {
    console.error("Operational data seeding failed:", error.message);
    process.exit(1);
  }
};

seedOperationalData();