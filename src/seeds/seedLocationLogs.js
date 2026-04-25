import dotenv from "dotenv";
import connectDB from "../config/db.js";

import Vehicle from "../models/Vehicle.js";
import LocationLog from "../models/LocationLog.js";

dotenv.config();

const randomBetween = (min, max) => Math.random() * (max - min) + min;

const seedLocationLogs = async () => {
  try {
    await connectDB();

    const vehicles = await Vehicle.find();

    if (!vehicles.length) {
      throw new Error("Seed operational data first");
    }

    await LocationLog.deleteMany({});

    const logs = [];
    const now = new Date();

    for (const vehicle of vehicles) {
      let latestLog = null;

      // 7 days of history
      for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
        const baseDate = new Date(now);
        baseDate.setDate(now.getDate() - dayOffset);

        // 10 pings per day per vehicle
        for (let i = 0; i < 10; i++) {
          const recordedAt = new Date(baseDate);
          recordedAt.setHours(8 + i, Math.floor(Math.random() * 60), 0, 0);

          // Sri Lanka-ish random coordinates
          const latitude = Number(randomBetween(5.9, 9.8).toFixed(6));
          const longitude = Number(randomBetween(79.6, 81.9).toFixed(6));
          const speed = Number(randomBetween(0, 60).toFixed(2));
          const heading = Number(randomBetween(0, 360).toFixed(2));

          const log = {
            vehicleId: vehicle._id,
            deviceId: vehicle.deviceId,
            provinceId: vehicle.provinceId,
            districtId: vehicle.districtId,
            stationId: vehicle.stationId,
            latitude,
            longitude,
            speed,
            heading,
            recordedAt,
            source: "SIMULATED",
          };

          logs.push(log);
          latestLog = log;
        }
      }

      if (latestLog) {
        vehicle.lastKnownLocation = {
          latitude: latestLog.latitude,
          longitude: latestLog.longitude,
          speed: latestLog.speed,
          heading: latestLog.heading,
          recordedAt: latestLog.recordedAt,
        };
      }
    }

    await LocationLog.insertMany(logs);
    await Promise.all(vehicles.map((v) => v.save()));

    console.log("Location logs seeded successfully");
    console.log(`Vehicles updated: ${vehicles.length}`);
    console.log(`Location logs inserted: ${logs.length}`);

    process.exit(0);
  } catch (error) {
    console.error("Location log seeding failed:", error.message);
    process.exit(1);
  }
};

seedLocationLogs();