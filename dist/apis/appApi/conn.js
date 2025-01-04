"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
//Replace the placeholder with your Atlas connection string
const uri = process.env.MONGO_URI || "";
const client = new mongodb_1.MongoClient(uri);
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //Connect the client to the server 
            yield client.connect();
            //Send a ping to confirm that a successful connection
            yield client.db("sample_bank").command({ ping: 1 });
            console.log("Pinged your development. You successfully connected to MongoDB");
        }
        catch (error) {
            console.error("Failed to connect to MongoDB:", error);
        }
    });
}
module.exports = run;
