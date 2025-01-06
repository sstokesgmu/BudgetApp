import express,{Request,Response,Application,NextFunction} from "express";
import dotenv from "dotenv";
import session from "express-session";
import path from "path";
import connectDB from "./db.js";
const accountRoutes = require("./apis/appApi/routes/accountRoutes.js");
const userRoutes = require("./apis/appApi/routes/userRoutes.js");

connectDB();

dotenv.config();
const app:Application = express();
const PORT:Number = 8080;

declare module "express-session" {
    interface SessionData {
        access_token?: string;
    }
}

//Server static files form the "frontend" folder
app.use(express.static(path.join(__dirname, '../frontend')));

app.use(accountRoutes);
app.use(userRoutes);

//Create the homepage
app.get("/", async (_:Request, res:Response) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

