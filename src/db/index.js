import mongoose from "mongoose";
import { DB_NAME } from "../utils/constants.js";
const connect_DB=async()=>{
    try {
        const connection_instance = await mongoose.connect(`${process.env.MONGO_URI}`);
        console.log("MongoDB connected", connection_instance.connection.host);
    } catch (error) {
        console.log("MongoDB connection error", error);
        process.exit(1);
    }
}
export default connect_DB