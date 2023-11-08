import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DATA_BASE,
    });
  } catch (error) {
    process.exit(1);
  }
};

export default connectDb;
