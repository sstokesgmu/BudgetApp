import express, { Request, Response, Application} from "express";
import dotenv from "dotenv";
import session from "express-session";
import path from "path";
import ConnectToDB from "./db.js";

//BudgetMe Api routes middleware
const accountRoutes = require("./apis/appApi/routes/accountRoutes.js");
const userRoutes = require("./apis/appApi/routes/userRoutes.js");
const trans_Routes = require("./apis/appApi/routes/transactionRoutes.js");

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

app.listen(PORT, () => {
  console.log(`Server location: ${__dirname}`);
  console.log(`Server is running at http://localhost:${PORT}`);
});
