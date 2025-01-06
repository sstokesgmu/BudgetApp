import express, {Request, Response} from "express";
import UserModel from "../models/user";

//create mini app
const router = express.Router();

router.get("/api/user", async ( _:Request , res:Response) => {
    const user = await UserModel.find({});
    try {
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;