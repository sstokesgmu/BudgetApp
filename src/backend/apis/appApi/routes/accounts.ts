import express, {Request, Response}from "express";
import AccountModel from "../models/account";

//create the mini app 
const router = express.Router();

router.get("/accountInfo", async (req: Request,res: Response) => {
    const accounts = await AccountModel.find({});
    try {
        res.send(accounts);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;