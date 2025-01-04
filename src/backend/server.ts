import express,{Request,Response,Application,NextFunction} from "express";
import dotenv from "dotenv";
import session from "express-session";
import path from "path";

const connectToDB = require("./apis/appApi/conn.js");
connectToDB();

dotenv.config();
const app:Application = express();
const port:Number = 8080;

declare module "express-session" {
    interface SessionData {
        access_token?: string;
    }
}

//Server static files form the "frontend" folder
app.use(express.static(path.join(__dirname, '../frontend')));

app.get("/", async (_:Request, res:Response) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});



app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

