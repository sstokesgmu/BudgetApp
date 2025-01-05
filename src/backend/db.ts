import dotenv from "dotenv";
import mongoose from "mongoose";
// const mongoose = require("mongoose");


dotenv.config();

export default function run () {
    try {  
        mongoose.connect(process.env.SAMPLE_BANK_URI as string,{
            dbName: "sample_bank"
        }
        );
    } catch(error) {
        console.error("Something went wrong when connecting to the database", error);
        process.exit(1);
    }

    const dbConnection = mongoose.connection;
    dbConnection.once("open", (_) => {
        console.dir(`Database connected: ${dbConnection.name} database`, {depth: null});
    })

    dbConnection.on("error", (err) => {
        console.error(`connection error: ${err}`)
    })
    return;
}














