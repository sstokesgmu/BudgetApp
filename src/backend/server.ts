import express, { Request, Response, Application} from "express";
import dotenv from "dotenv";
import session from "express-session";
import path from "path";
import ConnectToDB from "./db.js";

//? https://stackoverflow.com/questions/64383909/dirname-is-not-defined-error-in-node-js-14-version
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


//BudgetMe Api routes middleware
import accountRoutes from "./apis/appApi/routes/accountRoutes.js";
import userRoutes  from "./apis/appApi/routes/userRoutes.js";
import trans_Routes from "./apis/appApi/routes/transactionRoutes.js";


ConnectToDB(); 
dotenv.config(); 
const app: Application = express();
//Parse int returns a string, we don't know if the user is going to define a port so we default the value if
//the left side is null
const PORT: number = parseInt(process.env.PORT ?? "4000", 10);

// declare module "express-session" {
//   interface SessionData {
//     access_token?: string;
//   }
// }

app.use(express.json()); //TODO: Notes=> https://www.geeksforgeeks.org/express-js-express-json-function/

app.use("/api/accounts", accountRoutes);
app.use("/api/users", userRoutes);
app.use("/api/transactions", trans_Routes);

//Send all the frontend files to the middleware, change the url to access othe html files 
app.use(express.static(path.join(__dirname, "../frontend")));
app.use(express.static(path.join(__dirname, "../shared")));
console.log(path.join(__dirname, "../frontend"));
console.log(path.join(__dirname, "../shared"));


app.listen(PORT, () => {
  //console.log(path.join(__dirname, "../frontend"));
  console.log(`Server location: ${__dirname}`);
  console.log(`Server is running at http://localhost:${PORT}`);
});
