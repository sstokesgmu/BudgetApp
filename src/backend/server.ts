import express, { Request, Response, Application} from "express";
import dotenv from "dotenv";
import session from "express-session";
import path from "path";

import cors from 'cors';
import ConnectToDB from "./db.js";
import BucketModel from "./apis/appApi/models/transactions.js";




//? https://stackoverflow.com/questions/64383909/dirname-is-not-defined-error-in-node-js-14-version
import { fileURLToPath } from 'url';
import { dirname } from 'path';



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


//BudgetMe Api routes middleware
import accountRoutes from "./apis/appApi/routes/accountRoutes.js";
import userRoutes  from "./apis/appApi/routes/userRoutes.js";
import trans_Routes from "./apis/appApi/routes/transactionRoutes.js";
import {BudgetApp} from './tools/budgetMe.js'


ConnectToDB(); 
dotenv.config(); 
const app: Application = express();
//Parse int returns a string, we don't know if the user is going to define a port so we default the value if
//the left side is null
const PORT: number = parseInt(process.env.PORT ?? "4000", 10);
app.use(cors());
// declare module ["express-session" {
//   interface SessionData {
//     access_token?: string;
//   }
// }

app.use(express.json()); //TODO: Notes=> https://www.geeksforgeeks.org/express-js-express-json-function/

app.use("/api/users", userRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", trans_Routes);
app.use(BudgetApp.router);

//Send all the frontend files to the middleware, change the url to access othe html files 
app.use(express.static(path.join(__dirname, "../frontend")));
app.use(express.static(path.join(__dirname, "../shared")));
console.log(path.join(__dirname, "../frontend"));
console.log(path.join(__dirname, "../shared"));


// app.post('/user-accounts/seed', async (req:Request, res:Response) => {
//   try {
    

//   } catch(error) {
//     console.error()
//   }

// });
// app.get("/transactions/seed/:accountID", async (req,res) =>{
//   try {
//     await BucketModel.findOneAndUpdate(
//       {"account_id" : req.params.accountID},
//       {$pull: {"transactions": {}}},
//     );

//     const result = await BucketModel.findOneAndUpdate (
//       {"account_id": req.params.accountID},
//       {$push: {"transactions":transaction_seed}},
//       {new:true}
//     )
//     res.status(200).send(transaction_seed);

//   } catch (error) {
//     console.log(`Something went wrong loading seed data: ${error}`)
//   }
//})

//Adding 0.0.0.0 Makes the this interfaces on the LAN makes it on the public 
//network
//This is for testing 
app.listen(PORT,'0.0.0.0', () => {
  console.log(`Server location: ${__dirname}`);
  console.log(`Server is running at http://localhost:${PORT}`);
});

