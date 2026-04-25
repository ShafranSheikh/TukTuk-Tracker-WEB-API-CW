import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const seedUsers = async () => {
  try {
    await connectDB();

    const users = [
      {
        name: "Provincial Admin",
        email: "prov@police.lk",
        password: await bcrypt.hash("Password123", 10),
        role: "PROVINCIAL_ADMIN",
      },
      {
        name: "Station Officer",
        email: "station@police.lk",
        password: await bcrypt.hash("Password123", 10),
        role: "STATION_OFFICER",
      },
    ];

    for (const user of users) {
      const exists = await User.findOne({ email: user.email });
      if (!exists) {
        await User.create(user);
      }
    }

    console.log("Test users created");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedUsers();