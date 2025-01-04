import dotenv from "dotenv";
const mongoose = require("mongoose");

dotenv.config();

async function run () {
    try {  
        mongoose.connect(process.env.MONGO_URI,{
            dbname: "sample_bank"
        }
        );
        mongoose.connection.once("open", () => {
            console.log("connected to mongodb");
        })
    } catch(error) {
        console.error("Something went wrong when connecting to the database", error);
    }
}

module.exports = run;














