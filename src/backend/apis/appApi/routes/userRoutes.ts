import express, {Request, Response, Router} from "express";
import UserModel from "../models/user.js";

//create mini app
const router:Router = express.Router();

router.get("/", async ( _:Request , res:Response) => {
    const user = await UserModel.find({});
    try {
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});
export default router;