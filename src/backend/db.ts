import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
export default async function run () {
    try {  
        if(!process.env.SAMPLE_BANK_URI)
            throw new Error("Database URI is not defined, add URI to .env file");

        mongoose.connect(process.env.SAMPLE_BANK_URI ,{
            dbName: "sample_bank"
        });
    } catch(error) {
        //TODO: How do I see the disconnected event when I control + c 
        console.error("Something went wrong when connecting to the database", error);
        mongoose.disconnect();
        process.exit(1);
    }
    const dbConnection = mongoose.connection;
    dbConnection.on("error", (err) => {
        console.error(`connection error: ${err}`)
    })
    dbConnection.once("disconnected", () => {
        console.log("Disconnected from MongoDB");
    })
    dbConnection.once("connected", async () => {
        console.log(`Database connected: ${dbConnection.name} database`);
    })
    return;
}














