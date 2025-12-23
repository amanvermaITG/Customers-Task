// import { PrismaClient } from "@prisma/client";

// if (process.env.NODE_ENV !== "production") {
//   if (!global.prismaGlobal) {
//     global.prismaGlobal = new PrismaClient();
//   }
// }

// const prisma = global.prismaGlobal ?? new PrismaClient();

// export default prisma;

import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();




export const dbConnection = async () => {
  try {
    const connectionString = process.env.MONGO_URL;
    console.log(connectionString, '--- DataBase connection string ---');

    await mongoose.connect(connectionString);

    console.log(`--- Connected to MongoDB (${process.env.NODE_ENV}) Successfully ---`);
  } catch (error) {
    console.error(error, `--- MongoDB Connection Failed (${process.env.NODE_ENV}) ---`);
  }
};
dbConnection();
export default dbConnection;
