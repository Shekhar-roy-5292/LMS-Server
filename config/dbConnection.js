import mongoose from "mongoose";

mongoose.set("strictQuery", false);

const connectionToDb = async () => {
 try {
    const { connection } = await mongoose.connect(
        process.env.MONGO_URI || "mongodb://localhost:27017/lms"
      );
    
      if (connection){
        console.log("Connected to MongoDB!:", connection.host);
      }
 } catch (error) {
    console.log("Error connecting to MongoDB");
    process.exit(1);
 }
};

export default connectionToDb;
