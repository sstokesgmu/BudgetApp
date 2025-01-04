import {MongoClient} from "mongodb";
import dotenv from "dotenv";

dotenv.config();
//Replace the placeholder with your Atlas connection string
const uri = process.env.MONGO_URI || "";
const client = new MongoClient(uri);
async function run (){
    try {
        //Connect the client to the server 
        await client.connect();
        //Send a ping to confirm that a successful connection
        await client.db("sample_bank").command({ping:1});
        console.log("Pinged your development. You successfully connected to MongoDB");
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
    }
}

module.exports = run;

