import express, {Request, Response}from "express";
import AccountModel from "../models/account";
import BucketModel from "../models/transactions";

//create the mini app 
const router = express.Router();

router.get("/", async (req: Request,res: Response) => {
    const accounts = await AccountModel.find({});
    try {
        res.send(accounts);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.patch("/balance/:accountId", async (req: Request, res:Response) => {
    const account = await AccountModel.findOne({"account_id" : req.params.accountId});
    const appliedBucket = await BucketModel.find({"account_id" : req.params.accountId});
    
    res.send({
        account,
        appliedBucket
    });
}); 

module.exports = router;